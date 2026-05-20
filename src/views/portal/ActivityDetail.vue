<template>
  <main class="activity-detail-public" v-loading="loading">
    <div v-if="activity" class="detail-stage">
      <img class="page-bg" :src="coverImage" :alt="activity.activityName" />
      <div class="bg-wash"></div>

      <button type="button" class="back-arrow" aria-label="返回活动列表" @click="router.push('/activities')">
        <span></span>
      </button>

      <section class="detail-shell">
        <article class="main-card">
          <div class="hero-image">
            <img :src="coverImage" :alt="activity.activityName" />
          </div>

          <div class="content-panel">
            <h1>{{ activity.activityName }}</h1>
            <div class="intro-copy">
              <p v-for="paragraph in descriptionParagraphs" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </article>

        <aside class="side-stack">
          <section class="profile-card">
            <div class="avatar">
              <img :src="clubAvatar" :alt="activity.clubName" />
            </div>
            <h2>{{ activity.clubName }}</h2>
            <p>组织活动、连接兴趣，也让每一次校园参与被认真记录。</p>
            <button
              v-if="activity.status === 'SIGNING'"
              type="button"
              :class="{ danger: isSignedUp }"
              @click="handlePrimaryAction"
            >
              {{ actionText }}
            </button>
            <button v-else type="button" disabled>
              {{ activity.status === 'ENDED' ? '活动已结束' : '报名已截止' }}
            </button>
          </section>

          <section class="info-card">
            <h3>活动信息</h3>
            <dl>
              <div>
                <dt>时间</dt>
                <dd>{{ activity.activityTime }}</dd>
              </div>
              <div>
                <dt>地点</dt>
                <dd>{{ activity.location }}</dd>
              </div>
              <div>
                <dt>报名</dt>
                <dd>{{ activity.currentCount }} / {{ activity.maxCount }} 人</dd>
              </div>
              <div>
                <dt>截止</dt>
                <dd>{{ activity.signupDeadline || '以社团通知为准' }}</dd>
              </div>
            </dl>
          </section>

          <section class="notice-card">
            <h3>活动须知</h3>
            <ol>
              <li>请提前确认活动时间和地点，避免跑空。</li>
              <li>报名成功后如无法参加，请及时取消或联系社团负责人。</li>
              <li>现场安排以主办社团通知为准。</li>
            </ol>
          </section>
        </aside>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { cancelSignup, getActivityDetail, getMyActivities, signupActivity } from '@/api/activity'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const activity = ref(null)
const isSignedUp = ref(false)

const fallbackCover = computed(() => `https://picsum.photos/seed/activity-${route.params.id || 'default'}/1400/900`)
const coverImage = computed(() => activity.value?.coverUrl || fallbackCover.value)
const clubAvatar = computed(() => `https://picsum.photos/seed/club-${activity.value?.clubId || 'avatar'}/180/180`)

const descriptionParagraphs = computed(() => {
  const content = activity.value?.content || '这个活动还没有填写详细介绍，具体安排请以社团后续通知为准。'
  return String(content)
    .split(/\n+/)
    .map(item => item.trim())
    .filter(Boolean)
})

const actionText = computed(() => {
  if (!userStore.isLoggedIn) return '登录后报名'
  return isSignedUp.value ? '取消报名' : '申请报名'
})

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await getActivityDetail(route.params.id)
    activity.value = res.data

    if (userStore.isLoggedIn) {
      const myRes = await getMyActivities()
      isSignedUp.value = (myRes.data || []).some(item => item.activityId === route.params.id)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handlePrimaryAction = async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }

  if (isSignedUp.value) {
    await handleCancel()
    return
  }

  await handleSignup()
}

const handleSignup = async () => {
  try {
    await signupActivity({ activityId: route.params.id })
    ElMessage.success('报名成功')
    isSignedUp.value = true
    activity.value.currentCount += 1
  } catch (e) {
    console.error(e)
  }
}

