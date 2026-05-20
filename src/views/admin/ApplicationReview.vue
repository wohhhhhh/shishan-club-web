<template>
  <div class="application-review">
    <el-card class="toolbar">
      <el-select v-model="query.clubId" placeholder="选择社团" clearable style="width: 150px; margin-right: 8px;" @change="fetchList">
        <el-option v-for="c in clubOptions" :key="c.clubId" :label="c.clubName" :value="c.clubId" />
      </el-select>
      <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px; margin-right: 8px;" @change="fetchList">
        <el-option label="待审核" value="PENDING" />
        <el-option label="已通过" value="APPROVED" />
        <el-option label="已拒绝" value="REJECTED" />
      </el-select>
      <el-button type="primary" @click="fetchList">搜索</el-button>
    </el-card>

    <el-card v-loading="loading">
      <el-table :data="list" stripe>
        <el-table-column prop="applicationId" label="申请ID" width="80" />
        <el-table-column prop="clubName" label="社团名称" width="120" />
        <el-table-column prop="studentId" label="学号" width="100" />
        <el-table-column prop="studentName" label="姓名" width="80" />
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column prop="applyReason" label="申请理由" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><StatusTag type="application" :value="row.status" /></template>
        </el-table-column>
        <el-table-column prop="reviewComment" label="审核备注" show-overflow-tooltip width="120">
          <template #default="{ row }">{{ row.reviewComment || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :disabled="row.status !== 'PENDING'" @click="openReview(row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="total" v-model:current-page="query.page" @current-change="fetchList" />
      </div>
    </el-card>

    <el-dialog v-model="reviewVisible" title="审核申请" width="500px">
      <el-descriptions :column="1" border size="small" style="margin-bottom: 16px;">
        <el-descriptions-item label="申请人">{{ current.studentName }}（{{ current.studentId }}）</el-descriptions-item>
        <el-descriptions-item label="社团">{{ current.clubName }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ current.applyTime }}</el-descriptions-item>
        <el-descriptions-item label="申请理由">{{ current.applyReason }}</el-descriptions-item>
      </el-descriptions>
      <el-form label-width="80px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="reviewResult">
            <el-radio value="APPROVED">通过</el-radio>
            <el-radio value="REJECTED">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="reviewComment" type="textarea" :rows="3" placeholder="请输入审核备注..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" :loading="reviewing" @click="submitReview">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAdminApplications, reviewApplication } from '@/api/application'
import { getAdminClubList } from '@/api/club'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const clubOptions = ref([])
const query = reactive({ clubId: '', status: '', page: 1, pageSize: 10 })

const reviewVisible = ref(false)
const reviewing = ref(false)
const current = ref({})
const reviewResult = ref('APPROVED')
const reviewComment = ref('')

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getAdminApplications(query)
    list.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const fetchClubs = async () => {
  const res = await getAdminClubList({ page: 1, pageSize: 100 })
  clubOptions.value = res.data.list || []
}

const openReview = (row) => {
  current.value = row
  reviewResult.value = 'APPROVED'
  reviewComment.value = ''
  reviewVisible.value = true
}

const submitReview = async () => {
  reviewing.value = true
  try {
    await reviewApplication(current.value.applicationId, {
      status: reviewResult.value,
      reviewComment: reviewComment.value
    })
    ElMessage.success('审核完成')
    reviewVisible.value = false
    fetchList()
  } finally {
    reviewing.value = false
  }
}

onMounted(() => {
  fetchList()
  fetchClubs()
})
</script>

<style scoped>
.toolbar { margin-bottom: 16px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
