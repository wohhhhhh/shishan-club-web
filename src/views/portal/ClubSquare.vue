<template>
  <div class="club-square-page">
    <section class="square-hero">
      <div>
        <p class="hero-eyebrow">CLUB DISCOVERY</p>
        <h1>社团广场</h1>
      </div>
      <p class="hero-subtitle">发现你感兴趣的社团，开启精彩校园生活</p>
    </section>

    <section class="search-panel" aria-label="社团筛选">
      <el-input
        v-model="query.keyword"
        class="search-input"
        placeholder="搜索社团名称"
        clearable
        :prefix-icon="Search"
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      />
      <el-select v-model="query.college" class="filter-select" placeholder="全部学院" clearable @change="handleSearch">
        <el-option v-for="c in colleges" :key="c" :label="c" :value="c" />
      </el-select>
      <el-select v-model="query.status" class="filter-select" placeholder="全部状态" clearable @change="handleSearch">
        <el-option label="正常招新" value="NORMAL" />
        <el-option label="暂停招新" value="PAUSED" />
      </el-select>
      <el-button class="search-button" type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
    </section>

    <section v-loading="loading" class="club-results" aria-label="社团列表">
      <div v-if="displayList.length" class="tile-grid">
        <button
          v-for="(club, index) in displayList"
          :key="club.clubId"
          type="button"
          class="club-tile"
          :class="[tileTone(index), { featured: isFeatured(index) }]"
          @click="openPanel(club)"
        >
          <span class="tile-face tile-front">
            <StatusTag class="status-pill" type="club" :value="club.status" />

            <span class="tile-content">
              <span class="tile-main">
                <span class="tile-college">{{ club.college || '未设置学院' }}</span>
                <span class="tile-title">{{ club.clubName }}</span>
                <span class="tile-desc">{{ club.description || '这个社团还在整理简介，先去详情页看看更多信息。' }}</span>
              </span>

              <span class="tile-footer">
                <span class="member-row">
                  <span>成员</span>
                  <strong>{{ club.currentCount || 0 }} / {{ club.maxCount || 0 }} 人</strong>
                </span>
              </span>
            </span>
          </span>

          <span class="tile-face tile-back">
            <span class="back-image">
              <img :src="clubImage(club)" :alt="club.clubName" />
            </span>
            <span class="back-content">
              <strong>{{ club.clubName }}</strong>
              <span>{{ club.description || '这个社团还在整理简介，先去详情页看看更多信息。' }}</span>
            </span>
            <span class="back-meta">
              <span>{{ club.currentCount || 0 }} 人已加入</span>
              <StatusTag type="club" :value="club.status" />
            </span>
          </span>
        </button>
      </div>

      <el-empty v-else-if="!loading" class="empty-state" description="没有找到符合条件的社团" />
    </section>

    <Transition name="panel">
      <section v-if="activeClub" class="detail-shell" @click.self="closePanel">
        <article class="detail-panel">
          <button type="button" class="close-button" @click="closePanel">关闭</button>

          <div class="detail-art">
            <img :src="clubImage(activeClub)" :alt="activeClub.clubName" />
          </div>

          <div class="detail-content">
            <p class="detail-college">{{ activeClub.college || '未设置学院' }}</p>
            <h2>{{ activeClub.clubName }}</h2>
            <p class="detail-desc">
              {{ activeClub.description || '这个社团还在整理简介，先去详情页看看更多信息。' }}
            </p>

            <div class="detail-capacity">
              <div class="capacity-head">
                <span>成员容量</span>
                <strong>{{ activeClub.currentCount || 0 }} / {{ activeClub.maxCount || 0 }} 人</strong>
              </div>
              <div class="capacity-track" aria-hidden="true">
                <span class="capacity-fill" :style="{ width: `${clubPercent(activeClub)}%` }"></span>
              </div>
            </div>

            <div class="detail-meta">
              <div>
                <span>负责人</span>
                <strong>{{ activeClub.leaderName || '暂未设置' }}</strong>
              </div>
              <div>
                <span>招新状态</span>
                <strong>{{ statusLabel(activeClub.status) }}</strong>
              </div>
              <div>
                <span>所属学院</span>
                <strong>{{ activeClub.college || '未设置' }}</strong>
              </div>
            </div>

            <el-button class="detail-link" type="primary" @click="goDetail(activeClub)">查看详情</el-button>
          </div>
        </article>
      </section>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import StatusTag from '@/components/StatusTag.vue'
