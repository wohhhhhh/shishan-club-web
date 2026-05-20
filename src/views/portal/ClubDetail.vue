<template>
  <main class="club-detail-public" v-loading="loading">
    <div v-if="club" class="detail-stage">
      <img class="page-bg" :src="coverImage" :alt="club.clubName" />
      <div class="bg-wash"></div>

      <button type="button" class="back-arrow" aria-label="返回社团广场" @click="router.push('/clubs')">
        <span></span>
      </button>

      <section class="detail-shell">
        <article class="main-card">
          <div class="hero-image">
            <img :src="coverImage" :alt="club.clubName" />
          </div>

          <div class="content-panel">
            <h1>{{ club.clubName }}</h1>
            <div class="intro-copy">
              <p>{{ club.description || '这个社团还没有填写详细介绍，欢迎关注后续招新信息。' }}</p>
            </div>

            <section class="activity-panel">
              <h2>社团活动</h2>
              <el-empty v-if="activities.length === 0" description="暂无活动" />
              <div v-else class="activity-list">
                <button
                  v-for="act in activities"
                  :key="act.activityId"
                  type="button"
                  class="activity-item"
                  @click="router.push(`/activities/${act.activityId}`)"
                >
                  <span>{{ act.activityName }}</span>
                  <small>{{ act.activityTime }} · {{ act.location }}</small>
                </button>
              </div>
            </section>
          </div>
        </article>

        <aside class="side-stack">
          <section class="profile-card">
            <div class="avatar">
              <img :src="avatarImage" :alt="club.clubName" />
            </div>
            <h2>{{ club.clubName }}</h2>
            <p>{{ club.college || '跨学院社团' }}</p>
            <button
              v-if="userStore.isLoggedIn && club.status === 'NORMAL'"
              type="button"
              @click="showApply = true"
            >
              申请加入
            </button>
            <button v-else-if="!userStore.isLoggedIn" type="button" @click="router.push('/login')">
              登录后申请加入
            </button>
          </section>

          <section class="info-card">
            <h3>社团信息</h3>
            <dl>
              <div>
                <dt>负责人</dt>
                <dd>{{ club.leaderName || '待完善' }}</dd>
              </div>
              <div>
                <dt>成员</dt>
                <dd>{{ club.currentCount }} / {{ club.maxCount }} 人</dd>
              </div>
              <div>
                <dt>招新状态</dt>
                <dd>{{ club.statusText || statusText }}</dd>
              </div>
              <div>
                <dt>截止</dt>
                <dd>{{ club.recruitDeadline || '以社团通知为准' }}</dd>
              </div>
            </dl>
          </section>

          <section class="notice-card">
            <h3>加入须知</h3>
            <ol>
              <li>提交申请后，请等待社团负责人审核。</li>
              <li>申请理由尽量写清楚兴趣方向和可参与时间。</li>
              <li>具体面试、试训或群通知以社团后续安排为准。</li>
            </ol>
          </section>
        </aside>
      </section>
    </div>

    <el-dialog v-model="showApply" title="申请加入社团" width="500px">
      <el-form :model="applyForm" label-width="80px">
        <el-form-item label="申请理由">
          <el-input
            v-model="applyForm.reason"
            type="textarea"
            rows="4"
            placeholder="简单写写你想加入这个社团的原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showApply = false">取消</el-button>
        <el-button type="primary" @click="submitApply">提交申请</el-button>
      </template>
    </el-dialog>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getClubDetail } from '@/api/club'
import { getActivityList } from '@/api/activity'
import { applyClub } from '@/api/application'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const club = ref(null)
const activities = ref([])
const showApply = ref(false)
const applyForm = ref({ reason: '' })

const coverImage = computed(() => club.value?.coverUrl || `https://picsum.photos/seed/club-detail-${route.params.id || 'default'}/1400/900`)
const avatarImage = computed(() => club.value?.avatarUrl || `https://picsum.photos/seed/club-avatar-${route.params.id || 'default'}/180/180`)
const statusText = computed(() => (club.value?.status === 'NORMAL' ? '正常招新' : '暂停招新'))

const fetchDetail = async () => {
  loading.value = true
  try {
    const [clubRes, actRes] = await Promise.all([
      getClubDetail(route.params.id),
      getActivityList({ club_id: route.params.id, page: 1, page_size: 10 })
    ])
    club.value = clubRes.data
    activities.value = actRes.data?.list || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const submitApply = async () => {
  try {
    await applyClub({ clubId: route.params.id, reason: applyForm.value.reason })
    ElMessage.success('申请已提交')
    showApply.value = false
    applyForm.value.reason = ''
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchDetail)
</script>

<style scoped>
.club-detail-public {
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
}

.intro-copy p {
  margin: 0;
  color: #4b5563;
  font-size: 16px;
  line-height: 1.9;
}

.activity-panel {
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid rgba(203, 213, 225, 0.66);
}

.activity-panel h2 {
  margin: 0 0 18px;
  color: #111827;
  font-size: 24px;
  font-weight: 900;
}

.activity-list {
  display: grid;
  gap: 12px;
}

.activity-item {
  width: 100%;
  padding: 16px 18px;
  border: 1px solid rgba(226, 232, 240, 0.76);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.48);
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.activity-item:hover {
  transform: translateY(-1px);
  border-color: rgba(37, 99, 235, 0.28);
  background: rgba(255, 255, 255, 0.72);
}

.activity-item span {
  display: block;
  color: #111827;
  font-size: 16px;
  font-weight: 850;
}

.activity-item small {
  display: block;
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
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
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.profile-card button:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px -20px rgba(37, 99, 235, 0.72);
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
