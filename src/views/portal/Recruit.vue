<template>
  <main class="recruit-page" v-loading="loading">
    <section class="season-hero">
      <div class="hero-copy">
        <p class="eyebrow">RECRUIT SEASON</p>
        <h1>春季社团招新季</h1>
        <p class="subtitle">
          把正在开放申请的社团集中起来，先看方向、名额和截止时间，再去详情页认真了解。
        </p>
      </div>

      <div class="hero-metrics">
        <div>
          <strong>{{ openCount }}</strong>
          <span>开放招新</span>
        </div>
        <div>
          <strong>{{ soonCount }}</strong>
          <span>即将截止</span>
        </div>
        <div>
          <strong>{{ averageVacancy }}</strong>
          <span>平均余量</span>
        </div>
      </div>
    </section>

    <section class="season-guide">
      <article class="glass-panel guide-panel">
        <p class="panel-kicker">HOW TO JOIN</p>
        <h2>三步加入心动社团</h2>
        <div class="step-list">
          <div class="step-item">
            <span>01</span>
            <p>先确认社团方向、招新状态和剩余名额。</p>
          </div>
          <div class="step-item">
            <span>02</span>
            <p>进入详情页提交申请，写清楚你的兴趣和可参与时间。</p>
          </div>
          <div class="step-item">
            <span>03</span>
            <p>回到个人中心查看审核进度，等待社团负责人联系。</p>
          </div>
        </div>
      </article>

      <article class="glass-panel deadline-panel">
        <p class="panel-kicker">DEADLINE</p>
        <h2>最近截止</h2>
        <div v-if="deadlineClubs.length" class="deadline-list">
          <button
            v-for="club in deadlineClubs"
            :key="club.clubId"
            type="button"
            class="deadline-item"
            @click="goDetail(club.clubId)"
          >
            <span>{{ club.clubName }}</span>
            <small>{{ club.recruitDeadline || '待通知' }}</small>
          </button>
        </div>
        <p v-else class="quiet-text">暂无明确截止日期，具体安排以社团通知为准。</p>
      </article>
    </section>

    <section class="club-season">
      <div class="section-heading">
        <div>
          <p class="eyebrow">OPEN CLUBS</p>
          <h2>正在招新的社团</h2>
        </div>
        <button type="button" @click="$router.push('/clubs')">去社团广场</button>
      </div>

      <div v-if="recruitClubs.length" class="recruit-grid">
        <article
          v-for="(club, index) in recruitClubs"
          :key="club.clubId"
          class="recruit-card"
          :class="[{ featured: index < 2 }, toneClass(index)]"
          @click="goDetail(club.clubId)"
        >
          <div class="card-face card-front">
            <div class="card-topline">
              <span>{{ club.college || '跨学院社团' }}</span>
              <b>招新中</b>
            </div>
            <h3>{{ club.clubName }}</h3>
            <p>{{ club.description }}</p>
            <div class="card-footer">
              <div>
                <span>名额</span>
                <strong>{{ club.currentCount }} / {{ club.maxCount }} 人</strong>
              </div>
              <div class="capacity-track">
                <i :style="{ width: `${capacityPercent(club)}%` }"></i>
              </div>
              <small>截止 {{ club.recruitDeadline || '待通知' }}</small>
            </div>
          </div>

          <div class="card-face card-back">
            <div class="back-image">
              <img :src="clubImage(club)" :alt="club.clubName" />
            </div>
            <div class="back-copy">
              <div class="back-topline">
                <span>{{ club.college || '跨学院社团' }}</span>
                <b>招新中</b>
              </div>
              <strong>{{ club.clubName }}</strong>
              <p>{{ club.description }}</p>
            </div>
            <div class="back-footer">
              <span>{{ club.currentCount }} / {{ club.maxCount }} 人</span>
              <small>点击查看详情</small>
            </div>
          </div>
        </article>
      </div>

      <el-empty v-else-if="!loading" description="暂无招新中的社团" />
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getClubList } from '@/api/club'

const router = useRouter()
const loading = ref(false)
const recruitClubs = ref([])

const openCount = computed(() => recruitClubs.value.length)

