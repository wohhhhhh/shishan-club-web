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
        <div class="hero-tags" aria-label="平台连接对象">
          <span>学生</span>
          <span>社团</span>
          <span>活动</span>
        </div>
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

    <section :ref="setSectionRef" class="story-section reveal why-section">
      <div class="section-heading">
        <span class="section-number">01</span>
        <h2>为什么需要狮山社栈</h2>
      </div>
      <p class="why-copy">
        校园里的热爱不应该被藏在群公告、海报和转发消息里。
        一个学生想找到社团，一个社团想找到成员，一场活动想找到参与者，这些连接，本该更简单。
      </p>
      <div class="why-board" aria-label="连接路径">
        <div v-for="item in whyLinks" :key="item.from" class="why-link">
          <span>{{ item.from }}</span>
          <strong>{{ item.action }}</strong>
          <span>{{ item.to }}</span>
        </div>
      </div>
    </section>

    <section :ref="setSectionRef" class="story-section reveal connect-section">
      <div class="section-heading">
        <span class="section-number">02</span>
        <h2>What We Connect</h2>
      </div>
      <div class="connect-grid">
        <article
          v-for="(item, index) in connects"
          :key="item.title"
          class="connect-card"
          :style="{ '--delay': `${index * 90}ms` }"
        >
          <span class="card-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <div class="card-visual" aria-hidden="true">
            <span v-for="bar in item.bars" :key="bar" :style="{ width: `${bar}%` }"></span>
          </div>
        </article>
      </div>
    </section>

    <section :ref="setSectionRef" class="belief-section reveal">
      <p class="belief-text">社团不是一条数据库记录，而是一群人因为共同兴趣聚在一起。</p>
      <p class="belief-note">狮山社栈想做的，是让这些相遇更清晰、更轻松，也更值得被记住。</p>
      <div class="belief-keywords" aria-label="品牌关键词">
        <span>兴趣</span>
        <span>同伴</span>
        <span>现场</span>
        <span>记忆</span>
      </div>
    </section>

    <section :ref="setSectionRef" class="story-section reveal contact-section">
      <div class="contact-copy">
        <span class="section-number">03</span>
        <h2>联系狮山社栈团队</h2>
        <p>
          有新的社团想入驻？有活动想发布？有平台建议想反馈？
          欢迎联系狮山社栈团队。
        </p>
      </div>
      <div class="contact-grid">
        <a class="contact-card" href="mailto:support@shishan.club">
          <span>邮箱</span>
          <strong>support@shishan.club</strong>
        </a>
        <a class="contact-card" href="tel:027-12345678">
          <span>电话</span>
          <strong>027-12345678</strong>
        </a>
        <div class="contact-card">
          <span>地址</span>
          <strong>华中农业大学学生服务中心</strong>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onBeforeUpdate, onBeforeUnmount, onMounted, ref } from 'vue'

const sectionRefs = ref([])
let observer = null

const setSectionRef = el => {
  if (el && !sectionRefs.value.includes(el)) {
    sectionRefs.value.push(el)
  }
}

const connects = [
  {
    title: '发现社团',
    text: '从兴趣出发，找到适合自己的组织。',
    bars: [72, 48, 64]
  },
  {
    title: '参与活动',
    text: '查看近期活动、报名名额、时间地点，让精彩不被错过。',
    bars: [56, 80, 42]
  },
  {
    title: '管理社团',
    text: '为社团负责人提供招新、成员、活动和签到管理能力。',
    bars: [88, 60, 74]
  }
]

const whyLinks = [
  { from: '学生', action: '想找到', to: '社团' },
  { from: '社团', action: '想找到', to: '成员' },
  { from: '活动', action: '想找到', to: '参与者' }
]

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    sectionRefs.value.forEach(el => el?.classList.add('is-visible'))
    return
  }

  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.18 }
  )

  sectionRefs.value.forEach(el => {
    if (el) observer.observe(el)
  })
})

