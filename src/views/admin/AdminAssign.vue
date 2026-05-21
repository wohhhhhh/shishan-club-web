<template>
  <div class="admin-assign-page">
    <div class="page-head">
      <div>
        <h1>管理员分配</h1>
        <p>为社团分配管理人，社团后台入口和负责人信息会随分配结果同步更新。</p>
      </div>
      <div class="summary">
        <div>
          <span>{{ clubs.length }}</span>
          <small>社团总数</small>
        </div>
        <div>
          <span>{{ assignedCount }}</span>
          <small>已分配</small>
        </div>
        <div>
          <span>{{ unassignedCount }}</span>
          <small>待分配</small>
        </div>
      </div>
    </div>

    <section class="panel">
      <div class="filters">
        <el-input
          v-model="query.keyword"
          class="filter-input"
          clearable
          placeholder="搜索社团、管理员姓名或学号"
          :prefix-icon="Search"
        />
        <el-select v-model="query.assignState" class="filter-select" clearable placeholder="分配状态">
          <el-option label="已分配" value="assigned" />
          <el-option label="待分配" value="unassigned" />
        </el-select>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="filteredClubs" row-key="clubId" stripe>
        <el-table-column prop="clubName" label="社团名称" min-width="170" />
        <el-table-column prop="college" label="所属学院" min-width="150" />
        <el-table-column label="当前管理员" min-width="210">
          <template #default="{ row }">
            <div v-if="row.leaderId" class="manager-cell">
              <strong>{{ row.leaderName || '-' }}</strong>
              <span>{{ row.leaderId }}</span>
            </div>
            <el-tag v-else size="small" type="info">待分配</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="126">
          <template #default="{ row }">
            <el-tag v-if="managerUser(row)" size="small" :type="roleTagType(managerUser(row).role)">
              {{ roleText(managerUser(row).role) }}
            </el-tag>
            <el-tag v-else-if="row.leaderId" size="small" type="warning">负责人</el-tag>
            <span v-else class="muted">-</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" width="150">
          <template #default="{ row }">{{ row.leaderPhone || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openAssign(row)">
              {{ row.leaderId ? '更换' : '分配' }}
            </el-button>
            <el-button link type="danger" :disabled="!row.leaderId" @click="removeManager(row)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && filteredClubs.length === 0" description="没有符合条件的社团" />
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="selectedClub?.leaderId ? '更换社团管理员' : '分配社团管理员'"
      width="560px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedClub" class="club-brief">
        <div>
          <span>社团</span>
          <strong>{{ selectedClub.clubName }}</strong>
        </div>
        <div>
          <span>当前管理员</span>
          <strong>{{ selectedClub.leaderName || '待分配' }}</strong>
        </div>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="选择学生账号" prop="studentId">
          <el-select
            v-model="form.studentId"
            class="full-control"
            filterable
            no-data-text="没有可分配的学生账号"
            placeholder="按姓名或学号查找"
          >
            <el-option
              v-for="user in assignableUsers"
              :key="user.studentId"
              :label="`${user.name} (${user.studentId})`"
              :value="user.studentId"
            >
              <div class="user-option">
                <span>{{ user.name }} · {{ user.studentId }}</span>
                <small>{{ user.college || '未设置学院' }}</small>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="selectedUser" class="user-preview">
        <div>
          <span>账号角色</span>
          <strong>{{ roleText(selectedUser.role) }}</strong>
        </div>
        <div>
          <span>学院</span>
          <strong>{{ selectedUser.college || '-' }}</strong>
        </div>
        <div>
          <span>联系方式</span>
          <strong>{{ selectedUser.phone || '-' }}</strong>
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveAssign">确认分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { assignClubAdmin, getAdminClubList, removeClubAdmin } from '@/api/club'
import { getAdminUsers } from '@/api/user'

const loading = ref(false)
const saving = ref(false)
const clubs = ref([])
const users = ref([])
const dialogVisible = ref(false)
const selectedClub = ref(null)
const formRef = ref()

const query = reactive({ keyword: '', assignState: '' })
const form = reactive({ studentId: '' })

const roleMap = {
  student: '普通学生',
  leader: '社团负责人',
  club_admin: '社团管理员',
  officer: '社团管理员',
  admin: '系统管理员',
  super_admin: '系统管理员'
}

const rules = {
  studentId: [{ required: true, message: '请选择学生账号', trigger: 'change' }]
}

const roleText = role => roleMap[role] || role || '-'

const roleTagType = role => {
  if (['admin', 'super_admin'].includes(role)) return 'danger'
  if (['leader', 'club_admin', 'officer'].includes(role)) return 'warning'
  return 'info'
}

