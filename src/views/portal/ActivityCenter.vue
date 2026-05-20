<template>
  <div class="activity-center">
    <section class="page-header">
      <div>
        <span class="header-kicker">EVENT FEED</span>
        <h1>活动中心</h1>
      </div>
      <p>像浏览校园相册一样发现活动，找到下一次值得参与的现场。</p>
    </section>

    <section class="search-panel" aria-label="活动筛选">
      <el-input
        v-model="query.keyword"
        class="search-input"
        placeholder="搜索活动"
        clearable
        :prefix-icon="Search"
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      />
      <el-select v-model="query.clubId" class="filter-select" placeholder="全部社团" clearable @change="handleSearch">
        <el-option v-for="c in clubOptions" :key="c.clubId" :label="c.clubName" :value="c.clubId" />
      </el-select>
      <el-select v-model="query.status" class="filter-select" placeholder="全部状态" clearable @change="handleSearch">
        <el-option label="报名中" value="SIGNING" />
        <el-option label="进行中" value="ONGOING" />
        <el-option label="已结束" value="ENDED" />
      </el-select>
      <el-button class="search-button" type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
    </section>

    <section v-loading="loading" class="event-results" aria-label="活动列表">
      <div v-if="list.length" class="event-grid">
        <article v-for="act in list" :key="act.activityId" class="event-card" @click="goDetail(act)">
          <button type="button" class="event-cover">
            <img v-if="activityCover(act)" :src="activityCover(act)" :alt="act.activityName" />
            <span v-else class="default-cover">
              <span class="cover-shape shape-a"></span>
              <span class="cover-shape shape-b"></span>
              <span class="cover-label">校园活动</span>
            </span>
          </button>

          <div class="event-info">
            <div class="event-head">
              <h2>{{ act.activityName }}</h2>
              <StatusTag class="status-pill" type="activity" :value="act.status" />
            </div>
            <div class="event-subline">
              <p class="club-name">{{ act.clubName }}</p>
              <span>{{ dateCompact(act.activityTime) }}</span>
            </div>

            <div class="event-meta">
              <span><el-icon><Clock /></el-icon>{{ act.activityTime || '时间待定' }}</span>
              <span><el-icon><Location /></el-icon>{{ act.location || '地点待定' }}</span>
            </div>

            <div class="signup-row">
              <span>{{ act.currentCount || 0 }} / {{ act.maxCount || 0 }} 人报名</span>
              <div class="signup-track" aria-hidden="true">
                <span :style="{ width: `${activityPercent(act)}%` }"></span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <el-empty v-else-if="!loading" class="empty-state" description="没有找到符合条件的活动" />
    </section>

    <div v-if="total > 0" class="pagination-wrap">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.page_size"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="fetchList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, Location, Search } from '@element-plus/icons-vue'
import StatusTag from '@/components/StatusTag.vue'
import { getActivityList } from '@/api/activity'
import { getClubList } from '@/api/club'

const router = useRouter()

const loading = ref(false)
const list = ref([])
const total = ref(0)
const clubOptions = ref([])

