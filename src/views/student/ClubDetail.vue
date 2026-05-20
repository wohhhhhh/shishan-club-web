<template>
  <div class="club-detail" v-loading="loading">
    <el-page-header @back="$router.back()" :content="club.clubName || '社团详情'" style="margin-bottom: 20px;" />
    <el-card v-if="club.clubId">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="所属学院">{{ club.college }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ club.leaderName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ club.leaderPhone }}</el-descriptions-item>
        <el-descriptions-item label="成立日期">{{ club.establishDate }}</el-descriptions-item>
        <el-descriptions-item label="社团人数">
          <el-progress :percentage="Math.round(club.currentCount / club.maxCount * 100)" :stroke-width="16" style="width: 180px;" />
          {{ club.currentCount }} / {{ club.maxCount }}
        </el-descriptions-item>
        <el-descriptions-item label="招新状态"><StatusTag type="club" :value="club.status" /></el-descriptions-item>
        <el-descriptions-item label="招募截止">{{ club.recruitDeadline }}</el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <h3>社团简介</h3>
      <p style="color: #606266; line-height: 1.8;">{{ club.description }}</p>
      <el-divider />
      <div style="text-align: center;">
        <template v-if="club.canApply">
          <el-button type="primary" size="large" @click="showApplyDialog = true">申请加入</el-button>
        </template>
        <template v-else>
          <el-button size="large" disabled>{{ club.cannotApplyReason || '暂不可申请' }}</el-button>
        </template>
      </div>
    </el-card>

    <el-dialog v-model="showApplyDialog" title="申请加入社团" width="450px">
      <el-form :model="applyForm">
        <el-form-item label="申请理由">
          <el-input v-model="applyForm.applyReason" type="textarea" :rows="4" placeholder="请输入你的申请理由..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showApplyDialog = false">取消</el-button>
        <el-button type="primary" :loading="applyLoading" @click="handleApply">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getClubDetail, applyClub } from '@/api/club'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const applyLoading = ref(false)
const club = ref({})
const showApplyDialog = ref(false)
const applyForm = reactive({ applyReason: '' })

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await getClubDetail(route.params.id)
    club.value = res.data || {}
  } finally {
    loading.value = false
  }
}

const handleApply = async () => {
  if (!applyForm.applyReason.trim()) { ElMessage.warning('请输入申请理由'); return }
  applyLoading.value = true
  try {
    await applyClub(route.params.id, applyForm)
    ElMessage.success('申请已提交')
    showApplyDialog.value = false
    applyForm.applyReason = ''
    fetchDetail()
  } finally {
    applyLoading.value = false
  }
}

onMounted(fetchDetail)
</script>

<style scoped>
</style>
