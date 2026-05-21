<template>
  <main class="about-page">
    <section class="about-hero">
      <div class="hero-copy">
        <span class="section-index">SHISHAN CLUB STUDIO</span>
        <h1>让热爱在狮山相遇</h1>
        <p>
          狮山社栈是一个为校园社团、活动和学生兴趣而生的数字平台。
          我们希望把分散的社团信息重新组织起来，让每一次校园参与都更容易发生。
        </p>
      </div>
      <div class="hero-panel" aria-hidden="true">
        <div class="signal-card signal-student">
          <span>student</span>
          <strong>找到兴趣</strong>
        </div>
        <div class="signal-card signal-club">
          <span>club</span>
          <strong>遇见同伴</strong>
        </div>
        <div class="signal-card signal-event">
          <span>event</span>
          <strong>发生参与</strong>
        </div>
        <span class="signal-dot dot-a"></span>
        <span class="signal-dot dot-b"></span>
        <span class="signal-dot dot-c"></span>
        <span class="signal-line line-a"></span>
        <span class="signal-line line-b"></span>
      </div>
    </section>

    <section class="live-tiles-section">
      <div class="live-tiles-board" aria-hidden="true">
        <div class="live-tile tile-club">
          <span>club</span>
          <strong>社团广场</strong>
          <small>发现同频组织</small>
        </div>
        <div class="live-tile tile-event">
          <span>event</span>
          <strong>活动中心</strong>
          <small>时间与报名</small>
        </div>
        <div class="live-tile tile-profile">
          <span>profile</span>
          <strong>我的记录</strong>
        </div>
        <div class="live-tile tile-recruit">
          <span>recruit</span>
          <strong>招新</strong>
        </div>
        <div class="live-tile tile-admin">
          <span>manage</span>
          <strong>社团运营</strong>
          <small>审核、成员、签到</small>
        </div>
        <div class="live-tile tile-feed">
          <span>campus</span>
          <strong>热爱正在发生</strong>
        </div>
      </div>

      <div class="live-tiles-copy">
        <span class="section-index">LIVE TILES</span>
        <h2>把校园信息做成一眼就能读懂的入口</h2>
        <p>
          狮山社栈借鉴 Win10 的 Metro/Modern 界面和磁贴语言，把社团、活动、个人记录和管理动作
          拆成清晰的视觉单元。浏览不是翻一堆表格，而是在每一块信息里迅速看到下一步。
        </p>
      </div>
    </section>

  </main>
</template>

<style scoped>
.about-page {
  min-height: calc(100vh - 64px);
  padding: 40px 24px 78px;
  background:
    radial-gradient(circle at 12% 4%, rgba(37, 99, 235, 0.12), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #edf6ff 48%, #fff8ed 100%);
  color: #111827;
}

.about-hero {
  max-width: 1180px;
  margin: 0 auto;
}

.about-hero {
  padding-top: 92px;
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(320px, 0.72fr);
  gap: 36px;
  align-items: start;
  animation: heroFadeUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-copy {
  padding: 22px 0 40px;
}

.section-index,
.section-number {
  display: inline-flex;
  color: #2563eb;
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.about-hero h1 {
  max-width: 9ch;
  margin: 18px 0 24px;
  color: #111827;
  font-size: clamp(54px, 8vw, 96px);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: 0;
}

.about-hero p {
  max-width: 62ch;
  margin: 0;
  color: #526176;
  font-size: 17px;
  line-height: 1.9;
}

.hero-panel {
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  min-height: 360px;
  padding: 34px;
  border: 1px solid rgba(211, 224, 239, 0.94);
  border-radius: 30px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(220, 236, 255, 0.82)),
    #f8fbff;
  box-shadow: 0 30px 90px -62px rgba(15, 23, 42, 0.54);
}

.hero-panel::before,
.hero-panel::after {
  content: "";
  position: absolute;
  border-radius: 50%;
}

.hero-panel::before {
  inset: auto -30% -34% 18%;
  height: 62%;
  background: rgba(255, 237, 213, 0.74);
}

.hero-panel::after {
  top: -120px;
  left: -90px;
  width: 250px;
  height: 250px;
  background: rgba(191, 219, 254, 0.58);
}

.signal-card {
  position: absolute;
  z-index: 2;
  width: 168px;
  padding: 18px;
  display: grid;
  gap: 8px;
  border: 1px solid rgba(211, 224, 239, 0.96);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 24px 70px -54px rgba(15, 23, 42, 0.58);
  animation: panelFloat 5.8s ease-in-out infinite;
}

.signal-card span {
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.signal-card strong {
  color: #111827;
  font-size: 22px;
  line-height: 1.16;
  font-weight: 900;
}

.signal-student {
  top: 46px;
  left: 34px;
}

.signal-club {
  top: 148px;
  right: 32px;
  animation-delay: 0.7s;
}

.signal-event {
  left: 58px;
  bottom: 44px;
  animation-delay: 1.25s;
}

.signal-dot {
  position: absolute;
  z-index: 2;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2563eb;
  box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.12);
}

.dot-a {
  top: 128px;
  left: 236px;
}

.dot-b {
  top: 250px;
  right: 238px;
}

.dot-c {
  right: 88px;
  bottom: 54px;
}

.signal-line {
  position: absolute;
  z-index: 1;
  height: 2px;
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.2), rgba(37, 99, 235, 0.86), rgba(37, 99, 235, 0.1));
  transform-origin: left center;
}

