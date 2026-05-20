<template>
  <div class="home" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in stats" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{ background: item.color }">
            <el-icon :size="28" color="#fff"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" style="margin-top: 24px;">
      <el-col :span="6" v-for="link in quickLinks" :key="link.path">
        <el-button type="primary" plain style="width: 100%; height: 80px;" @click="$router.push(link.path)">
          <el-icon style="margin-right: 8px;"><component :is="link.icon" /></el-icon>
          {{ link.label }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getStudentDashboard } from '@/api/dashboard'

const loading = ref(false)
const data = ref({})

const stats = computed(() => [
  { label: '加入社团', value: data.value.joinedClubCount || 0, icon: 'UserFilled', color: '#409eff' },
  { label: '可报名活动', value: data.value.availableActivityCount || 0, icon: 'Calendar', color: '#67c23a' },
  { label: '待审核申请', value: data.value.pendingApplicationCount || 0, icon: 'Document', color: '#e6a23c' },
  { label: '已参加活动', value: data.value.attendedActivityCount || 0, icon: 'CircleCheck', color: '#f56c6c' }
])

const quickLinks = [
  { label: '浏览社团', path: '/student/clubs', icon: 'Collection' },
  { label: '活动中心', path: '/student/activities', icon: 'Calendar' },
  { label: '我的申请', path: '/student/applications', icon: 'Document' },
  { label: '个人中心', path: '/student/profile', icon: 'User' }
]

onMounted(async () => {
  loading.value = true
  try {
    const res = await getStudentDashboard()
    data.value = res.data || {}
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.stat-card { display: flex; align-items: center; padding: 20px; }
.stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; flex-shrink: 0; }
.stat-value { font-size: 28px; font-weight: 700; color: #303133; }
.stat-label { font-size: 14px; color: #909399; margin-top: 4px; }
</style>
