<template>
  <div class="demo-page">
    <header class="demo-header">
      <div>
        <p class="demo-kicker">Club Tile Interaction Demo</p>
        <h1>社团磁贴探索</h1>
      </div>
      <p class="demo-intro">
        浅色 Bento Grid、翻转预览和点击展开详情，用于测试新的社团卡片交互风格。
      </p>
    </header>

    <main class="tile-grid" :class="{ 'has-active': activeClub }">
      <button
        v-for="club in clubs"
        :key="club.id"
        type="button"
        class="club-tile"
        :class="[`tile-${club.tone}`, { featured: club.featured }]"
        @click="openClub(club)"
      >
        <span class="tile-face tile-front">
          <span class="tile-topline">
            <span class="college">{{ club.college }}</span>
            <span class="status" :class="club.status">{{ statusText[club.status] }}</span>
          </span>
          <span class="tile-main">
            <span class="club-name">{{ club.name }}</span>
            <span class="club-summary">{{ club.summary }}</span>
          </span>
          <span class="tile-bottom">
            <span>{{ club.current }}/{{ club.capacity }} 人</span>
            <span class="progress-track">
              <span class="progress-fill" :style="{ width: `${clubPercent(club)}%` }"></span>
            </span>
          </span>
        </span>

        <span class="tile-face tile-back">
          <span class="back-image">
            <img :src="club.image" :alt="club.name" />
          </span>
          <span class="back-copy">
            <strong>{{ club.name }}</strong>
            <span>{{ club.description }}</span>
          </span>
          <span class="back-meta">
            <span>{{ club.current }} 人已加入</span>
            <span>{{ statusText[club.status] }}</span>
          </span>
        </span>
      </button>
    </main>

    <Transition name="panel">
      <section v-if="activeClub" class="detail-shell" @click.self="closePanel">
        <article class="detail-panel">
          <div class="detail-media">
            <img :src="activeClub.image" :alt="activeClub.name" />
            <span class="status detail-status" :class="activeClub.status">
              {{ statusText[activeClub.status] }}
            </span>
          </div>

          <div class="detail-content">
            <div class="detail-head">
              <div>
                <p>{{ activeClub.college }}</p>
                <h2>{{ activeClub.name }}</h2>
              </div>
              <button type="button" class="close-btn" @click="closePanel">关闭</button>
            </div>

            <p class="detail-desc">{{ activeClub.description }}</p>

            <div class="detail-progress">
              <div class="progress-label">
                <span>成员容量</span>
                <strong>{{ activeClub.current }} / {{ activeClub.capacity }}</strong>
              </div>
              <div class="progress-track large">
                <span class="progress-fill" :style="{ width: `${clubPercent(activeClub)}%` }"></span>
              </div>
            </div>

            <dl class="detail-list">
              <div>
                <dt>负责人</dt>
                <dd>{{ activeClub.leader }}</dd>
              </div>
              <div>
                <dt>活动频率</dt>
                <dd>{{ activeClub.rhythm }}</dd>
              </div>
              <div>
                <dt>招新状态</dt>
                <dd>{{ statusText[activeClub.status] }}</dd>
              </div>
            </dl>

            <div class="detail-actions">
              <button type="button" class="apply-btn">申请加入</button>
              <button type="button" class="ghost-btn" @click="closePanel">返回磁贴</button>
            </div>
          </div>
        </article>
      </section>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const statusText = {
  recruiting: '招新中',
  paused: '暂停招新',
  full: '名额紧张'
}