.line-a {
  top: 141px;
  left: 232px;
  width: 210px;
  transform: rotate(22deg);
}

.line-b {
  right: 126px;
  bottom: 90px;
  width: 250px;
  transform: rotate(-30deg);
}

.live-tiles-section {
  max-width: 1180px;
  margin: 104px auto 0;
  padding: 0 0 24px;
  display: grid;
  grid-template-columns: minmax(430px, 0.94fr) minmax(0, 1.06fr);
  gap: 54px;
  align-items: center;
}

.live-tiles-board {
  min-height: 520px;
  padding: 22px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
  gap: 14px;
  border: 1px solid rgba(211, 224, 239, 0.92);
  border-radius: 32px;
  background:
    linear-gradient(rgba(37, 99, 235, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.055) 1px, transparent 1px),
    rgba(255, 255, 255, 0.58);
  background-size: 42px 42px, 42px 42px, auto;
  box-shadow: 0 32px 92px -68px rgba(15, 23, 42, 0.62);
}

.live-tile {
  position: relative;
  overflow: hidden;
  min-width: 0;
  padding: 22px;
  display: grid;
  align-content: space-between;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 8px;
  color: #f8fbff;
  box-shadow: 0 24px 56px -42px rgba(15, 23, 42, 0.56);
  transition: transform 0.34s cubic-bezier(0.16, 1, 0.3, 1);
}

.live-tile::after {
  content: "";
  position: absolute;
  inset: auto -28px -36px auto;
  width: 126px;
  height: 126px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

.live-tile:hover {
  transform: translateY(-5px);
}

.live-tile span,
.live-tile small {
  position: relative;
  z-index: 1;
  font-weight: 800;
}

.live-tile span {
  justify-self: start;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  opacity: 0.9;
}

.live-tile strong {
  position: relative;
  z-index: 1;
  font-size: clamp(23px, 2.2vw, 34px);
  line-height: 1.08;
  font-weight: 900;
}

.live-tile small {
  color: rgba(248, 251, 255, 0.84);
  font-size: 13px;
}

.tile-club {
  grid-column: span 2;
  grid-row: span 2;
  background: #2563eb;
}

.tile-event {
  grid-column: span 2;
  grid-row: span 1;
  background: #0f766e;
}

.tile-profile {
  grid-column: span 1;
  grid-row: span 1;
  padding: 16px;
  background: #ff7a1a;
}

.tile-profile strong,
.tile-recruit strong {
  font-size: 20px;
}

.tile-recruit {
  grid-column: span 1;
  grid-row: span 1;
  padding: 16px;
  background: #7c3aed;
}

.tile-admin {
  grid-column: span 2;
  grid-row: span 2;
  background: #172033;
}

.tile-feed {
  grid-column: span 2;
  grid-row: span 2;
  background: #dbeafe;
  color: #172033;
}

.tile-feed::after {
  background: rgba(37, 99, 235, 0.14);
}

.live-tiles-copy h2 {
  max-width: 10.8ch;
  margin: 18px 0 26px;
  color: #111827;
  font-size: clamp(42px, 5.2vw, 70px);
  line-height: 0.98;
  font-weight: 900;
  letter-spacing: 0;
}

.live-tiles-copy p {
  max-width: 31ch;
  margin: 0;
  color: #526176;
  font-size: 18px;
  line-height: 1.9;
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes panelFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 900px) {
  .about-page {
    padding: 42px 16px 58px;
  }

  .about-hero,
  .live-tiles-section {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    padding: 28px 0 0;
  }

  .about-hero { padding-top: 44px; }

  .hero-panel {
    margin-top: 0;
    min-height: 260px;
  }

  .live-tiles-section {
    min-height: auto;
    margin-top: 82px;
    padding: 0;
  }

  .live-tiles-board {
    min-height: 430px;
  }

  .live-tiles-copy h2,
  .live-tiles-copy p {
    max-width: none;
  }

}

@media (max-width: 620px) {
  .about-hero h1 {
    font-size: 48px;
  }

  .hero-panel {
    min-height: 420px;
  }

  .live-tiles-board {
    min-height: 560px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(5, minmax(0, 1fr));
  }

  .tile-club,
  .tile-event,
  .tile-admin,
  .tile-feed {
    grid-column: span 2;
  }

  .tile-club,
  .tile-admin {
    grid-row: span 1;
  }

  .tile-feed {
    grid-row: span 1;
  }

  .signal-card {
    width: 150px;
  }

  .signal-club {
    top: 156px;
  }

  .signal-event {
    bottom: 34px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .about-hero,
  .signal-card {
    animation: none;
    transition: none;
  }
}
</style>
