<template>
  <div class="signup-manage">
    <el-card class="toolbar">
      <el-select v-model="selectedActivityId" placeholder="选择活动" style="width: 200px; margin-right: 12px;" @change="fetchSignups">
        <el-option v-for="a in activityOptions" :key="a.activityId" :label="a.activityName" :value="a.activityId" />
      </el-select>
    </el-card>

    <el-card v-if="selectedActivityId" v-loading="loading">
      <el-table :data="list" stripe>
        <el-table-column prop="signupId" label="报名ID" width="80" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="studentName" label="姓名" width="80" />
        <el-table-column prop="signupTime" label="报名时间" width="160" />
        <el-table-column label="签到状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.checkinStatus === 'CHECKED_IN' ? 'success' : row.checkinStatus === 'ABSENT' ? 'danger' : 'info'" size="small">
              {{ checkinText(row.checkinStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkinTime" label="签到时间" width="160">
          <template #default="{ row }">{{ row.checkinTime || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <template v-if="row.checkinStatus === 'NOT_STARTED'">
              <el-button link type="success" @click="handleCheckin(row)">签到</el-button>
              <el-button link type="warning" @click="handleAbsent(row)">缺席</el-button>
            </template>
            <span v-else style="color: #909399; font-size: 13px;">已处理</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="total" v-model:current-page="page" @current-change="fetchSignups" />
      </div>
    </el-card>
    <el-empty v-else description="请先选择活动" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSignupList, checkinSignup } from '@/api/signup'
import { getAdminActivityList } from '@/api/activity'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const page = ref(1)
const selectedActivityId = ref('')
const activityOptions = ref([])

const checkinText = (s) => ({ NOT_STARTED: '未开始', CHECKED_IN: '已签到', ABSENT: '已缺席' }[s] || s)

const fetchActivities = async () => {
  const res = await getAdminActivityList({ page: 1, pageSize: 100 })
  activityOptions.value = res.data.list || []
}

const fetchSignups = async () => {
  if (!selectedActivityId.value) return
  loading.value = true
  try {
    const res = await getSignupList(selectedActivityId.value, { page: page.value, pageSize: 10 })
    list.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const handleCheckin = async (row) => {
  await checkinSignup(selectedActivityId.value, row.signupId, { checkinStatus: 'CHECKED_IN' })
  ElMessage.success('签到成功')
  fetchSignups()
}

const handleAbsent = async (row) => {
  await checkinSignup(selectedActivityId.value, row.signupId, { checkinStatus: 'ABSENT' })
  ElMessage.success('已标记缺席')
  fetchSignups()
}

onMounted(fetchActivities)
</script>

<style scoped>
.toolbar { margin-bottom: 16px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
