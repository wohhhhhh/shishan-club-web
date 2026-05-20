<template>
  <div class="my-applications">
    <el-card class="search-card">
      <el-form :inline="true">
        <el-form-item label="申请状态">
          <el-select v-model="query.status" clearable placeholder="全部" @change="fetchList">
            <el-option label="待审核" value="PENDING" />
            <el-option label="已通过" value="APPROVED" />
            <el-option label="已拒绝" value="REJECTED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="loading">
      <el-table :data="list">
        <el-table-column prop="clubName" label="社团名称" />
        <el-table-column prop="applyTime" label="申请时间" />
        <el-table-column prop="applyReason" label="申请理由" show-overflow-tooltip />
        <el-table-column label="状态">
          <template #default="{ row }"><StatusTag type="application" :value="row.status" /></template>
        </el-table-column>
        <el-table-column prop="reviewTime" label="审核时间">
          <template #default="{ row }">{{ row.reviewTime || '-' }}</template>
        </el-table-column>
        <el-table-column label="审核备注">
          <template #default="{ row }">{{ row.reviewComment || '-' }}</template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && list.length === 0" description="暂无申请记录" />
      <div class="pagination" v-if="total > 0">
        <el-pagination background layout="prev, pager, next" :total="total" v-model:current-page="query.page" @current-change="fetchList" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMyApplications } from '@/api/application'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ status: '', page: 1, pageSize: 10 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getMyApplications(query)
    list.value = res.data.list || []
    total.value = res.data.total || 0
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped>
.search-card { margin-bottom: 16px; }
.pagination { margin-top: 16px; display: flex; justify-content: center; }
</style>