import { getClubList } from '@/api/club'
import { clubStatusMap } from '@/utils/enum'

const router = useRouter()

const loading = ref(false)
const list = ref([])
const colleges = ref([])
const activeClub = ref(null)
const activeClubIndex = ref(0)

const query = reactive({
  keyword: '',
  college: '',
  status: '',
  page: 1,
  page_size: 100
})

const displayList = computed(() => {
  return [...list.value].sort((a, b) => {
    const aLength = String(a.clubName || '').length
    const bLength = String(b.clubName || '').length
    return bLength - aLength
  })
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getClubList(query)
    list.value = res.data?.list || []
    const set = new Set(list.value.map(club => club.college).filter(Boolean))
    colleges.value = Array.from(set)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.page = 1
  fetchList()
}

const goDetail = club => {
  router.push(`/clubs/${club.clubId}`)
}

const openPanel = club => {
  activeClub.value = club
  activeClubIndex.value = Math.max(0, displayList.value.findIndex(item => item.clubId === club.clubId))
}

const closePanel = () => {
  activeClub.value = null
}

const statusLabel = status => {
  return clubStatusMap[status]?.text || status || '未设置'
}

const clubPercent = club => {
  const current = Number(club?.currentCount) || 0
  const max = Number(club?.maxCount) || 0
  if (!max) return 0
  return Math.min(100, Math.round((current / max) * 100))
}

const clubImage = club => {
  return club?.coverUrl || club?.cover || club?.image || `https://picsum.photos/seed/shishan-${club?.clubId || 'club'}/960/720`
}

const isFeatured = index => index < 2

const tileTone = index => {
  const tones = ['tone-blue', 'tone-white', 'tone-cream', 'tone-orange']
  return tones[index % tones.length]
}

onMounted(fetchList)
</script>

<style scoped>
.club-square-page {
  min-height: calc(100vh - 64px);
  padding: 56px 24px 72px;
  background:
    radial-gradient(circle at 14% 4%, rgba(59, 130, 246, 0.13), transparent 30%),
    linear-gradient(135deg, #f8fbff 0%, #edf6ff 48%, #fff8ed 100%);
  color: #172033;
}

.square-hero {
  max-width: 1180px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.62fr);
  gap: 32px;
  align-items: end;
}

.hero-eyebrow {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.square-hero h1 {
  margin: 0;
  color: #111827;
  font-size: clamp(42px, 6vw, 72px);
  line-height: 0.96;
  font-weight: 850;
  letter-spacing: 0;
}

.hero-subtitle {
  margin: 0;
  max-width: 36ch;
  color: #536173;
  font-size: 16px;
  line-height: 1.8;
}

.search-panel {
  max-width: 1180px;
  margin: 0 auto 24px;
  padding: 14px;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) 180px 160px auto;
  gap: 12px;
  align-items: center;
  border: 1px solid rgba(211, 224, 239, 0.92);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 70px -52px rgba(15, 23, 42, 0.45);
}

.search-panel :deep(.el-input__wrapper),
.search-panel :deep(.el-select__wrapper) {
  min-height: 44px;
  border-radius: 14px;
  box-shadow: 0 0 0 1px rgba(218, 228, 240, 0.94) inset;
  background: #fbfdff;
}

.search-panel :deep(.el-input__wrapper.is-focus),
.search-panel :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.34) inset;
}

.search-input {
  min-width: 0;
}

.filter-select {
  width: 100%;
}

.search-button {
  min-height: 44px;
  padding: 0 22px;
  border: 0;
  border-radius: 14px;
  font-weight: 750;
  background: #2563eb;
  box-shadow: 0 18px 30px -22px rgba(37, 99, 235, 0.9);
}

.search-button:hover {
  background: #1d4ed8;
}

.club-results {
  max-width: 1180px;
  min-height: 260px;
  margin: 0 auto;
}

