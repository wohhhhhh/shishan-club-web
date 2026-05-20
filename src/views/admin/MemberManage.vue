<template>
  <div class="member-manage">
    <el-card class="toolbar">
      <el-select v-model="selectedClubId" placeholder="选择社团" style="width: 180px; margin-right: 12px;" @change="fetchMembers">
        <el-option v-for="c in clubOptions" :key="c.clubId" :label="c.clubName" :value="c.clubId" />
      </el-select>
    </el-card>

    <el-card v-if="selectedClubId" v-loading="loading">
      <el-table :data="list" stripe>
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="studentName" label="姓名" width="80" />
        <el-table-column prop="college" label="学院" width="140" />
        <el-table-column prop="className" label="班级" width="100" />
        <el-table-column prop="joinTime" label="加入时间" width="110" />
        <el-table-column prop="positionText" label="职务" width="80" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><StatusTag type="member" :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="cmd => handlePosition(cmd, row)">
              <el-button link type="primary" size="small">设置职务</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="p in positions" :key="p" :command="p">{{ p }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button link type="danger" size="small" :disabled="row.status !== 'ACTIVE'" @click="handleRemove(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="total" v-model:current-page="page" @current-change="fetchMembers" />
      </div>
    </el-card>
    <el-empty v-else description="请先选择社团" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMemberList, updateMemberPosition, updateMemberStatus } from '@/api/member'
import { getAdminClubList } from '@/api/club'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const page = ref(1)
const selectedClubId = ref('')
const clubOptions = ref([])
const positions = ['会长', '副会长', '部长', '副部长', '干事', '普通成员']

const fetchClubs = async () => {
  const res = await getAdminClubList({ page: 1, pageSize: 100 })
  clubOptions.value = res.data.list || []
}

const fetchMembers = async () => {
  if (!selectedClubId.value) return
  loading.value = true
  try {
    const res = await getMemberList(selectedClubId.value, { page: page.value, pageSize: 10 })
    list.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

const handlePosition = async (position, row) => {
  try {
    await updateMemberPosition(row.memberId, { position })
    ElMessage.success(`已设为${position}`)
    fetchMembers()
  } catch {}
}

const handleRemove = async (row) => {
  await ElMessageBox.confirm(`确定移除成员 ${row.studentName} 吗？`, '警告', { type: 'warning' })
  await updateMemberStatus(row.memberId, { status: 'REMOVED' })
  ElMessage.success('已移除')
  fetchMembers()
}

onMounted(fetchClubs)
</script>

<style scoped>
.toolbar { margin-bottom: 16px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