const clubs = [
  {
    id: 'photo',
    name: '摄影协会',
    college: '艺术学院',
    summary: '用镜头记录校园里的光线、人物和故事。',
    description: '摄影协会定期组织外拍、作品点评和影像展览，从手机摄影到人像棚拍都能找到适合自己的创作路径。',
    current: 42,
    capacity: 60,
    status: 'recruiting',
    leader: '许知夏',
    rhythm: '每周一次创作活动',
    tone: 'blue',
    featured: true,
    image: 'https://picsum.photos/seed/shishan-photo/960/720'
  },
  {
    id: 'code',
    name: '编程俱乐部',
    college: '信息工程学院',
    summary: '项目实战、算法训练和技术分享。',
    description: '这里聚集了对代码和产品感兴趣的同学，社团活动覆盖 Web 开发、算法竞赛、开源协作和 Hackathon。',
    current: 56,
    capacity: 72,
    status: 'full',
    leader: '林澈',
    rhythm: '双周技术夜',
    tone: 'white',
    featured: true,
    image: 'https://picsum.photos/seed/shishan-code/960/720'
  },
  {
    id: 'read',
    name: '读书社',
    college: '文法学院',
    summary: '在讨论里读懂一本书，也读懂彼此。',
    description: '读书社每月共读一本书，围绕文学、社会学和通识主题做小型圆桌，适合喜欢表达和倾听的人。',
    current: 31,
    capacity: 48,
    status: 'recruiting',
    leader: '陈以安',
    rhythm: '每月两次共读',
    tone: 'orange',
    featured: false,
    image: 'https://picsum.photos/seed/shishan-read/960/720'
  },
  {
    id: 'robot',
    name: '机器人协会',
    college: '信息工程学院',
    summary: '硬件、控制、算法一起动手。',
    description: '机器人协会面向对硬件和自动化感兴趣的同学，日常训练以小车、机械臂和竞赛项目为主。',
    current: 24,
    capacity: 36,
    status: 'recruiting',
    leader: '周予衡',
    rhythm: '每周实验室开放',
    tone: 'white',
    featured: false,
    image: 'https://picsum.photos/seed/shishan-robot/960/720'
  },
  {
    id: 'music',
    name: '音乐社',
    college: '音乐学院',
    summary: '合唱、乐队、原创和小型演出。',
    description: '音乐社提供排练室、舞台和跨专业合作机会，欢迎主唱、乐手、编曲和声音制作方向的同学加入。',
    current: 38,
    capacity: 52,
    status: 'paused',
    leader: '宋听澜',
    rhythm: '每周排练',
    tone: 'blue',
    featured: false,
    image: 'https://picsum.photos/seed/shishan-music/960/720'
  },
  {
    id: 'volunteer',
    name: '青年志愿者协会',
    college: '公共管理学院',
    summary: '把周末的一点时间交给真实的问题。',
    description: '青年志愿者协会长期参与社区服务、校园公益和大型活动支持，适合希望把行动落到具体处的人。',
    current: 88,
    capacity: 120,
    status: 'recruiting',
    leader: '顾南星',
    rhythm: '每月主题服务',
    tone: 'orange',
    featured: false,
    image: 'https://picsum.photos/seed/shishan-volunteer/960/720'
  }
]

const activeClub = ref(null)

const clubPercent = club => Math.min(Math.round((club.current / club.capacity) * 100), 100)

const openClub = club => {
  activeClub.value = club
}

const closePanel = () => {
  activeClub.value = null
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  padding: 64px 32px 80px;
  background:
    radial-gradient(circle at 12% 10%, rgba(59, 130, 246, 0.12), transparent 28%),
    linear-gradient(135deg, #f8fafc 0%, #eff6ff 46%, #fff7ed 100%);
  color: #111827;
}

.demo-header {
  max-width: 1180px;
  margin: 0 auto 36px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.7fr);
  gap: 32px;
  align-items: end;
}

.demo-kicker {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #2563eb;
  text-transform: uppercase;
}

.demo-header h1 {
  margin: 0;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: 0;
}

.demo-intro {
  margin: 0;
  color: #475569;
  font-size: 16px;
  line-height: 1.8;
}

.tile-grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 210px;
  gap: 18px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.tile-grid.has-active {
  transform: scale(0.985);
  opacity: 0.62;
}

.club-tile {
  position: relative;
  border: 0;
  padding: 0;
  border-radius: 24px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  perspective: 1200px;
  grid-column: span 1;
  color: inherit;
}

.club-tile.featured {
  grid-column: span 2;
  grid-row: span 2;
}

.tile-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
  box-shadow: 0 24px 60px -42px rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.tile-front {
  padding: 22px;
  justify-content: space-between;
}

.tile-back {
  background: #0f172a;
  color: #f8fafc;
  transform: rotateY(180deg);
}

.club-tile:hover .tile-front {
  transform: rotateY(-180deg) translateY(-2px);
}

