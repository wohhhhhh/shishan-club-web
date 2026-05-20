<template>
  <div class="my-club-page">
    <div class="page-head">
      <div>
        <h1>我的社团</h1>
        <p>{{ pageDescription }}</p>
      </div>
      <div class="summary">
        <div>
          <span class="summary-value">{{ filteredClubs.length }}</span>
          <span class="summary-label">可管理社团</span>
        </div>
        <div>
          <span class="summary-value">{{ recruitingCount }}</span>
          <span class="summary-label">正在招新</span>
        </div>
      </div>
    </div>

    <section class="panel">
      <div class="filters">
        <el-input
          v-model="query.keyword"
          class="filter-input"
          clearable
          placeholder="搜索社团名称"
          :prefix-icon="Search"
        />
        <el-select v-model="query.status" class="filter-select" clearable placeholder="筛选招新状态">
          <el-option label="正常招新" value="NORMAL" />
          <el-option label="暂停招新" value="PAUSED" />
          <el-option label="已解散" value="DISSOLVED" />
        </el-select>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredClubs"
        class="club-table"
        row-key="clubId"
        stripe
      >
        <el-table-column prop="clubName" label="社团名称" min-width="150" />
        <el-table-column prop="college" label="所属学院" min-width="150" />
        <el-table-column label="人数" width="120">
          <template #default="{ row }">
            <span class="count-text">{{ row.currentCount }} / {{ row.maxCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="招新状态" width="120">
          <template #default="{ row }">
            <StatusTag type="club" :value="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="leaderName" label="负责人" width="110" />
        <el-table-column prop="leaderPhone" label="联系方式" width="140" />
        <el-table-column prop="recruitDeadline" label="招新截止日期" width="130" />
        <el-table-column label="社团简介" min-width="240">
          <template #default="{ row }">
            <span class="description" :title="row.description">{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!loading && filteredClubs.length === 0"
        description="没有符合条件的社团"
      />
    </section>

    <el-dialog
      v-model="dialogVisible"
      title="编辑社团信息"
      width="640px"
      :close-on-click-modal="false"
      class="edit-dialog"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="edit-form"
      >
        <div class="form-grid">
          <el-form-item label="社团名称" prop="clubName">
            <el-input v-model="form.clubName" maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="所属学院" prop="college">
            <el-input v-model="form.college" maxlength="40" />
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="form.leaderName" disabled />
          </el-form-item>
          <el-form-item label="负责人联系方式" prop="leaderPhone">
            <el-input v-model="form.leaderPhone" maxlength="20" />
          </el-form-item>
          <el-form-item label="当前人数">
            <el-input :model-value="form.currentCount" disabled />
          </el-form-item>
          <el-form-item label="人数上限" prop="maxCount">
            <el-input-number v-model="form.maxCount" :min="1" :precision="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="招新状态" prop="status">
            <el-select v-model="form.status" class="full-control">
              <el-option label="正常招新" value="NORMAL" />
              <el-option label="暂停招新" value="PAUSED" />
              <el-option label="已解散" value="DISSOLVED" />
            </el-select>
          </el-form-item>
          <el-form-item label="招新截止日期">
            <el-date-picker
              v-model="form.recruitDeadline"
              class="full-control"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>
        <el-form-item label="社团简介">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="saving" @click="saveClub">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAdminClubList, updateClub } from '@/api/club'
import { useUserStore } from '@/stores/user'
import StatusTag from '@/components/StatusTag.vue'

const userStore = useUserStore()
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const formRef = ref()
const clubs = ref([])

const query = reactive({
  keyword: '',
  status: ''
})

const form = reactive({
  clubId: '',
  clubName: '',
  college: '',
  currentCount: 0,
  maxCount: 1,
  status: 'NORMAL',
  leaderName: '',
  leaderPhone: '',
  recruitDeadline: '',
  description: ''
})

const statusTextMap = {
  NORMAL: '正常招新',
  PAUSED: '暂停招新',
  DISSOLVED: '已解散'
}

const isSystemAdmin = computed(() => ['admin', 'super_admin'].includes(userStore.role))

const pageDescription = computed(() => {
  return isSystemAdmin.value
    ? '系统管理员可查看和维护全部社团资料。'
    : '社团管理员仅可维护自己负责的社团资料。'
})

const managedClubs = computed(() => {
  if (isSystemAdmin.value) return clubs.value
  return clubs.value.filter(item => item.leaderId === userStore.userInfo?.studentId)
})

const filteredClubs = computed(() => {
  const keyword = query.keyword.trim()
  return managedClubs.value.filter(item => {
    const matchKeyword = !keyword || item.clubName?.includes(keyword)
    const matchStatus = !query.status || item.status === query.status
    return matchKeyword && matchStatus
  })
})

const recruitingCount = computed(() => {
  return filteredClubs.value.filter(item => item.status === 'NORMAL').length
})

const validateMaxCount = (rule, value, callback) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error('请输入人数上限'))
    return
  }
  if (Number(value) <= Number(form.currentCount)) {
    callback(new Error('人数上限必须大于当前人数'))
    return
  }
  callback()
}

