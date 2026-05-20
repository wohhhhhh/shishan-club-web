<template>
  <div class="admin-list-page">
    <div class="page-head">
      <div>
        <h1>活动管理</h1>
        <p>发布、编辑和管理社团活动，活动会同步展示到前台活动中心。</p>
      </div>
      <el-button type="primary" @click="openCreate">
        <el-icon><Plus /></el-icon>
        新增活动
      </el-button>
    </div>

    <section class="panel">
      <div class="filters">
        <el-input v-model="query.keyword" class="filter-input" clearable placeholder="搜索活动名称" :prefix-icon="Search" @keyup.enter="fetchList" />
        <el-select v-model="query.status" class="filter-select" clearable placeholder="活动状态" @change="fetchList">
          <el-option label="报名中" value="SIGNING" />
          <el-option label="进行中" value="ONGOING" />
          <el-option label="已结束" value="ENDED" />
          <el-option label="已取消" value="CANCELLED" />
        </el-select>
        <el-button type="primary" @click="fetchList">查询</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="list" row-key="activityId" stripe>
        <el-table-column prop="activityName" label="活动名称" min-width="180" />
        <el-table-column prop="clubName" label="所属社团" min-width="140" />
        <el-table-column prop="activityTime" label="活动时间" width="170" />
        <el-table-column prop="location" label="地点" min-width="130" />
        <el-table-column label="人数" width="110">
          <template #default="{ row }">{{ row.currentCount }} / {{ row.maxCount }}</template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }"><StatusTag type="activity" :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeActivity(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑活动' : '新增活动'" width="660px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <div class="form-grid">
          <el-form-item label="活动名称" prop="activityName"><el-input v-model="form.activityName" /></el-form-item>
          <el-form-item label="所属社团" prop="clubId">
            <el-select v-model="form.clubId" class="full-control" @change="syncClubName">
              <el-option v-for="club in clubOptions" :key="club.clubId" :label="club.clubName" :value="club.clubId" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间" prop="activityTime"><el-date-picker v-model="form.activityTime" class="full-control" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" /></el-form-item>
          <el-form-item label="地点" prop="location"><el-input v-model="form.location" /></el-form-item>
          <el-form-item label="人数上限" prop="maxCount"><el-input-number v-model="form.maxCount" :min="1" controls-position="right" /></el-form-item>
          <el-form-item label="报名截止"><el-date-picker v-model="form.signupDeadline" class="full-control" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" /></el-form-item>
          <el-form-item label="活动状态" prop="status">
            <el-select v-model="form.status" class="full-control">
              <el-option label="报名中" value="SIGNING" />
              <el-option label="进行中" value="ONGOING" />
              <el-option label="已结束" value="ENDED" />
              <el-option label="已取消" value="CANCELLED" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="活动内容"><el-input v-model="form.content" type="textarea" :rows="4" maxlength="400" show-word-limit /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveActivity">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { createActivity, deleteActivity, getAdminActivityList, updateActivity } from '@/api/activity'
import { getAdminClubList } from '@/api/club'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const editMode = ref(false)
const formRef = ref()
const list = ref([])
const total = ref(0)
const clubOptions = ref([])

const query = reactive({ keyword: '', status: '', page: 1, pageSize: 10 })
const form = reactive({
  activityId: '',
  activityName: '',
  clubId: '',
  clubName: '',
  activityTime: '',
  location: '',
  maxCount: 50,
  signupDeadline: '',
  content: '',
  status: 'SIGNING'
})

const rules = {
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  clubId: [{ required: true, message: '请选择所属社团', trigger: 'change' }],
  activityTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  maxCount: [{ required: true, message: '请输入人数上限', trigger: 'change' }],
  status: [{ required: true, message: '请选择活动状态', trigger: 'change' }]
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getAdminActivityList(query)
    list.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

const fetchClubs = async () => {
  const res = await getAdminClubList({ page: 1, pageSize: 200 })
  clubOptions.value = res.data?.list || []
}

const resetFilters = () => {
  query.keyword = ''
  query.status = ''
  query.page = 1
  fetchList()
}

const resetForm = () => {
  Object.assign(form, {
    activityId: '',
    activityName: '',
    clubId: '',
    clubName: '',
    activityTime: '',
    location: '',
    maxCount: 50,
    signupDeadline: '',
    content: '',
    status: 'SIGNING'
  })
}

const syncClubName = () => {
  const club = clubOptions.value.find(item => item.clubId === form.clubId)
  form.clubName = club?.clubName || ''
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

const saveActivity = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  syncClubName()
  saving.value = true
  try {
    if (editMode.value) {
      await updateActivity(form.activityId, form)
    } else {
      await createActivity(form)
    }
    ElMessage.success('活动信息已保存')
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

const removeActivity = async (row) => {
  await ElMessageBox.confirm(`确定删除「${row.activityName}」吗？`, '删除确认', { type: 'warning' })
  await deleteActivity(row.activityId)
  ElMessage.success('活动已删除')
  fetchList()
}

onMounted(() => {
  fetchList()
  fetchClubs()
})
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