const handleCancel = async () => {
  try {
    await cancelSignup(route.params.id)
    ElMessage.success('已取消报名')
    isSignedUp.value = false
    activity.value.currentCount -= 1
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchDetail)
</script>

<style scoped>
.activity-detail-public {
  min-height: calc(100vh - 64px);
}

.detail-stage {
  position: relative;
  min-height: calc(100vh - 64px);
  padding: 92px 28px 80px;
  overflow: hidden;
  color: #111827;
}

.page-bg {
  position: fixed;
  inset: -30px;
  width: calc(100% + 60px);
  height: calc(100% + 60px);
  object-fit: cover;
  filter: blur(30px) saturate(1.12);
  transform: scale(1.04);
}

.bg-wash {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 18% 22%, rgba(219, 234, 254, 0.56), transparent 28%),
    linear-gradient(135deg, rgba(248, 251, 255, 0.78), rgba(239, 246, 255, 0.58), rgba(255, 247, 237, 0.72));
}

.back-arrow {
  position: fixed;
  z-index: 2;
  top: 96px;
  left: max(28px, calc((100vw - 1180px) / 2 - 86px));
  width: 64px;
  height: 44px;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.back-arrow:hover {
  transform: translateX(-4px);
}

.back-arrow span {
  position: relative;
  display: block;
  width: 52px;
  height: 20px;
}

.back-arrow span::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 50%;
  width: 46px;
  height: 5px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.82);
  transform: translateY(-50%);
}

.back-arrow span::after {
  content: "";
  position: absolute;
  left: 2px;
  top: 50%;
  width: 17px;
  height: 17px;
  border-left: 5px solid rgba(37, 99, 235, 0.82);
  border-bottom: 5px solid rgba(37, 99, 235, 0.82);
  border-radius: 3px;
  transform: translateY(-50%) rotate(45deg);
}

.detail-shell {
  position: relative;
  z-index: 1;
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 24px;
  align-items: start;
}

.main-card,
.profile-card,
.info-card,
.notice-card {
  border: 1px solid rgba(255, 255, 255, 0.68);
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(18px) saturate(160%);
  box-shadow: 0 28px 90px -62px rgba(15, 23, 42, 0.72);
}

.main-card {
  overflow: hidden;
  border-radius: 28px;
}

.hero-image {
  height: 420px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.content-panel {
  padding: 42px 42px 48px;
  background:
    radial-gradient(circle at 70% 12%, rgba(255, 255, 255, 0.56), transparent 35%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(255, 247, 237, 0.5));
}

.content-panel h1 {
  max-width: 780px;
  margin: 0;
  color: #111827;
  font-size: 56px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: 0;
}

.intro-copy {
  max-width: 770px;
  margin-top: 28px;
  display: grid;
  gap: 16px;
}

.intro-copy p {
  margin: 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.9;
}

.side-stack {
  display: grid;
  gap: 18px;
}

.profile-card,
.info-card,
.notice-card {
  border-radius: 24px;
  padding: 24px;
}

.profile-card {
  text-align: center;
}

.avatar {
  width: 78px;
  height: 78px;
  margin: 0 auto 16px;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.82);
  border-radius: 50%;
  box-shadow: 0 16px 34px -28px rgba(15, 23, 42, 0.74);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-card h2,
.info-card h3,
.notice-card h3 {
  margin: 0 0 12px;
  color: #111827;
  font-weight: 900;
}

.profile-card p {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}

.profile-card button {
  min-height: 42px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: #2563eb;
  color: #f8fbff;
  font-weight: 850;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.profile-card button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px -20px rgba(37, 99, 235, 0.72);
}

.profile-card button.danger {
  background: #ef4444;
}

.profile-card button:disabled {
  cursor: not-allowed;
  background: rgba(148, 163, 184, 0.58);
}

.info-card dl {
  display: grid;
  gap: 13px;
  margin: 0;
}

.info-card div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.info-card dt,
.notice-card li {
  color: #64748b;
  font-size: 13px;
}

.info-card dd {
  margin: 0;
  color: #111827;
  font-size: 13px;
  font-weight: 850;
  text-align: right;
}

.notice-card ol {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
}

@media (max-width: 1100px) {
  .back-arrow {
    position: absolute;
    top: 76px;
    left: 18px;
  }
}

@media (max-width: 960px) {
  .detail-shell {
    grid-template-columns: 1fr;
  }

  .hero-image {
    height: 320px;
  }
}

@media (max-width: 640px) {
  .detail-stage {
    padding: 76px 14px 42px;
  }

  .content-panel {
    padding: 30px 24px 36px;
  }

  .content-panel h1 {
    font-size: 38px;
  }

  .back-arrow {
    width: 52px;
    left: 10px;
  }
}
</style>
