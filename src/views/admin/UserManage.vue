<template>
  <div class="admin-list-page">
    <div class="page-head">
      <div>
        <h1>用户管理</h1>
        <p>查看 mock 用户数据，支持按姓名、学号、角色和账号状态筛选。</p>
      </div>
    </div>

    <section class="panel">
      <div class="filters">
        <el-input v-model="query.keyword" class="filter-input" clearable placeholder="搜索姓名或学号" :prefix-icon="Search" @keyup.enter="fetchList" />
        <el-select v-model="query.role" class="filter-select" clearable placeholder="角色" @change="fetchList">
          <el-option label="普通学生" value="student" />
          <el-option label="社团负责人" value="leader" />
          <el-option label="社团管理员" value="club_admin" />
          <el-option label="系统管理员" value="admin" />
        </el-select>
        <el-select v-model="query.status" class="filter-select" clearable placeholder="账号状态" @change="fetchList">
          <el-option label="正常" value="正常" />
          <el-option label="禁用" value="禁用" />
        </el-select>
        <el-button type="primary" @click="fetchList">查询</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="list" row-key="studentId" stripe>
        <el-table-column prop="studentId" label="学号 / 账号" min-width="130" />
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="college" label="学院" min-width="160" />
        <el-table-column prop="className" label="班级" min-width="150" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="190" />
        <el-table-column label="角色" width="130">
          <template #default="{ row }">
            <el-tag size="small" :type="roleTagType(row.role)">{{ roleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === '禁用' ? 'danger' : 'success'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="query.page"
          background
          layout="total, prev, pager, next"
          :page-size="query.pageSize"
          :total="total"
          @current-change="fetchList"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getAdminUsers } from '@/api/user'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ keyword: '', role: '', status: '', page: 1, pageSize: 10 })

const roleMap = {
  student: '普通学生',
  leader: '社团负责人',
  club_admin: '社团管理员',
  admin: '系统管理员',
  super_admin: '系统管理员',
  officer: '社团管理员'
}

const roleText = role => roleMap[role] || role || '-'

const roleTagType = (role) => {
  if (['admin', 'super_admin'].includes(role)) return 'danger'
  if (['leader', 'club_admin', 'officer'].includes(role)) return 'warning'
  return 'info'
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getAdminUsers(query)
    list.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  query.keyword = ''
  query.role = ''
  query.status = ''
  query.page = 1
  fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.admin-list-page { max-width: 1180px; margin: 0 auto; }
.page-head { margin-bottom: 20px; }
.page-head h1 { margin: 0 0 6px; font-size: 24px; font-weight: 650; color: #111827; }
.page-head p { margin: 0; font-size: 14px; color: #6b7280; }
.panel { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; }
.filters { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.filter-input { width: 260px; }
.filter-select { width: 160px; }
.pagination { display: flex; justify-content: flex-end; margin-top: 16px; }
@media (max-width: 900px) {
  .filters { align-items: stretch; flex-direction: column; }
  .filter-input, .filter-select { width: 100%; }
}
</style>
