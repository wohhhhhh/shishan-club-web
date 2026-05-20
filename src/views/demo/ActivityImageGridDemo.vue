<template>
  <main class="demo-page">
    <header class="demo-header">
      <div>
        <p class="demo-kicker">Activity Image Feed Demo</p>
        <h1>活动图片流</h1>
      </div>
      <p>纯图片网格、小字信息、点击展开大预览，用来测试活动中心的新方向。</p>
    </header>

    <section class="image-grid" :class="{ 'is-dimmed': activeActivity }">
      <button
        v-for="item in activities"
        :key="item.id"
        type="button"
        class="image-card"
        @click="openActivity(item)"
      >
        <span class="image-frame">
          <img :src="item.coverUrl" :alt="item.title" />
        </span>
        <span class="card-meta">
          <strong>{{ item.title }}</strong>
          <span>{{ item.club }} · {{ item.type }}</span>
        </span>
      </button>
    </section>

    <Transition name="viewer">
      <section v-if="activeActivity" class="viewer-shell" @click.self="closeViewer">
        <button type="button" class="viewer-close" @click="closeViewer">关闭</button>
        <article class="viewer-panel">
          <div class="viewer-main">
            <img :src="activeActivity.coverUrl" :alt="activeActivity.title" />
          </div>
          <aside class="viewer-info">
            <p class="viewer-type">{{ activeActivity.type }}</p>
            <h2>{{ activeActivity.title }}</h2>
            <p class="viewer-desc">{{ activeActivity.description }}</p>

            <dl class="viewer-list">
              <div>
                <dt>社团</dt>
                <dd>{{ activeActivity.club }}</dd>
              </div>
              <div>
                <dt>时间</dt>
                <dd>{{ activeActivity.time }}</dd>
              </div>
              <div>
                <dt>地点</dt>
                <dd>{{ activeActivity.location }}</dd>
              </div>
              <div>
                <dt>报名</dt>
                <dd>{{ activeActivity.current }} / {{ activeActivity.capacity }} 人</dd>
              </div>
            </dl>

            <div class="viewer-progress">
              <span :style="{ width: `${activityPercent(activeActivity)}%` }"></span>
            </div>

            <button type="button" class="primary-btn">查看活动详情</button>
          </aside>
        </article>
      </section>
    </Transition>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const activities = [
  {
    id: 'hackathon',
    title: '编程马拉松48H',
    club: '计算机协会',
    type: 'Workshop',
    time: '2026-06-01 09:00',
    location: '信息楼301实验室',
    current: 18,
    capacity: 30,
    description: '48 小时编程挑战，组队完成一个完整项目，把想法做成可以演示的作品。',
    coverUrl: 'https://picsum.photos/seed/shishan-event-hackathon/900/1200'
  },
  {
    id: 'reading',
    title: '读书分享会',
    club: '读书社',
    type: 'Salon',
    time: '2026-05-25 14:00',
    location: '图书馆一楼报告厅',
    current: 35,
    capacity: 50,
    description: '围绕一本书展开讨论，分享阅读感受，也交换彼此看世界的方式。',
    coverUrl: 'https://picsum.photos/seed/shishan-event-reading/900/1200'
  },
  {
    id: 'photo',
    title: '校园外拍',
    club: '摄影协会',
    type: 'Photo Walk',
    time: '2026-05-20 08:00',
    location: '校园内',
    current: 20,
    capacity: 20,
    description: '从清晨光线开始，在校园里寻找春天、建筑和人的瞬间。',
    coverUrl: 'https://picsum.photos/seed/shishan-event-photo/900/1200'
  },
  {
    id: 'basketball',
    title: '院际篮球友谊赛',
    club: '篮球社',
    type: 'Sport',
    time: '2026-05-10 15:00',
    location: '体育馆',
    current: 40,
    capacity: 40,
    description: '一次面向全校开放的友谊赛，给热爱篮球的人一个一起呐喊的下午。',
    coverUrl: 'https://picsum.photos/seed/shishan-event-basketball/900/1200'
  },
  {
    id: 'concert',
    title: '毕业季音乐会',
    club: '音乐社',
    type: 'Live',
    time: '2026-06-15 19:00',
    location: '大学生活动中心',
    current: 85,
    capacity: 200,
    description: '合唱、乐队、独唱和原创作品一起登场，把毕业季的情绪留在现场。',
    coverUrl: 'https://picsum.photos/seed/shishan-event-concert/900/1200'
  },
  {
    id: 'ai',
    title: 'AI 技术分享会',
    club: '计算机协会',
    type: 'Talk',
    time: '2026-04-20 14:00',
    location: '信息楼201报告厅',
    current: 65,
    capacity: 80,
    description: '围绕大模型、视觉和智能系统的校园分享，适合想了解技术前沿的同学。',
    coverUrl: 'https://picsum.photos/seed/shishan-event-ai/900/1200'
  }
]

