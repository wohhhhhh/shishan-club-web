<template>
  <div class="admin-home" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in stats" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="margin-top: 24px;">
      <template #header><span>最近申请</span></template>
      <el-table :data="recentApps" size="small">
        <el-table-column prop="studentName" label="申请人" width="100" />
        <el-table-column prop="clubName" label="社团" />
        <el-table-column prop="applyTime" label="申请时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><StatusTag type="application" :value="row.status" /></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAdminDashboard } from '@/api/dashboard'
import { getAdminApplications } from '@/api/application'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const dashData = ref({})
const recentApps = ref([])

const stats = computed(() => [
  { label: '社团总数', value: dashData.value.clubCount || 0 },
  { label: '学生总数', value: dashData.value.studentCount || 0 },
  { label: '成员总数', value: dashData.value.memberCount || 0 },
  { label: '活动总数', value: dashData.value.activityCount || 0 },
  { label: '待审核', value: dashData.value.pendingApplicationCount || 0 }
])

onMounted(async () => {
  loading.value = true
  try {
    const [d, a] = await Promise.all([getAdminDashboard(), getAdminApplications({ page: 1, pageSize: 5 })])
    dashData.value = d.data || {}
    recentApps.value = a.data?.list || []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stat-card { text-align: center; padding: 20px; }
.stat-value { font-size: 32px; font-weight: 700; color: #409eff; }
.stat-label { font-size: 14px; color: #909399; margin-top: 8px; }
</style>