onBeforeUpdate(() => {
  sectionRefs.value = []
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.about-page {
  min-height: calc(100vh - 64px);
  padding: 58px 24px 78px;
  background:
    radial-gradient(circle at 12% 4%, rgba(37, 99, 235, 0.12), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #edf6ff 48%, #fff8ed 100%);
  color: #111827;
}

.about-hero,
.story-section,
.belief-section {
  max-width: 1180px;
  margin: 0 auto;
}

.about-hero {
  min-height: 430px;
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(320px, 0.72fr);
  gap: 36px;
  align-items: stretch;
  animation: heroFadeUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero-copy {
  padding: 58px 0 40px;
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

.hero-tags {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-tags span {
  padding: 10px 16px;
  border: 1px solid rgba(190, 208, 232, 0.88);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #263449;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 18px 50px -44px rgba(15, 23, 42, 0.4);
}

.hero-panel {
  position: relative;
  overflow: hidden;
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

.story-section {
  margin-top: 78px;
  padding: 34px;
  border: 1px solid rgba(211, 224, 239, 0.92);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 28px 76px -62px rgba(15, 23, 42, 0.48);
}

.section-heading {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.section-heading h2,
.contact-copy h2 {
  margin: 0;
  color: #111827;
  font-size: clamp(30px, 3.7vw, 52px);
  line-height: 1.08;
  font-weight: 900;
  letter-spacing: 0;
}

.why-copy {
  max-width: 760px;
  margin: 34px 0 0 106px;
  color: #526176;
  font-size: clamp(19px, 2.1vw, 28px);
  line-height: 1.75;
  font-weight: 650;
}

.why-board {
  margin: 36px 0 0 106px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.why-link {
  position: relative;
  min-height: 132px;
  padding: 22px;
  display: grid;
  align-content: space-between;
  overflow: hidden;
  border: 1px solid rgba(211, 224, 239, 0.96);
  border-radius: 22px;
  background: #fbfdff;
  transition:
    transform 0.26s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.26s ease,
    border-color 0.26s ease;
}

.why-link::after {
  content: "";
  position: absolute;
  right: -42px;
  bottom: -54px;
  width: 138px;
  height: 138px;
  border-radius: 50%;
  background: rgba(220, 236, 255, 0.72);
}

.why-link:hover {
  transform: translateY(-4px);
  border-color: rgba(37, 99, 235, 0.34);
  box-shadow: 0 26px 66px -54px rgba(15, 23, 42, 0.58);
}

.why-link span {
  position: relative;
  z-index: 1;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

.why-link strong {
  position: relative;
  z-index: 1;
  color: #111827;
  font-size: 28px;
  line-height: 1;
  font-weight: 900;
}

.connect-section {
  background: rgba(248, 251, 255, 0.84);
}

.connect-grid {
  margin-top: 34px;
  display: grid;
  grid-template-columns: 1.12fr 0.94fr 1.02fr;
  gap: 18px;
}

.connect-card {
  min-height: 245px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(211, 224, 239, 0.96);
  border-radius: 24px;
  background: #fbfdff;
  box-shadow: 0 24px 60px -50px rgba(15, 23, 42, 0.46);
  transition:
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.connect-card:nth-child(2) {
  background: #dcecff;
}

.connect-card:nth-child(3) {
  background: #fff4e3;
}

.connect-card:hover {
  transform: translateY(-5px);
  border-color: rgba(37, 99, 235, 0.34);
  box-shadow: 0 34px 76px -54px rgba(15, 23, 42, 0.62);
}

.card-number {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.connect-card h3 {
  margin: auto 0 14px;
  color: #111827;
  font-size: 30px;
  line-height: 1.08;
  font-weight: 900;
}

.connect-card p {
  margin: 0;
  color: #526176;
  font-size: 15px;
  line-height: 1.75;
}

.card-visual {
  display: grid;
  gap: 7px;
  margin-top: 24px;
}

.card-visual span {
  display: block;
  height: 8px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.72);
}

.card-visual span:nth-child(2) {
  background: rgba(37, 99, 235, 0.28);
}

.card-visual span:nth-child(3) {
  background: rgba(15, 23, 42, 0.16);
}

.belief-section {
  position: relative;
  overflow: hidden;
  margin-top: 78px;
  padding: 54px;
  border: 1px solid rgba(211, 224, 239, 0.88);
  border-radius: 32px;
  background: linear-gradient(120deg, #dcecff 0%, #f8fbff 48%, #fff1dc 100%);
  background-size: 170% 170%;
  box-shadow: 0 32px 96px -64px rgba(15, 23, 42, 0.54);
  animation: softGradient 8s ease-in-out infinite alternate;
}

.belief-section::after {
  content: "";
  position: absolute;
  inset: auto -80px -120px auto;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.44);
}

.belief-text {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0;
  color: #111827;
  font-size: clamp(36px, 5.2vw, 72px);
  line-height: 1.08;
  font-weight: 900;
  letter-spacing: 0;
}

.belief-note {
  position: relative;
  z-index: 1;
  max-width: 660px;
  margin: 28px 0 0;
  color: #526176;
  font-size: 17px;
  line-height: 1.85;
}

.belief-keywords {
  position: relative;
  z-index: 1;
  margin-top: 38px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.belief-keywords span {
  min-height: 118px;
  padding: 20px;
  display: flex;
  align-items: flex-end;
  border: 1px solid rgba(211, 224, 239, 0.72);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.48);
  color: #111827;
  font-size: 28px;
  line-height: 1;
  font-weight: 900;
  transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1), background 0.26s ease;
}

.belief-keywords span:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.72);
}

.contact-section {
  margin-top: 78px;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(360px, 1.1fr);
  gap: 32px;
  background: rgba(255, 255, 255, 0.72);
}

.contact-copy p {
  max-width: 43ch;
  margin: 22px 0 0;
  color: #526176;
  font-size: 16px;
  line-height: 1.85;
}

.contact-grid {
  display: grid;
  gap: 14px;
}

.contact-card {
  min-height: 94px;
  padding: 22px 24px;
  display: grid;
  align-content: center;
  gap: 8px;
  text-decoration: none;
  border: 1px solid rgba(211, 224, 239, 0.96);
  border-radius: 22px;
  background: #fbfdff;
  color: inherit;
  transition:
    transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.24s ease,
    border-color 0.24s ease;
}

.contact-card:hover {
  transform: translateX(5px);
  border-color: rgba(37, 99, 235, 0.34);
  box-shadow: 0 24px 60px -50px rgba(15, 23, 42, 0.54);
}

.contact-card:active {
  transform: translateX(5px) scale(0.99);
}

.contact-card span {
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

.contact-card strong {
  color: #111827;
  font-size: 18px;
  line-height: 1.35;
  font-weight: 850;
}

.reveal {
  opacity: 0.001;
  transform: translateY(26px);
  transition:
    opacity 0.62s ease,
    transform 0.62s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal.is-visible .connect-card {
  animation: cardFadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay);
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

@keyframes cardFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
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

@keyframes softGradient {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}

@media (max-width: 900px) {
  .about-page {
    padding: 42px 16px 58px;
  }

  .about-hero,
  .contact-section {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    padding: 28px 0 0;
  }

  .hero-panel {
    min-height: 260px;
  }

  .section-heading {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .why-copy {
    margin-left: 0;
  }

  .why-board {
    margin-left: 0;
    grid-template-columns: 1fr;
  }

  .connect-grid {
    grid-template-columns: 1fr;
  }

  .belief-keywords {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contact-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .about-hero h1 {
    font-size: 48px;
  }

  .story-section,
  .belief-section {
    padding: 24px;
    border-radius: 24px;
  }

  .belief-text {
    font-size: 34px;
  }

  .hero-panel {
    min-height: 420px;
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

  .belief-keywords {
    grid-template-columns: 1fr;
  }

  .contact-section {
    gap: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-hero,
  .belief-section,
  .signal-card,
  .reveal,
  .reveal.is-visible .connect-card {
    animation: none;
    transition: none;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}
</style>