const activeActivity = ref(null)

const openActivity = item => {
  activeActivity.value = item
}

const closeViewer = () => {
  activeActivity.value = null
}

const activityPercent = item => Math.min(100, Math.round((item.current / item.capacity) * 100))
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  padding: 58px 28px 80px;
  background: #f6f2ec;
  color: #16181d;
}

.demo-header {
  max-width: 1500px;
  margin: 0 auto 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.42fr);
  gap: 28px;
  align-items: end;
}

.demo-kicker {
  margin: 0 0 10px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.demo-header h1 {
  margin: 0;
  font-size: clamp(44px, 6vw, 84px);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: 0;
}

.demo-header p {
  margin: 0;
  color: #6b6259;
  font-size: 15px;
  line-height: 1.8;
}

.image-grid {
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 34px 28px;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.image-grid.is-dimmed {
  opacity: 0.4;
  transform: scale(0.99);
}

.image-card {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.image-frame {
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 6px;
  background: #e7e0d7;
  box-shadow: 0 24px 70px -58px rgba(15, 23, 42, 0.65);
}

.image-frame img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), filter 0.42s ease;
}

.image-card:hover .image-frame img {
  transform: scale(1.035);
  filter: saturate(1.05);
}

.card-meta {
  margin-top: 14px;
  display: grid;
  gap: 6px;
}

.card-meta strong {
  color: #222326;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 850;
}

.card-meta span {
  color: #7c7065;
  font-size: 14px;
  font-weight: 650;
}

.viewer-shell {
  position: fixed;
  inset: 0;
  z-index: 1300;
  padding: 54px 24px;
  overflow: auto;
  background: rgba(20, 20, 22, 0.72);
}

.viewer-close {
  position: fixed;
  top: 16px;
  right: 22px;
  z-index: 2;
  border: 0;
  background: transparent;
  color: #f8fafc;
  font-size: 16px;
  font-weight: 850;
  cursor: pointer;
}

.viewer-panel {
  width: min(1120px, 100%);
  min-height: 720px;
  margin: 0 auto;
  padding: 52px;
  display: grid;
  grid-template-columns: minmax(0, 0.68fr) minmax(320px, 0.32fr);
  gap: 42px;
  border-radius: 12px;
  background: #fbfaf8;
}

.viewer-main {
  min-height: 620px;
  overflow: hidden;
  border-radius: 10px;
  background: #e7e0d7;
}

.viewer-main img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.viewer-info {
  align-self: center;
}

.viewer-type {
  margin: 0 0 14px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.viewer-info h2 {
  margin: 0;
  color: #080b14;
  font-size: clamp(36px, 4vw, 56px);
  line-height: 0.98;
  font-weight: 900;
}

.viewer-desc {
  margin: 22px 0 28px;
  color: #5f6673;
  font-size: 15px;
  line-height: 1.85;
}

.viewer-list {
  display: grid;
  gap: 13px;
  margin: 0 0 24px;
}

.viewer-list div {
  padding: 14px 0;
  border-top: 1px solid #e5e0d8;
}

.viewer-list dt {
  margin-bottom: 4px;
  color: #85807a;
  font-size: 12px;
  font-weight: 800;
}

.viewer-list dd {
  margin: 0;
  color: #171a21;
  font-size: 15px;
  font-weight: 800;
}

.viewer-progress {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #e3ded7;
}

.viewer-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #2563eb;
}

.primary-btn {
  margin-top: 26px;
  min-height: 46px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: #080b14;
  color: #fbfaf8;
  font-weight: 850;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
  background: #2563eb;
}

.viewer-enter-active,
.viewer-leave-active {
  transition: opacity 0.24s ease;
}

.viewer-enter-active .viewer-panel,
.viewer-leave-active .viewer-panel {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease;
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

.viewer-enter-from .viewer-panel,
.viewer-leave-to .viewer-panel {
  opacity: 0;
  transform: translateY(22px) scale(0.985);
}

@media (max-width: 980px) {
  .image-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .viewer-panel {
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 28px;
  }

  .viewer-main {
    min-height: 420px;
  }
}

@media (max-width: 640px) {
  .demo-page {
    padding: 38px 16px 58px;
  }

  .demo-header,
  .image-grid {
    grid-template-columns: 1fr;
  }

  .viewer-shell {
    padding: 50px 12px 18px;
  }

  .viewer-main {
    min-height: 320px;
  }
}
</style>