const rules = {
  clubName: [{ required: true, message: '社团名称不能为空', trigger: 'blur' }],
  college: [{ required: true, message: '所属学院不能为空', trigger: 'blur' }],
  leaderPhone: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
  maxCount: [{ validator: validateMaxCount, trigger: 'change' }],
  status: [{ required: true, message: '请选择招新状态', trigger: 'change' }]
}

const fetchClubs = async () => {
  loading.value = true
  try {
    const res = await getAdminClubList({ page: 1, pageSize: 200 })
    clubs.value = res.data?.list || []
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  query.keyword = ''
  query.status = ''
}

const openEdit = (row) => {
  Object.assign(form, {
    clubId: row.clubId,
    clubName: row.clubName || '',
    college: row.college || '',
    currentCount: row.currentCount || 0,
    maxCount: row.maxCount || 1,
    status: row.status || 'NORMAL',
    leaderName: row.leaderName || '',
    leaderPhone: row.leaderPhone || '',
    recruitDeadline: row.recruitDeadline || '',
    description: row.description || ''
  })
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

const saveClub = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    const payload = {
      clubName: form.clubName,
      college: form.college,
      leaderPhone: form.leaderPhone,
      maxCount: form.maxCount,
      status: form.status,
      statusText: statusTextMap[form.status],
      recruitDeadline: form.recruitDeadline,
      description: form.description
    }
    await updateClub(form.clubId, payload)
    ElMessage.success('社团信息已更新')
    dialogVisible.value = false
    await fetchClubs()
  } finally {
    saving.value = false
  }
}

onMounted(fetchClubs)
</script>

<style scoped>
.my-club-page {
  max-width: 1180px;
  margin: 0 auto;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}

.page-head h1 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 650;
  color: #111827;
}

.page-head p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.summary {
  display: flex;
  gap: 12px;
}

.summary > div {
  min-width: 108px;
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.summary-value {
  display: block;
  font-size: 22px;
  font-weight: 650;
  line-height: 1;
  color: #111827;
}

.summary-label {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

.panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-input {
  width: 260px;
}

.filter-select {
  width: 180px;
}

.club-table {
  width: 100%;
}

.count-text {
  color: #374151;
  font-variant-numeric: tabular-nums;
}

.description {
  display: block;
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #4b5563;
}

.edit-form {
  padding-top: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.full-control {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-form-item__label) {
  color: #374151;
  font-weight: 500;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select .el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #d1d5db inset;
}

@media (max-width: 900px) {
  .page-head {
    align-items: stretch;
    flex-direction: column;
  }

  .summary {
    flex-wrap: wrap;
  }

  .filters {
    align-items: stretch;
    flex-direction: column;
  }

  .filter-input,
  .filter-select {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
