<template>
  <div class="admin-list-page">
    <div class="page-head">
      <div>
        <h1>社团管理</h1>
        <p>系统管理员维护全平台社团资料、招新状态和基础负责人信息。</p>
      </div>
      <el-button type="primary" @click="openCreate">
        <el-icon><Plus /></el-icon>
        新增社团
      </el-button>
    </div>

    <section class="panel">
      <div class="filters">
        <el-input v-model="query.keyword" class="filter-input" clearable placeholder="搜索社团名称" :prefix-icon="Search" @keyup.enter="fetchList" />
        <el-select v-model="query.status" class="filter-select" clearable placeholder="招新状态" @change="fetchList">
          <el-option label="正常招新" value="NORMAL" />
          <el-option label="暂停招新" value="PAUSED" />
          <el-option label="已解散" value="DISSOLVED" />
        </el-select>
        <el-button type="primary" @click="fetchList">查询</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="list" row-key="clubId" stripe>
        <el-table-column prop="clubName" label="社团名称" min-width="150" />
        <el-table-column prop="college" label="所属学院" min-width="150" />
        <el-table-column prop="leaderName" label="负责人" width="110" />
        <el-table-column prop="leaderPhone" label="联系方式" width="140" />
        <el-table-column label="人数" width="120">
          <template #default="{ row }">{{ row.currentCount }} / {{ row.maxCount }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }"><StatusTag type="club" :value="row.status" /></template>
        </el-table-column>
        <el-table-column prop="recruitDeadline" label="招新截止" width="130" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeClub(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="query.page"
          background
          layout="total, prev, pager, next"
          :page-size="query.pageSize"
          :total="total"
          @current-change="fetchList"
        />
      </div>
    </section>

    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑社团' : '新增社团'" width="640px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="form-grid">
          <el-form-item label="社团名称" prop="clubName"><el-input v-model="form.clubName" /></el-form-item>
          <el-form-item label="所属学院" prop="college"><el-input v-model="form.college" /></el-form-item>
          <el-form-item label="负责人学号" prop="leaderId"><el-input v-model="form.leaderId" /></el-form-item>
          <el-form-item label="负责人姓名" prop="leaderName"><el-input v-model="form.leaderName" /></el-form-item>
          <el-form-item label="联系方式" prop="leaderPhone"><el-input v-model="form.leaderPhone" /></el-form-item>
          <el-form-item label="人数上限" prop="maxCount"><el-input-number v-model="form.maxCount" :min="1" controls-position="right" /></el-form-item>
          <el-form-item label="招新状态" prop="status">
            <el-select v-model="form.status" class="full-control">
              <el-option label="正常招新" value="NORMAL" />
              <el-option label="暂停招新" value="PAUSED" />
              <el-option label="已解散" value="DISSOLVED" />
            </el-select>
          </el-form-item>
          <el-form-item label="招新截止日期"><el-date-picker v-model="form.recruitDeadline" class="full-control" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        </div>
        <el-form-item label="社团简介"><el-input v-model="form.description" type="textarea" :rows="4" maxlength="300" show-word-limit /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveClub">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { createClub, deleteClub, getAdminClubList, updateClub } from '@/api/club'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref()
const list = ref([])
const total = ref(0)

const query = reactive({ keyword: '', status: '', page: 1, pageSize: 10 })

const form = reactive({
  clubId: '',
  clubName: '',
  college: '',
  leaderId: '',
  leaderName: '',
  leaderPhone: '',
  maxCount: 60,
  status: 'NORMAL',
  recruitDeadline: '',
  description: ''
})

const statusTextMap = {
  NORMAL: '正常招新',
  PAUSED: '暂停招新',
  DISSOLVED: '已解散'
}

const rules = {
  clubName: [{ required: true, message: '请输入社团名称', trigger: 'blur' }],
  college: [{ required: true, message: '请输入所属学院', trigger: 'blur' }],
  leaderId: [{ required: true, message: '请输入负责人学号', trigger: 'blur' }],
  leaderName: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  leaderPhone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  status: [{ required: true, message: '请选择招新状态', trigger: 'change' }],
  maxCount: [{ required: true, message: '请输入人数上限', trigger: 'change' }]
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getAdminClubList(query)
    list.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  query.keyword = ''
  query.status = ''
  query.page = 1
  fetchList()
}

const resetForm = () => {
  Object.assign(form, {
    clubId: '',
    clubName: '',
    college: '',
    leaderId: '',
    leaderName: '',
    leaderPhone: '',
    maxCount: 60,
    status: 'NORMAL',
    recruitDeadline: '',
    description: ''
  })
}

const openCreate = () => {
  resetForm()
  editMode.value = false
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

const openEdit = (row) => {
  Object.assign(form, row)
  editMode.value = true
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

const saveClub = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    const payload = { ...form, statusText: statusTextMap[form.status] }
    if (editMode.value) {
      await updateClub(form.clubId, payload)
    } else {
      await createClub(payload)
    }
    ElMessage.success('社团信息已保存')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

const removeClub = async (row) => {
  await ElMessageBox.confirm(`确定删除「${row.clubName}」吗？`, '删除确认', { type: 'warning' })
  await deleteClub(row.clubId)
  ElMessage.success('社团已删除')
  fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.admin-list-page { max-width: 1180px; margin: 0 auto; }
.page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 20px; }
.page-head h1 { margin: 0 0 6px; font-size: 24px; font-weight: 650; color: #111827; }
.page-head p { margin: 0; font-size: 14px; color: #6b7280; }
.panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; }
.filters { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.filter-input { width: 260px; }
.filter-select { width: 180px; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 18px; }
.full-control { width: 100%; }
@media (max-width: 900px) {
  .page-head, .filters { align-items: stretch; flex-direction: column; }
  .filter-input, .filter-select { width: 100%; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