const soonCount = computed(() => {
  const now = new Date()
  const soon = 1000 * 60 * 60 * 24 * 14
  return recruitClubs.value.filter(club => {
    if (!club.recruitDeadline) return false
    const deadline = new Date(club.recruitDeadline)
    const diff = deadline.getTime() - now.getTime()
    return diff >= 0 && diff <= soon
  }).length
})

const averageVacancy = computed(() => {
  if (!recruitClubs.value.length) return 0
  const total = recruitClubs.value.reduce((sum, club) => {
    return sum + Math.max((club.maxCount || 0) - (club.currentCount || 0), 0)
  }, 0)
  return Math.round(total / recruitClubs.value.length)
})

const deadlineClubs = computed(() => {
  return [...recruitClubs.value]
    .filter(club => club.recruitDeadline)
    .sort((a, b) => new Date(a.recruitDeadline) - new Date(b.recruitDeadline))
    .slice(0, 4)
})

const capacityPercent = club => {
  if (!club.maxCount) return 0
  return Math.min(Math.round((club.currentCount / club.maxCount) * 100), 100)
}

const toneClass = index => {
  return ['tone-blue', 'tone-white', 'tone-warm'][index % 3]
}

const clubImage = club => {
  return club?.coverUrl || club?.cover || club?.image || `https://picsum.photos/seed/recruit-${club?.clubId || 'club'}/960/720`
}

const goDetail = clubId => {
  router.push(`/clubs/${clubId}`)
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getClubList({ status: 'NORMAL', page: 1, page_size: 100 })
    recruitClubs.value = res.data?.list || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.recruit-page {
  width: min(1280px, calc(100% - 48px));
  margin: 0 auto;
  padding: 56px 0 88px;
  color: #111827;
}

.season-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 28px;
  align-items: end;
  min-height: 360px;
  padding: 48px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 32px;
  background:
    radial-gradient(circle at 82% 18%, rgba(255, 247, 237, 0.86), transparent 28%),
    linear-gradient(135deg, rgba(219, 234, 254, 0.86), rgba(248, 251, 255, 0.66));
  backdrop-filter: blur(18px) saturate(160%);
  box-shadow: 0 30px 90px -68px rgba(15, 23, 42, 0.72);
}

.eyebrow,
.panel-kicker {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 13px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.hero-copy h1 {
  max-width: 760px;
  margin: 0;
  font-size: 68px;
  line-height: 1.02;
  font-weight: 900;
  letter-spacing: 0;
}

.subtitle {
  max-width: 620px;
  margin: 22px 0 0;
  color: #526176;
  font-size: 18px;
  line-height: 1.8;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.hero-metrics div {
  min-height: 116px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.55);
}

.hero-metrics strong {
  display: block;
  color: #111827;
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
}

.hero-metrics span {
  display: block;
  margin-top: 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 750;
}

.season-guide {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 22px;
  margin-top: 24px;
}

.glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(18px) saturate(160%);
  box-shadow: 0 24px 78px -64px rgba(15, 23, 42, 0.66);
}

.guide-panel,
.deadline-panel {
  padding: 30px;
}

.glass-panel h2,
.section-heading h2 {
  margin: 0;
  color: #111827;
  font-size: 28px;
  line-height: 1.15;
  font-weight: 900;
}

.step-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 24px;
}

.step-item {
  padding: 18px;
  border: 1px solid rgba(226, 232, 240, 0.72);
  border-radius: 20px;
  background: rgba(248, 251, 255, 0.62);
}

.step-item span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.step-item p {
  margin: 12px 0 0;
  color: #526176;
  font-size: 14px;
  line-height: 1.7;
}

.deadline-list {
  display: grid;
  gap: 10px;
  margin-top: 22px;
}

.deadline-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(226, 232, 240, 0.72);
  border-radius: 999px;
  background: rgba(248, 251, 255, 0.56);
  color: #111827;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.deadline-item:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.26);
  background: rgba(255, 255, 255, 0.78);
}

.deadline-item span {
  font-weight: 850;
}

.deadline-item small,
.quiet-text {
  color: #64748b;
  font-size: 13px;
}