.tile-grid {
  column-count: 4;
  column-gap: 18px;
}

.club-tile {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 330px;
  margin: 0 0 18px;
  padding: 0;
  cursor: pointer;
  border: 0;
  border-radius: 24px;
  background: transparent;
  color: inherit;
  text-align: left;
  perspective: 1200px;
  break-inside: avoid;
}

.club-tile.featured {
  height: 470px;
}

.club-tile:nth-child(5n + 3) {
  height: 380px;
}

.club-tile:nth-child(7n + 5) {
  height: 420px;
}

.tile-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(218, 228, 240, 0.9);
  border-radius: 24px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 24px 60px -46px rgba(15, 23, 42, 0.5);
  transition:
    transform 0.52s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.32s ease;
}

.tile-front {
  padding: 24px;
}

.featured .tile-front {
  padding: 30px;
}

.tile-front::after {
  content: "";
  position: absolute;
  right: -54px;
  bottom: -64px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.38);
  pointer-events: none;
}

.tile-back {
  justify-content: space-between;
  padding: 0;
  background: #152033;
  color: #f8fbff;
  transform: rotateY(180deg);
}

.club-tile:hover .tile-front {
  transform: rotateY(-180deg) translateY(-4px);
  border-color: rgba(148, 177, 213, 0.86);
  box-shadow: 0 34px 76px -48px rgba(15, 23, 42, 0.62);
}

.club-tile:hover .tile-back {
  transform: rotateY(0) translateY(-4px);
  border-color: rgba(148, 177, 213, 0.86);
  box-shadow: 0 34px 76px -48px rgba(15, 23, 42, 0.62);
}

.club-tile:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.28);
  outline-offset: 5px;
}

.tone-blue .tile-front,
.detail-art.tone-blue {
  background: #dcecff;
}

.tone-white .tile-front,
.detail-art.tone-white {
  background: rgba(255, 255, 255, 0.94);
}

.tone-cream .tile-front,
.detail-art.tone-cream {
  background: #fff7e8;
}

.tone-orange .tile-front,
.detail-art.tone-orange {
  background: #ffedd9;
}

.status-pill {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1;
}

.tile-content {
  position: relative;
  z-index: 1;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
}

.tile-main {
  display: grid;
  gap: 14px;
  padding-right: 84px;
}

.featured .tile-main {
  align-self: stretch;
  margin: auto 0;
}

.tile-college {
  color: #526176;
  font-size: 13px;
  font-weight: 700;
}

.tile-title {
  display: block;
  color: #111827;
  font-size: clamp(24px, 2.4vw, 36px);
  line-height: 1.08;
  font-weight: 850;
  letter-spacing: 0;
}

.tile-desc {
  max-width: 46ch;
  color: #536173;
  font-size: 14px;
  line-height: 1.62;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured .tile-desc {
  max-width: 58ch;
  font-size: 15px;
  line-height: 1.75;
  -webkit-line-clamp: 4;
}

.featured .tile-title {
  font-size: clamp(42px, 4.4vw, 64px);
  line-height: 0.98;
}

.tile-footer {
  display: grid;
  gap: 12px;
}

.member-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #526176;
  font-size: 13px;
}

.member-row strong {
  color: #172033;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
}

.back-image {
  height: 48%;
  overflow: hidden;
}

.back-image img,
.detail-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-content {
  display: grid;
  gap: 14px;
  padding: 18px 20px 10px;
}

.back-content strong {
  color: #f8fbff;
  font-size: clamp(24px, 2.2vw, 34px);
  line-height: 1.1;
  font-weight: 850;
}

.back-content span:last-child {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.75;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.back-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 20px 18px;
  color: #dbeafe;
  font-size: 13px;
  font-weight: 750;
}

.detail-shell {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(15, 23, 42, 0.28);
}

.detail-panel {
  position: relative;
  width: min(1080px, 100%);
  max-height: min(760px, calc(100vh - 64px));
  display: grid;
  grid-template-columns: minmax(280px, 0.86fr) minmax(0, 1.14fr);
  overflow: hidden;
  border: 1px solid rgba(218, 228, 240, 0.95);
  border-radius: 30px;
  background: #f8fbff;
  box-shadow: 0 36px 100px -52px rgba(15, 23, 42, 0.74);
}

