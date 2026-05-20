<template>
  <div class="activity-detail" v-loading="loading">
    <el-page-header @back="$router.back()" :content="activity.activityName || '活动详情'" style="margin-bottom: 20px;" />
    <el-card v-if="activity.activityId">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="活动名称" :span="2">{{ activity.activityName }}</el-descriptions-item>
        <el-descriptions-item label="所属社团">{{ activity.clubName }}</el-descriptions-item>
        <el-descriptions-item label="主负责人">{{ activity.leaderName }}</el-descriptions-item>
        <el-descriptions-item label="活动时间">{{ activity.activityTime }}</el-descriptions-item>
        <el-descriptions-item label="活动地点">{{ activity.location }}</el-descriptions-item>
        <el-descriptions-item label="人数限制">
          <el-progress :percentage="Math.round(activity.currentCount / activity.maxCount * 100)" :stroke-width="16" style="width: 180px;" />
          {{ activity.currentCount }} / {{ activity.maxCount }}
        </el-descriptions-item>
        <el-descriptions-item label="报名截止">{{ activity.signupDeadline }}</el-descriptions-item>
        <el-descriptions-item label="活动状态"><StatusTag type="activity" :value="activity.status" /></el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <h3>活动内容</h3>
      <p style="color: #606266; line-height: 1.8; white-space: pre-wrap;">{{ activity.content }}</p>
      <el-divider />
      <div style="text-align: center;">
        <template v-if="activity.hasSignedUp">
          <el-tag type="success" size="large">已报名</el-tag>
          <el-button type="danger" style="margin-left: 16px;" @click="handleCancel">取消报名</el-button>
        </template>
        <template v-else-if="activity.canSignup">
          <el-button type="primary" size="large" :loading="signupLoading" @click="handleSignup">立即报名</el-button>
        </template>
        <template v-else>
          <el-button size="large" disabled>{{ activity.cannotSignupReason || '暂不可报名' }}</el-button>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getActivityDetail, signupActivity, cancelSignup } from '@/api/activity'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
const loading = ref(false)
const signupLoading = ref(false)
const activity = ref({})

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await getActivityDetail(route.params.id)
    activity.value = res.data || {}
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  signupLoading.value = true
  try {
    await signupActivity(route.params.id, {})
    ElMessage.success('报名成功')
    fetchDetail()
  } finally {
    signupLoading.value = false
  }
}

const handleCancel = async () => {
  await ElMessageBox.confirm('确定要取消报名吗？', '提示', { type: 'warning' })
  try {
    await cancelSignup(route.params.id)
    ElMessage.success('已取消报名')
    fetchDetail()
  } catch {}
}

onMounted(fetchDetail)
</script>

<style scoped>
</style>