const query = reactive({
  keyword: '',
  clubId: '',
  status: '',
  page: 1,
  page_size: 12
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getActivityList(query)
    list.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const fetchClubs = async () => {
  try {
    const res = await getClubList({ page: 1, page_size: 100 })
    clubOptions.value = res.data?.list || []
  } catch (e) {
    console.error(e)
  }
}

const handleSearch = () => {
  query.page = 1
  fetchList()
}

const goDetail = act => {
  router.push(`/activities/${act.activityId}`)
}

const activityCover = act => {
  return act.coverUrl || act.cover || act.image || ''
}

const activityPercent = act => {
  const current = Number(act.currentCount) || 0
  const max = Number(act.maxCount) || 0
  if (!max) return 0
  return Math.min(100, Math.round((current / max) * 100))
}

const parseDate = value => {
  const date = value ? new Date(String(value).replace(/-/g, '/')) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

const dateCompact = value => {
  const date = parseDate(value)
  if (!date) return '--.--'
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  fetchList()
  fetchClubs()
})
</script>

<style scoped>
.activity-center {
  min-height: calc(100vh - 64px);
  padding: 56px 24px 72px;
  background:
    radial-gradient(circle at 16% 6%, rgba(59, 130, 246, 0.13), transparent 30%),
    linear-gradient(135deg, #f8fbff 0%, #edf6ff 48%, #fff8ed 100%);
  color: #111827;
}

.page-header,
.search-panel,
.event-results,
.pagination-wrap {
  max-width: 1180px;
  margin-left: auto;
  margin-right: auto;
}

.page-header {
  margin-bottom: 26px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.55fr);
  gap: 30px;
  align-items: end;
}

.header-kicker {
  color: #2563eb;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.page-header h1 {
  margin: 12px 0 0;
  color: #111827;
  font-size: clamp(44px, 6vw, 76px);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: 0;
}

.page-header p {
  margin: 0;
  color: #526176;
  font-size: 16px;
  line-height: 1.8;
}

.search-panel {
  margin-bottom: 26px;
  padding: 14px;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 190px 160px auto;
  gap: 12px;
  align-items: center;
  border: 1px solid rgba(211, 224, 239, 0.92);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 24px 70px -52px rgba(15, 23, 42, 0.45);
}

.search-panel :deep(.el-input__wrapper),
.search-panel :deep(.el-select__wrapper) {
  min-height: 44px;
  border-radius: 14px;
  background: #fbfdff;
  box-shadow: 0 0 0 1px rgba(218, 228, 240, 0.94) inset;
}

.search-input,
.filter-select {
  min-width: 0;
  width: 100%;
}

.search-button {
  min-height: 44px;
  padding: 0 22px;
  border: 0;
  border-radius: 14px;
  background: #2563eb;
  font-weight: 800;
  box-shadow: 0 18px 30px -22px rgba(37, 99, 235, 0.9);
}

.event-results {
  min-height: 320px;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.event-card {
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(211, 224, 239, 0.94);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 24px 70px -56px rgba(15, 23, 42, 0.54);
  transition:
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  border-color: rgba(37, 99, 235, 0.28);
  box-shadow: 0 34px 86px -58px rgba(15, 23, 42, 0.68);
}

.event-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  display: block;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: #eef6ff;
  cursor: pointer;
}

.event-cover img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}

.event-card:hover .event-cover img {
  transform: scale(1.035);
}

.default-cover {
  position: absolute;
  inset: 0;
  padding: 26px;
  display: flex;
  align-items: flex-end;
  background:
    radial-gradient(circle at 84% 16%, rgba(255, 237, 213, 0.88), transparent 28%),
    linear-gradient(135deg, #dcecff 0%, #f8fbff 52%, #fff1dc 100%);
}

.cover-shape {
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.44);
}

.shape-a {
  width: 190px;
  height: 190px;
  right: -68px;
  bottom: -72px;
}

.shape-b {
  width: 96px;
  height: 96px;
  left: 24px;
  top: 22px;
  background: rgba(37, 99, 235, 0.12);
}

.cover-label {
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #2563eb;
  font-size: 13px;
  line-height: 1;
  font-weight: 850;
  letter-spacing: 0;
}

.event-info {
  padding: 14px 16px 16px;
}

.event-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.event-info h2 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-pill {
  flex: 0 0 auto;
}

.event-subline {
  margin-top: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.club-name {
  margin: 0;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
}

.event-subline span {
  color: #64748b;
  font-size: 12px;
  font-weight: 850;
  white-space: nowrap;
}

.event-meta {
  margin: 12px 0;
  display: grid;
  gap: 6px;
}

.event-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
}

.signup-row {
  display: grid;
  gap: 8px;
  color: #526176;
  font-size: 13px;
  font-weight: 750;
}

.signup-track {
  position: relative;
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.22);
}

.signup-track span {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: #2563eb;
}

.empty-state {
  min-height: 310px;
  border: 1px solid rgba(218, 228, 240, 0.9);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.84);
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.pagination-wrap :deep(.el-pagination) {
  padding: 10px 14px;
  border: 1px solid rgba(218, 228, 240, 0.9);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
}

@media (max-width: 980px) {
  .page-header,
  .search-panel {
    grid-template-columns: 1fr;
  }

  .event-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .search-button {
    width: 100%;
  }
}

@media (max-width: 620px) {
  .activity-center {
    padding: 40px 16px 56px;
  }

  .page-header h1 {
    font-size: 42px;
  }

  .event-grid {
    grid-template-columns: 1fr;
  }
}
</style>
