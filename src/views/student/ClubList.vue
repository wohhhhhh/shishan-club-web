<template>
  <div class="club-list">
    <el-card class="search-card">
      <el-form :inline="true" :model="query">
        <el-form-item label="社团名称">
          <el-input v-model="query.keyword" placeholder="搜索社团" clearable @clear="fetchList" />
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="query.college" placeholder="全部" clearable @change="fetchList">
            <el-option v-for="c in colleges" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable @change="fetchList">
            <el-option label="正常招新" value="NORMAL" />
            <el-option label="暂停招新" value="PAUSED" />
            <el-option label="已解散" value="DISSOLVED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchList">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="12" v-for="club in list" :key="club.clubId" style="margin-bottom: 20px;">
        <el-card shadow="hover" class="club-card">
          <template #header>
            <div class="card-header">
              <span class="club-name">{{ club.clubName }}</span>
              <StatusTag type="club" :value="club.status" />
            </div>
          </template>
          <div class="card-body">
            <p><el-icon><OfficeBuilding /></el-icon> {{ club.college }}</p>
            <p><el-icon><User /></el-icon> 负责人：{{ club.leaderName }}</p>
            <p>
              <el-icon><UserFilled /></el-icon>
              人数：<el-progress :percentage="Math.round(club.currentCount / club.maxCount * 100)" :stroke-width="14" style="width: 150px; display: inline-block; vertical-align: middle;" />
              <span style="margin-left: 8px; font-size: 13px; color: #909399;">{{ club.currentCount }}/{{ club.maxCount }}</span>
            </p>
            <p class="desc">{{ club.description }}</p>
          </div>
          <div class="card-footer">
            <el-button type="primary" text @click="$router.push(`/student/clubs/${club.clubId}`)">查看详情</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!loading && list.length === 0" description="暂无社团" />

    <div class="pagination" v-if="total > 0">
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="query.pageSize" v-model:current-page="query.page" @current-change="fetchList" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getClubList } from '@/api/club'
import StatusTag from '@/components/StatusTag.vue'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const colleges = ['信息工程学院', '文学院', '计算机学院', '体育学院', '美术学院', '音乐学院']

const query = reactive({ keyword: '', college: '', status: '', page: 1, pageSize: 10 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getClubList(query)
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
.club-card { height: 100%; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.club-name { font-size: 16px; font-weight: 600; }
.card-body p { margin: 8px 0; color: #606266; font-size: 14px; display: flex; align-items: center; gap: 6px; }
.desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.6; }
.card-footer { margin-top: 12px; text-align: right; }
.pagination { margin-top: 20px; display: flex; justify-content: center; }
</style>
