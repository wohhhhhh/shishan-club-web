<template>
  <div class="my-clubs" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12" v-for="item in list" :key="item.memberId" style="margin-bottom: 20px;">
        <el-card shadow="hover">
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 16px; font-weight: 600;">{{ item.clubName }}</span>
              <StatusTag type="member" :value="item.status" />
            </div>
          </template>
          <p><el-icon><OfficeBuilding /></el-icon> {{ item.college }}</p>
          <p><el-icon><User /></el-icon> 负责人：{{ item.studentName === '李四' ? item.studentName : item.studentName }}</p>
          <p><el-icon><Calendar /></el-icon> 加入时间：{{ item.joinTime }}</p>
          <p><el-icon><Stamp /></el-icon> 职务：<el-tag size="small">{{ item.positionText }}</el-tag></p>
          <div style="margin-top: 12px; text-align: right;">
            <el-button type="danger" text size="small" @click="handleQuit(item)">申请退社</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!loading && list.length === 0" description="暂未加入任何社团" />

    <el-dialog v-model="showQuitDialog" title="申请退社" width="450px">
      <el-form>
        <el-form-item label="退社原因">
          <el-input v-model="quitReason" type="textarea" :rows="4" placeholder="请输入退社原因..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showQuitDialog = false">取消</el-button>
        <el-button type="primary" :loading="quitLoading" @click="confirmQuit">确认退社</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMyClubs, quitClub } from '@/api/member'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const list = ref([])
const showQuitDialog = ref(false)
const quitReason = ref('')
const quitLoading = ref(false)
const currentClubId = ref('')

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getMyClubs()
    list.value = res.data || []
  } finally {
    loading.value = false
  }
}

const handleQuit = (item) => {
  currentClubId.value = item.clubId
  quitReason.value = ''
  showQuitDialog.value = true
}

const confirmQuit = async () => {
  if (!quitReason.value.trim()) { ElMessage.warning('请输入退社原因'); return }
  quitLoading.value = true
  try {
    await quitClub(currentClubId.value, { quitReason: quitReason.value })
    ElMessage.success('退社申请已提交')
    showQuitDialog.value = false
    fetchList()
  } finally {
    quitLoading.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped>
p { margin: 8px 0; color: #606266; font-size: 14px; display: flex; align-items: center; gap: 6px; }
</style>
