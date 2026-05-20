<template>
  <div class="activity-list">
    <el-card class="search-card">
      <el-form :inline="true" :model="query">
        <el-form-item label="活动名称">
          <el-input v-model="query.keyword" placeholder="搜索活动" clearable @clear="fetchList" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable @change="fetchList">
            <el-option label="报名中" value="SIGNING" />
            <el-option label="进行中" value="ONGOING" />
            <el-option label="已结束" value="ENDED" />
            <el-option label="已取消" value="CANCELLED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="12" v-for="act in list" :key="act.activityId" style="margin-bottom: 20px;">
        <el-card shadow="hover" class="activity-card">
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 16px; font-weight: 600;">{{ act.activityName }}</span>
              <StatusTag type="activity" :value="act.status" />
            </div>
          </template>
          <p><el-icon><OfficeBuilding /></el-icon> {{ act.clubName }}</p>
          <p><el-icon><Calendar /></el-icon> {{ act.activityTime }}</p>
          <p><el-icon><Location /></el-icon> {{ act.location }}</p>
          <p>
            <el-progress :percentage="Math.round(act.currentCount / act.maxCount * 100)" :stroke-width="14" style="width: 160px; display: inline-block; vertical-align: middle;" />
            <span style="margin-left: 8px; font-size: 13px; color: #909399;">{{ act.currentCount }}/{{ act.maxCount }}</span>
          </p>
          <p class="desc">{{ act.content }}</p>
          <div style="text-align: right; margin-top: 12px;">
            <el-button text @click="$router.push(`/student/activities/${act.activityId}`)">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!loading && list.length === 0" description="暂无活动" />
    <div class="pagination" v-if="total > 0">
      <el-pagination background layout="prev, pager, next" :total="total" v-model:current-page="query.page" @current-change="fetchList" :page-size="query.pageSize" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getActivityList } from '@/api/activity'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ keyword: '', status: '', page: 1, pageSize: 10 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getActivityList(query)
    list.value = res.data.list || res.data || []
    total.value = res.data.total || list.value.length
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped>
.search-card { margin-bottom: 20px; }
.activity-card p { margin: 8px 0; color: #606266; font-size: 14px; display: flex; align-items: center; gap: 6px; }
.desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }
</style>