.club-season {
  margin-top: 52px;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.section-heading button {
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid rgba(203, 213, 225, 0.76);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  color: #526176;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.section-heading button:hover {
  transform: translateY(-1px);
  color: #2563eb;
  border-color: rgba(37, 99, 235, 0.28);
}

.recruit-grid {
  column-count: 4;
  column-gap: 20px;
}

.recruit-card {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 340px;
  margin: 0 0 20px;
  padding: 0;
  border: 0;
  border-radius: 28px;
  background: transparent;
  cursor: pointer;
  break-inside: avoid;
  perspective: 1200px;
}

.card-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.74);
  border-radius: 28px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 24px 78px -68px rgba(15, 23, 42, 0.72);
  transition:
    transform 0.52s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.card-front {
  padding: 24px;
}

.card-back {
  background: rgba(248, 251, 255, 0.9);
  transform: rotateY(180deg);
}

.recruit-card:hover .card-front {
  transform: rotateY(-180deg) translateY(-3px);
  border-color: rgba(37, 99, 235, 0.26);
  box-shadow: 0 34px 90px -70px rgba(15, 23, 42, 0.82);
}

.recruit-card:hover .card-back {
  transform: rotateY(0) translateY(-3px);
  border-color: rgba(37, 99, 235, 0.26);
  box-shadow: 0 34px 90px -70px rgba(15, 23, 42, 0.82);
}

.recruit-card.featured {
  height: 440px;
}

.recruit-card:nth-child(5n + 3) {
  height: 390px;
}

.recruit-card:nth-child(7n + 5) {
  height: 420px;
}

.tone-blue .card-front {
  background:
    radial-gradient(circle at 92% 88%, rgba(255, 255, 255, 0.42), transparent 28%),
    rgba(219, 234, 254, 0.82);
}

.tone-white .card-front {
  background:
    radial-gradient(circle at 88% 84%, rgba(219, 234, 254, 0.42), transparent 30%),
    rgba(255, 255, 255, 0.72);
}

.tone-warm .card-front {
  background:
    radial-gradient(circle at 90% 82%, rgba(255, 255, 255, 0.46), transparent 30%),
    rgba(255, 247, 237, 0.86);
}

.card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #64748b;
  font-size: 13px;
  font-weight: 850;
}

.card-topline b {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(220, 252, 231, 0.78);
  color: #16a34a;
  font-size: 12px;
}

.recruit-card h3 {
  margin: 28px 0 0;
  color: #111827;
  font-size: 34px;
  line-height: 1.12;
  font-weight: 900;
  letter-spacing: 0;
}

.recruit-card.featured h3 {
  max-width: 520px;
  font-size: 46px;
}

.recruit-card p {
  max-width: 560px;
  margin: 18px 0 0;
  color: #526176;
  font-size: 15px;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  margin-top: auto;
  padding-top: 28px;
}

.card-footer div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: #64748b;
  font-size: 13px;
  font-weight: 750;
}

.card-footer strong {
  color: #111827;
  font-size: 16px;
  font-weight: 900;
}

.capacity-track {
  height: 8px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
}

.capacity-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #2563eb;
}

.card-footer small {
  display: block;
  margin-top: 12px;
  color: #64748b;
  font-size: 13px;
}

.back-image {
  height: 48%;
  overflow: hidden;
  background: #dbeafe;
}

.back-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.back-copy {
  display: grid;
  gap: 12px;
  padding: 18px 20px 10px;
}

.back-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #64748b;
  font-size: 12px;
  font-weight: 850;
}

.back-topline b {
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(220, 252, 231, 0.86);
  color: #16a34a;
  font-size: 12px;
}

.back-copy strong {
  color: #111827;
  font-size: 26px;
  line-height: 1.1;
  font-weight: 900;
}

.back-copy p {
  margin: 0;
  color: #526176;
  font-size: 14px;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.back-footer {
  margin-top: auto;
  padding: 0 20px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 850;
}

.back-footer small {
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .season-hero,
  .season-guide {
    grid-template-columns: 1fr;
  }

  .recruit-grid {
    column-count: 2;
  }
}

@media (max-width: 720px) {
  .recruit-page {
    width: min(100% - 28px, 1280px);
    padding-top: 36px;
  }

  .season-hero {
    min-height: auto;
    padding: 30px 24px;
  }

  .hero-copy h1 {
    font-size: 44px;
  }

  .hero-metrics,
  .step-list {
    grid-template-columns: 1fr;
  }

  .recruit-grid {
    column-count: 1;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