const userMap = computed(() => {
  return new Map(users.value.map(user => [user.studentId, user]))
})

const managerUser = row => userMap.value.get(row.leaderId)

const assignableUsers = computed(() => {
  return users.value.filter(user => {
    const enabled = user.status !== '禁用'
    const systemRole = ['admin', 'super_admin'].includes(user.role)
    return enabled && !systemRole
  })
})

const selectedUser = computed(() => userMap.value.get(form.studentId))

const assignedCount = computed(() => clubs.value.filter(item => item.leaderId).length)
const unassignedCount = computed(() => Math.max(0, clubs.value.length - assignedCount.value))

const filteredClubs = computed(() => {
  const keyword = query.keyword.trim()
  return clubs.value.filter(item => {
    const manager = managerUser(item)
    const matchKeyword = !keyword
      || String(item.clubName || '').includes(keyword)
      || String(item.leaderName || '').includes(keyword)
      || String(item.leaderId || '').includes(keyword)
      || String(manager?.name || '').includes(keyword)
    const matchState = !query.assignState
      || (query.assignState === 'assigned' && item.leaderId)
      || (query.assignState === 'unassigned' && !item.leaderId)
    return matchKeyword && matchState
  })
})

const loadPagedList = async (loader, pageSize) => {
  const firstRes = await loader({ page: 1, pageSize })
  const firstPage = firstRes.data || {}
  const list = [...(firstPage.list || [])]
  const total = Number(firstPage.total || list.length)
  const totalPages = Math.ceil(total / pageSize)

  if (totalPages <= 1) return list

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => loader({ page: index + 2, pageSize }))
  )
  rest.forEach(res => list.push(...(res.data?.list || [])))
  return list
}

const fetchData = async () => {
  loading.value = true
  try {
    const [clubList, userList] = await Promise.all([
      loadPagedList(getAdminClubList, 100),
      loadPagedList(getAdminUsers, 100)
    ])
    clubs.value = clubList
    users.value = userList
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  query.keyword = ''
  query.assignState = ''
}

const openAssign = row => {
  selectedClub.value = row
  form.studentId = row.leaderId || ''
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

const saveAssign = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid || !selectedClub.value) return

  saving.value = true
  try {
    await assignClubAdmin(selectedClub.value.clubId, { studentId: form.studentId })
    ElMessage.success('社团管理员已更新')
    dialogVisible.value = false
    await fetchData()
  } finally {
    saving.value = false
  }
}

const removeManager = async row => {
  await ElMessageBox.confirm(`确定撤销「${row.clubName}」的管理员吗？`, '撤销确认', { type: 'warning' })
  await removeClubAdmin(row.clubId)
  ElMessage.success('社团管理员已撤销')
  await fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.admin-assign-page { max-width: 1180px; margin: 0 auto; }
.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 20px; }
.page-head h1 { margin: 0 0 6px; color: #111827; font-size: 24px; font-weight: 650; }
.page-head p { margin: 0; color: #6b7280; font-size: 14px; }
.summary { display: flex; gap: 12px; }
.summary div { min-width: 104px; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
.summary span { display: block; color: #111827; font-size: 22px; line-height: 1; font-weight: 650; }
.summary small { display: block; margin-top: 6px; color: #6b7280; font-size: 12px; }
.panel { padding: 18px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
.filters { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.filter-input { width: 300px; }
.filter-select { width: 160px; }
.manager-cell { display: grid; gap: 3px; }
.manager-cell strong { color: #111827; font-weight: 600; }
.manager-cell span, .muted { color: #6b7280; font-size: 13px; }
.club-brief, .user-preview { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 18px; }
.club-brief div, .user-preview div { min-height: 72px; padding: 14px; display: grid; align-content: center; gap: 6px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f8fafc; }
.club-brief span, .user-preview span { color: #6b7280; font-size: 12px; }
.club-brief strong, .user-preview strong { color: #111827; font-size: 15px; line-height: 1.35; }
.user-preview { grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 4px 0 0; }
.user-option { display: flex; justify-content: space-between; gap: 16px; }
.user-option small { color: #909399; }
.full-control { width: 100%; }
:deep(.el-dialog) { border-radius: 12px; }
@media (max-width: 900px) {
  .page-head, .filters { align-items: stretch; flex-direction: column; }
  .summary { flex-wrap: wrap; }
  .filter-input, .filter-select { width: 100%; }
  .club-brief, .user-preview { grid-template-columns: 1fr; }
}
</style>