.club-tile:hover .tile-back {
  transform: rotateY(0) translateY(-2px);
}

.club-tile:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.32);
  outline-offset: 4px;
}

.tile-white .tile-front {
  background: rgba(255, 255, 255, 0.92);
}

.tile-blue .tile-front {
  background: #dbeafe;
}

.tile-orange .tile-front {
  background: #ffedd5;
}

.tile-topline,
.tile-bottom,
.back-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.college {
  color: #475569;
  font-size: 13px;
  font-weight: 600;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status.recruiting {
  color: #166534;
  background: #dcfce7;
}

.status.paused {
  color: #9a3412;
  background: #fed7aa;
}

.status.full {
  color: #1d4ed8;
  background: #dbeafe;
}

.tile-main {
  display: grid;
  gap: 12px;
}

.club-name {
  display: block;
  font-size: clamp(23px, 2.2vw, 34px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: 0;
}

.club-summary {
  display: block;
  max-width: 28ch;
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
}

.tile-bottom {
  color: #334155;
  font-size: 13px;
  font-weight: 650;
}

.progress-track {
  position: relative;
  width: 92px;
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.24);
  overflow: hidden;
}

.progress-track.large {
  width: 100%;
  height: 10px;
}

.progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: #2563eb;
}

.back-image {
  height: 48%;
  overflow: hidden;
}

.back-image img,
.detail-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-copy {
  display: grid;
  gap: 8px;
  padding: 18px 20px 12px;
}

.back-copy strong {
  font-size: 20px;
}

.back-copy span {
  color: #cbd5e1;
  font-size: 13px;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.back-meta {
  margin-top: auto;
  padding: 0 20px 18px;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 700;
}

.detail-shell {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(15, 23, 42, 0.22);
}

.detail-panel {
  width: min(980px, 100%);
  max-height: min(720px, calc(100vh - 64px));
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  overflow: hidden;
  border-radius: 28px;
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 32px 90px -48px rgba(15, 23, 42, 0.75);
}

.detail-media {
  position: relative;
  min-height: 460px;
}

.detail-status {
  position: absolute;
  top: 22px;
  left: 22px;
}

.detail-content {
  padding: 34px;
  overflow: auto;
}

.detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.detail-head p {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
}

.detail-head h2 {
  margin: 0;
  font-size: 40px;
  line-height: 1.05;
}

.close-btn,
.ghost-btn {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
  border-radius: 12px;
  padding: 9px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.close-btn:hover,
.ghost-btn:hover {
  border-color: #94a3b8;
  transform: translateY(-1px);
}

.detail-desc {
  margin: 24px 0;
  color: #475569;
  line-height: 1.85;
  font-size: 15px;
}

.detail-progress {
  padding: 18px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #334155;
  font-size: 14px;
}

.detail-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 18px 0 26px;
}

.detail-list div {
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.detail-list dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.detail-list dd {
  margin: 0;
  color: #111827;
  font-weight: 750;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.apply-btn {
  border: 0;
  border-radius: 14px;
  padding: 12px 20px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 18px 30px -20px rgba(37, 99, 235, 0.9);
  transition: transform 0.2s ease, background 0.2s ease;
}

.apply-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.25s ease;
}

.panel-enter-active .detail-panel,
.panel-leave-active .detail-panel {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

.panel-enter-from .detail-panel,
.panel-leave-to .detail-panel {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

@media (max-width: 960px) {
  .demo-page {
    padding: 40px 16px 56px;
  }

  .demo-header {
    grid-template-columns: 1fr;
  }

  .tile-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 210px;
  }

  .club-tile.featured {
    grid-column: span 2;
  }

  .detail-panel {
    grid-template-columns: 1fr;
    overflow: auto;
  }

  .detail-media {
    min-height: 260px;
  }
}

@media (max-width: 640px) {
  .tile-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 230px;
  }

  .club-tile,
  .club-tile.featured {
    grid-column: span 1;
    grid-row: span 1;
  }

  .detail-shell {
    padding: 16px;
  }

  .detail-content {
    padding: 24px;
  }

  .detail-head {
    flex-direction: column;
  }

  .detail-head h2 {
    font-size: 32px;
  }

  .detail-list {
    grid-template-columns: 1fr;
  }
}
</style>
