<template>
  <div class="my-activities">
    <el-card v-loading="loading">
      <el-table :data="list">
        <el-table-column prop="activityName" label="活动名称" />
        <el-table-column prop="clubName" label="所属社团" />
        <el-table-column prop="activityTime" label="活动时间" />
        <el-table-column prop="location" label="地点" />
        <el-table-column prop="signupTime" label="报名时间" />
        <el-table-column label="活动状态">
          <template #default="{ row }"><StatusTag type="activity" :value="row.activityStatus" /></template>
        </el-table-column>
        <el-table-column label="签到状态">
          <template #default="{ row }"><StatusTag type="checkin" :value="row.checkinStatus" /></template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && list.length === 0" description="暂无活动记录" />
      <div class="pagination" v-if="total > 0">
        <el-pagination background layout="prev, pager, next" :total="total" v-model:current-page="query.page" @current-change="fetchList" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMyActivities } from '@/api/activity'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getMyActivities(query)
    list.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped>
.pagination { margin-top: 16px; display: flex; justify-content: center; }
</style>
