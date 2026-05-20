<template>
  <main class="glass-detail-demo">
    <img class="page-bg" :src="activity.coverUrl" :alt="activity.title" />
    <div class="bg-wash"></div>

    <button type="button" class="back-arrow" aria-label="返回活动列表" @click="goBack">
      <span></span>
    </button>

    <section class="demo-shell">
      <article class="main-card">
        <div class="hero-image">
          <img :src="activity.coverUrl" :alt="activity.title" />
        </div>

        <div class="content-panel">
          <p class="club-label">{{ activity.club }}</p>
          <h1>{{ activity.title }}</h1>
          <div class="intro-copy">
            <p v-for="paragraph in activity.description" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
      </article>

      <aside class="side-stack">
        <section class="profile-card">
          <div class="avatar">
            <img :src="activity.avatar" alt="社团头像" />
          </div>
          <h2>{{ activity.club }}</h2>
          <p>每周组织桌游局，让策略、推理和轻松聚会都有位置。</p>
          <button type="button">申请报名</button>
        </section>

        <section class="info-card">
          <h3>活动信息</h3>
          <dl>
            <div>
              <dt>时间</dt>
              <dd>{{ activity.time }}</dd>
            </div>
            <div>
              <dt>地点</dt>
              <dd>{{ activity.location }}</dd>
            </div>
            <div>
              <dt>报名</dt>
              <dd>{{ activity.current }} / {{ activity.capacity }} 人</dd>
            </div>
            <div>
              <dt>截止</dt>
              <dd>{{ activity.deadline }}</dd>
            </div>
          </dl>
        </section>

        <section class="toc-card">
          <h3>活动须知</h3>
          <ol>
            <li>本周常规活动改为周日，别跑空。</li>
            <li>活动时间为 14:30 至 21:30，期间随时可以落座。</li>
            <li>轻度/中度策略游戏为主，也会准备轻快聚会游戏。</li>
            <li>所有游戏包教包会，欢迎带朋友一起体验。</li>
          </ol>
        </section>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const activity = {
  title: '桌游社每周常规活动',
  club: '桌游社',
  time: '2026-05-17 14:30',
  location: '荟园食堂三楼',
  current: 35,
  capacity: 50,
  deadline: '2026-05-17 21:30',
  coverUrl: 'https://picsum.photos/seed/shishan-boardgame-night/1400/900',
  avatar: 'https://picsum.photos/seed/shishan-boardgame-avatar/180/180',
  description: [
    '本周桌游社常规活动改为周日举行，请大家不要跑空。本周主题是长线规划，游戏以轻度和中度策略游戏为主，适合已经有一定桌游经验、想要进阶体验的朋友。',
    '你可以带上熟悉的小伙伴一起尝试，也可以现场加入其他同学的桌局。我们也会准备部分节奏轻快的聚会游戏，适合想要放松、入门或者第一次接触桌游的朋友。',
    '所有游戏都会有人讲解规则，款款有趣，包教包会。春季学期会员招募已经开始，25 元单学期，或 25 元每年至毕业，可以享受常规活动等会员专属福利。',
    '协会干事招新也在进行中。如果你喜欢桌游，欢迎加入我们，一起用自己的双手把快乐放大。5 月 17 日周日 14:30 起，荟园食堂三楼，不见不散。'
  ]
}

const goBack = () => {
  router.push('/demo/activity-image-grid')
}
</script>

<style scoped>
.glass-detail-demo {
  position: relative;
  min-height: 100vh;
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

.demo-shell {
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
.toc-card {
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
  padding: 38px 42px 46px;
  background:
    radial-gradient(circle at 70% 12%, rgba(255, 255, 255, 0.56), transparent 35%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.52), rgba(255, 247, 237, 0.5));
}

.club-label {
  margin: 0 0 14px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.content-panel h1 {
  max-width: 760px;
  margin: 0;
  color: #111827;
  font-size: clamp(42px, 5vw, 66px);
  line-height: 1.02;
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
.toc-card {
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
.toc-card h3 {
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
  color: #fff;
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
.toc-card li {
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

.toc-card ol {
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
  .demo-shell {
    grid-template-columns: 1fr;
  }

  .hero-image {
    height: 320px;
  }
}

@media (max-width: 640px) {
  .glass-detail-demo {
    padding: 76px 14px 42px;
  }

  .content-panel {
    padding: 28px 24px 34px;
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