.close-button {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 1;
  min-width: 76px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid #cad7e8;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  color: #263449;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.close-button:hover {
  transform: translateY(-1px);
  border-color: #9fb1c8;
}

.detail-art {
  position: relative;
  min-height: 540px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #111827;
}

.detail-art::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0) 28%, rgba(15, 23, 42, 0.72) 100%);
}

.detail-content {
  padding: 72px 46px 42px;
  overflow: auto;
}

.detail-college {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 15px;
  font-weight: 850;
}

.detail-content h2 {
  margin: 0;
  color: #111827;
  font-size: clamp(42px, 4.8vw, 64px);
  line-height: 1.02;
  font-weight: 900;
  letter-spacing: 0;
}

.detail-desc {
  max-width: 58ch;
  margin: 24px 0 30px;
  color: #526176;
  font-size: 16px;
  line-height: 1.85;
}

.detail-capacity {
  padding: 22px 24px;
  border: 1px solid #d8e2ef;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.76);
  color: #526176;
  font-size: 15px;
}

.capacity-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 16px;
}

.detail-capacity strong {
  color: #263449;
  font-size: 20px;
  font-weight: 850;
}

.capacity-track {
  position: relative;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.24);
}

.capacity-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: #2563eb;
}

.detail-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 22px 0 28px;
}

.detail-meta div {
  min-height: 92px;
  padding: 18px;
  display: grid;
  align-content: center;
  gap: 8px;
  border: 1px solid #d8e2ef;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
}

.detail-meta span {
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

.detail-meta strong {
  color: #111827;
  font-size: 17px;
  line-height: 1.35;
  font-weight: 850;
}

.detail-link {
  min-height: 46px;
  padding: 0 24px;
  border: 0;
  border-radius: 14px;
  background: #2563eb;
  font-weight: 800;
  box-shadow: 0 18px 30px -22px rgba(37, 99, 235, 0.9);
}

.detail-link:hover {
  background: #1d4ed8;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease;
}

.panel-enter-active .detail-panel,
.panel-leave-active .detail-panel {
  transition: transform 0.34s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-from .detail-panel,
.panel-leave-to .detail-panel {
  opacity: 0;
  transform: translateY(22px) scale(0.98);
}

.empty-state {
  min-height: 310px;
  border: 1px solid rgba(218, 228, 240, 0.9);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.84);
}

@media (max-width: 1120px) {
  .tile-grid {
    column-count: 3;
  }

  .search-panel {
    grid-template-columns: minmax(220px, 1fr) 170px 150px;
  }

  .search-button {
    grid-column: 1 / -1;
  }
}

@media (max-width: 820px) {
  .club-square-page {
    padding: 40px 16px 56px;
  }

  .square-hero {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .search-panel {
    grid-template-columns: 1fr;
    border-radius: 20px;
  }

  .tile-grid {
    column-count: 2;
  }

  .club-tile,
  .club-tile.featured {
    height: 320px;
  }

  .featured .tile-main {
    margin: 0;
  }

  .featured .tile-title {
    font-size: clamp(30px, 8vw, 42px);
  }

  .tile-front {
    padding: 22px;
  }

  .tile-main {
    padding-right: 72px;
  }

  .detail-panel {
    grid-template-columns: 1fr;
    overflow: auto;
  }

  .detail-art {
    min-height: 260px;
  }

  .detail-content {
    padding: 34px 26px 30px;
  }

  .detail-meta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .tile-grid {
    column-count: 1;
  }

  .club-tile,
  .club-tile.featured {
    height: 300px;
  }

  .detail-shell {
    padding: 14px;
  }

  .detail-panel {
    max-height: calc(100vh - 28px);
    border-radius: 24px;
  }

  .close-button {
    top: 16px;
    right: 16px;
  }

  .detail-art {
    min-height: 220px;
  }

  .detail-content h2 {
    font-size: 38px;
  }

  .square-hero h1 {
    font-size: 42px;
  }
}
</style>
