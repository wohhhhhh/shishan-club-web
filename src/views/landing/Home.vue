<template>
  <div class="landing-page">
    <!-- 开场层 -->
    <Transition name="intro-fade">
      <div v-if="showIntro" class="intro-overlay">
        <div class="intro-grid-bg"></div>
        <div class="intro-content">
          <div class="intro-logo">
            <el-icon size="48" color="#3b82f6"><School /></el-icon>
          </div>
          <h1 class="intro-title">狮山社栈</h1>
          <p class="intro-slogan">发现热爱 · 连接成长</p>
          <div class="intro-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 顶部导航 -->
    <Navbar v-if="!showIntro" />

    <!-- Hero 首屏 -->
    <section id="hero" class="hero-section">
      <div class="hero-container">
        <div class="hero-grid">
          <!-- 左侧文字区 -->
          <div class="hero-content">
            <div class="hero-badge" :class="{ 'animate-in': heroReady }">
              <el-icon><StarFilled /></el-icon>
              <span>校园社团一站式服务平台</span>
            </div>
            <h1 class="hero-title" :class="{ 'animate-in': heroReady }">
              <span class="title-line">发现热爱</span>
              <span class="title-line highlight">加入属于你的</span>
              <span class="title-line">校园社团</span>
            </h1>
            <p class="hero-subtitle" :class="{ 'animate-in': heroReady }">
              浏览社团、报名活动、记录你的校园生活
            </p>
            <div class="hero-actions" :class="{ 'animate-in': heroReady }">
              <el-button type="primary" size="large" class="hero-btn-primary" @click="scrollToClubs">
                <el-icon><Search /></el-icon>
                浏览社团
              </el-button>
              <el-button size="large" class="hero-btn-secondary" @click="goToLogin">
                立即登录
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 右侧拼贴网格 -->
          <div class="hero-collage" :class="{ 'animate-in': heroReady }">
            <div class="collage-grid">
              <div class="collage-item collage-main" :style="{ '--delay': '0ms' }">
                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=500&fit=crop" alt="社团活动">
              </div>
              <div class="collage-item collage-stat stat-blue" :style="{ '--delay': '100ms' }">
                <div class="stat-number">120+</div>
                <div class="stat-label">入驻社团</div>
              </div>
              <div class="collage-item collage-small" :style="{ '--delay': '200ms' }">
                <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=200&h=200&fit=crop" alt="学生交流">
              </div>
              <div class="collage-item collage-stat stat-green" :style="{ '--delay': '300ms' }">
                <div class="stat-number">300+</div>
                <div class="stat-label">校园活动</div>
              </div>
              <div class="collage-item collage-stat stat-orange" :style="{ '--delay': '400ms' }">
                <div class="stat-number">5000+</div>
                <div class="stat-label">学生参与</div>
              </div>
              <div class="collage-item collage-small" :style="{ '--delay': '500ms' }">
                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop" alt="团队合作">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门社团区 -->
    <section id="clubs" class="section clubs-section">
      <div class="section-container">
        <div class="section-header" v-intersect="onSectionIntersect">
          <h2 class="section-title">探索精彩社团</h2>
          <p class="section-desc">找到志同道合的伙伴，开启你的社团之旅</p>
        </div>

        <div class="static-grid">
          <div v-for="club in hotClubs.slice(0, 3)" :key="club.clubId" class="static-card" v-intersect="onCardIntersect">
            <div class="static-image">
              <img :src="club.image" :alt="club.clubName">
              <div class="static-status" :class="club.status">{{ club.statusText }}</div>
            </div>
            <div class="static-content">
              <div class="static-meta">
                <span class="static-college">{{ club.college }}</span>
                <span class="static-members">
                  <el-icon><User /></el-icon>
                  {{ club.currentCount }}/{{ club.maxCount }}人
                </span>
              </div>
              <h3 class="static-name">{{ club.clubName }}</h3>
              <p class="static-intro">{{ club.introduction }}</p>
              <el-button type="primary" text @click="goToLogin">
                了解更多
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <div class="section-more" v-intersect="onSectionIntersect">
          <el-button size="large" @click="goToLogin">
            查看全部社团
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </section>

    <!-- 近期活动区 -->
    <section id="activities" class="section activities-section">
      <div class="section-container">
        <div class="section-header" v-intersect="onSectionIntersect">
          <h2 class="section-title">精彩活动预告</h2>
          <p class="section-desc">发现感兴趣的活动，立即报名参加</p>
        </div>

        <div class="static-grid">
          <div v-for="activity in recentActivities.slice(0, 3)" :key="activity.activityId" class="static-card activity-static-card" v-intersect="onCardIntersect">
            <div class="static-image activity-static-image">
              <img :src="activity.image" :alt="activity.activityName">
              <div class="static-status" :class="activity.status">{{ activity.statusText }}</div>
            </div>
            <div class="static-content">
              <div class="static-club">{{ activity.clubName }}</div>
              <h3 class="static-name">{{ activity.activityName }}</h3>
              <div class="static-info">
                <div class="static-info-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ activity.activityTime }}</span>
                </div>
                <div class="static-info-item">
                  <el-icon><Location /></el-icon>
                  <span>{{ activity.location }}</span>
                </div>
                <div class="static-info-item">
                  <el-icon><User /></el-icon>
                  <span>{{ activity.currentCount }}/{{ activity.maxCount }}人已报名</span>
                </div>
              </div>
              <el-button type="primary" :disabled="activity.status !== 'SIGNING'" @click="goToLogin">
                {{ activity.status === 'SIGNING' ? '立即报名' : '报名结束' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台功能区 -->
    <section id="features" class="section features-section">
      <div class="section-container">
        <div class="section-header" v-intersect="onSectionIntersect">
          <h2 class="section-title">一站式社团服务</h2>
          <p class="section-desc">从发现到参与，全程线上化便捷体验</p>
        </div>

        <div class="features-grid">
          <div v-for="(feature, i) in features" :key="i" class="feature-card" :style="{ '--delay': `${i * 60}ms` }" v-intersect="onCardIntersect">
            <div class="feature-icon" :class="feature.iconClass">
              <el-icon size="32"><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 社团文化/校园风采区 -->
    <section id="culture" class="section culture-section">
      <div class="section-container">
        <div class="culture-grid">
          <div class="culture-content" v-intersect="onSectionIntersect">
            <h2 class="section-title">在这里，遇见更好的自己</h2>
            <p class="culture-text">
              社团是大学生活中最珍贵的记忆之一。在这里，你可以找到志同道合的伙伴，
              一起追逐共同的兴趣爱好；可以锻炼组织能力，在策划活动中成长；
              可以拓展视野，在交流中收获友谊。
            </p>
            <p class="culture-text">
              无论你是想发展特长、结交好友，还是锻炼能力、丰富履历，
              社团都为你提供了最好的舞台。加入我们，开启属于你的精彩校园生活。
            </p>
            <div class="culture-stats">
              <div class="culture-stat">
                <div class="culture-number">98%</div>
                <div class="culture-label">学生满意度</div>
              </div>
              <div class="culture-stat">
                <div class="culture-number">50+</div>
                <div class="culture-label">社团类型</div>
              </div>
              <div class="culture-stat">
                <div class="culture-number">1000+</div>
                <div class="culture-label">年度活动</div>
              </div>
            </div>
          </div>
          <div class="culture-images" v-intersect="onSectionIntersect">
            <div class="culture-image main">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=600&fit=crop" alt="社团活动">
            </div>
            <div class="culture-image sub">
              <img src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=300&h=300&fit=crop" alt="团队活动">
            </div>
            <div class="culture-image sub">
              <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=300&h=300&fit=crop" alt="学生活动">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 区 -->
    <section v-if="!userStore.isLoggedIn" class="cta-section">
      <div class="cta-container" v-intersect="onSectionIntersect">
        <div class="cta-content">
          <h2 class="cta-title">准备好开启你的社团之旅了吗？</h2>
          <p class="cta-desc">立即登录，发现属于你的精彩社团生活</p>
          <div class="cta-actions">
            <el-button type="primary" size="large" @click="goToLogin">立即登录</el-button>
            <el-button size="large" @click="scrollToClubs">浏览社团</el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <el-icon size="32" color="#3b82f6"><School /></el-icon>
              <span>狮山社栈</span>
            </div>
            <p class="footer-desc">
              为校园社团提供一站式数字化管理解决方案，
              助力社团高效运营，丰富学生校园生活。
            </p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <router-link to="/clubs">社团广场</router-link>
            <router-link to="/activities">活动中心</router-link>
            <a href="#features">平台功能</a>
            <router-link to="/login">登录系统</router-link>
          </div>
          <div class="footer-links">
            <h4>帮助支持</h4>
            <a href="#">使用指南</a>
            <a href="#">常见问题</a>
            <a href="#">意见反馈</a>
            <a href="#">联系我们</a>
          </div>
          <div class="footer-contact">
            <h4>联系方式</h4>
            <p><el-icon><Message /></el-icon> support@clubmanager.edu</p>
            <p><el-icon><Phone /></el-icon> 010-12345678</p>
            <p><el-icon><Location /></el-icon> 学生事务中心 302 室</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 狮山社栈. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { useUserStore } from '@/stores/user'
import {
  School, StarFilled, Search, ArrowRight, User,
  Calendar, Location, DocumentChecked, Check,
  Management, TrendCharts, Message, Phone
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const showIntro = ref(true)
const heroReady = ref(false)

// 开场动画控制
onMounted(() => {
  // 1.2秒后淡出开场层
  setTimeout(() => {
    showIntro.value = false
    // 开场层完全淡出后触发 Hero 动画
    setTimeout(() => {
      heroReady.value = true
    }, 600)
  }, 1200)
})

const goToLogin = () => {
  router.push('/login')
}

const scrollToClubs = () => {
  document.getElementById('clubs')?.scrollIntoView({ behavior: 'smooth' })
}

// 功能列表
const features = [
  { icon: 'Search', iconClass: 'icon-blue', title: '社团浏览', desc: '全面了解社团信息、活动历史、成员风采' },
  { icon: 'DocumentChecked', iconClass: 'icon-green', title: '在线申请', desc: '一键提交入社申请，实时查看审核进度' },
  { icon: 'Calendar', iconClass: 'icon-orange', title: '活动报名', desc: '发现感兴趣的活动，快速完成报名登记' },
  { icon: 'Check', iconClass: 'icon-purple', title: '签到记录', desc: '活动签到扫码完成，参与记录随时可查' },
  { icon: 'Management', iconClass: 'icon-cyan', title: '管理审核', desc: '社团管理员高效处理申请、成员、活动' },
  { icon: 'TrendCharts', iconClass: 'icon-pink', title: '数据统计', desc: '社团运营数据可视化，助力科学决策' }
]

// 热门社团数据
const hotClubs = [
  {
    clubId: 'C001',
    clubName: '摄影协会',
    college: '艺术学院',
    currentCount: 45,
    maxCount: 60,
    status: 'NORMAL',
    statusText: '招新中',
    introduction: '用镜头记录校园美好瞬间，定期组织外拍活动和摄影分享会。',
    image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop'
  },
  {
    clubId: 'C002',
    clubName: '编程俱乐部',
    college: '计算机学院',
    currentCount: 38,
    maxCount: 50,
    status: 'NORMAL',
    statusText: '招新中',
    introduction: '编程爱好者的聚集地，定期举办技术分享和编程马拉松。',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
  },
  {
    clubId: 'C003',
    clubName: '辩论社',
    college: '法学院',
    currentCount: 28,
    maxCount: 40,
    status: 'NORMAL',
    statusText: '招新中',
    introduction: '培养批判性思维和表达能力，参加校内外各类辩论赛事。',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
  },
  {
    clubId: 'C004',
    clubName: '青年志愿者协会',
    college: '社会工作学院',
    currentCount: 120,
    maxCount: 150,
    status: 'NORMAL',
    statusText: '招新中',
    introduction: '组织各类志愿服务活动，传递爱心，服务社会。',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop'
  }
]

// 近期活动数据
const recentActivities = [
  {
    activityId: 'A001',
    activityName: '校园摄影大赛',
    clubName: '摄影协会',
    activityTime: '2024-12-20 14:00',
    location: '图书馆报告厅',
    currentCount: 85,
    maxCount: 100,
    status: 'SIGNING',
    statusText: '报名中',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=250&fit=crop'
  },
  {
    activityId: 'A002',
    activityName: '编程马拉松 Hackathon',
    clubName: '编程俱乐部',
    activityTime: '2024-12-25 09:00',
    location: '科技楼实验室',
    currentCount: 42,
    maxCount: 60,
    status: 'SIGNING',
    statusText: '报名中',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop'
  },
  {
    activityId: 'A003',
    activityName: '新年公益义卖',
    clubName: '青年志愿者协会',
    activityTime: '2024-12-28 10:00',
    location: '学生活动中心广场',
    currentCount: 30,
    maxCount: 50,
    status: 'SIGNING',
    statusText: '报名中',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=250&fit=crop'
  }
]

// 滚动触发动画指令
const observerCallbacks = new Map()

const vIntersect = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    observerCallbacks.set(el, observer)
  },
  unmounted(el) {
    const observer = observerCallbacks.get(el)
    if (observer) {
      observer.disconnect()
      observerCallbacks.delete(el)
    }
  }
}

// 导出指令（在 template 中使用 v-intersect）
const onSectionIntersect = vIntersect
const onCardIntersect = vIntersect
</script>

<style scoped>
/* ===== 基础变量 ===== */
.landing-page {
  --primary: #3b82f6;
  --primary-light: #eff6ff;
  --primary-dark: #2563eb;
  --green: #22c55e;
  --green-light: #f0fdf4;
  --orange: #f97316;
  --orange-light: #fff7ed;
  --purple: #a855f7;
  --purple-light: #faf5ff;
  --cyan: #06b6d4;
  --cyan-light: #ecfeff;
  --pink: #ec4899;
  --pink-light: #fdf2f8;
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-400: #94a3b8;
  --gray-600: #475569;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
  --radius: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--gray-800);
  background: #fff;
}

/* ===== 开场层 ===== */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.intro-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridDrift 20s linear infinite;
}

@keyframes gridDrift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

.intro-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.intro-logo {
  margin-bottom: 24px;
  animation: logoPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}

@keyframes logoPop {
  0% { opacity: 0; transform: scale(0.5) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.intro-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--gray-900);
  margin-bottom: 12px;
  animation: titleSlide 0.7s ease-out 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes titleSlide {
  to { opacity: 1; transform: translateY(0); }
}

.intro-slogan {
  font-size: 18px;
  color: var(--gray-600);
  font-weight: 500;
  letter-spacing: 4px;
  animation: sloganFade 0.6s ease-out 0.5s forwards;
  opacity: 0;
}

@keyframes sloganFade {
  to { opacity: 1; }
}

.intro-shapes {
  position: absolute;
  inset: -200px;
  pointer-events: none;
  z-index: -1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: shapeFloat 8s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: var(--primary);
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.shape-2 {
  width: 250px;
  height: 250px;
  background: var(--green);
  top: 60%;
  right: 10%;
  animation-delay: -3s;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: var(--orange);
  bottom: 10%;
  left: 40%;
  animation-delay: -5s;
}

@keyframes shapeFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

/* 开场层淡出 */
.intro-fade-enter-active,
.intro-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.intro-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.intro-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* ===== 导航栏 ===== */
.landing-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  transform: translateY(-100%);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-visible {
  transform: translateY(0);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 48px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-900);
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-link,
.nav-links .router-link-active {
  font-size: 15px;
  color: var(--gray-600);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
  position: relative;
}

.nav-link:hover,
.nav-link.active,
.nav-links .router-link-active:hover,
.nav-links .router-link-active.router-link-active {
  color: var(--primary);
}

.nav-link::after,
.nav-links .router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after,
.nav-links .router-link-active:hover::after,
.nav-links .router-link-active.router-link-active::after {
  width: 100%;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: var(--gray-100);
}

.user-name {
  font-size: 14px;
  color: var(--gray-800);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== Hero 首屏 ===== */
.hero-section {
  padding: 120px 0 80px;
  background: linear-gradient(135deg, var(--primary-light) 0%, #fff 50%, var(--gray-50) 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.hero-content {
  max-width: 560px;
}

/* Hero 动画元素初始状态 */
.hero-badge,
.hero-title,
.hero-subtitle,
.hero-actions {
  opacity: 0;
  transform: translateY(30px);
}

.hero-badge.animate-in {
  animation: fadeSlideUp 0.7s ease-out forwards;
}

.hero-title.animate-in {
  animation: fadeSlideUp 0.7s ease-out 0.1s forwards;
}

.hero-subtitle.animate-in {
  animation: fadeSlideUp 0.7s ease-out 0.2s forwards;
}

.hero-actions.animate-in {
  animation: fadeSlideUp 0.7s ease-out 0.3s forwards;
}

@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border-radius: 100px;
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  color: var(--gray-900);
  margin-bottom: 24px;
}

.title-line {
  display: block;
}

.title-line.highlight {
  color: var(--primary);
}

.hero-subtitle {
  font-size: 20px;
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.hero-btn-primary {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.hero-btn-secondary {
  padding: 16px 32px;
  font-size: 16px;
  transition: transform 0.2s;
}

.hero-btn-secondary:hover {
  transform: translateY(-2px);
}

/* Hero 拼贴网格 */
.hero-collage {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}

.hero-collage.animate-in {
  animation: collageReveal 0.9s ease-out 0.2s forwards;
}

@keyframes collageReveal {
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.collage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 140px);
  gap: 16px;
}

.collage-item {
  border-radius: var(--radius-lg);
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  animation: collageItemIn 0.6s ease-out forwards;
  animation-delay: var(--delay, 0ms);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s;
}

.collage-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  z-index: 2;
}

@keyframes collageItemIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.collage-main {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}

.collage-main img,
.collage-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.collage-item:hover img {
  transform: scale(1.08);
}

.collage-stat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 700;
  transition: transform 0.3s;
}

.collage-stat:hover {
  transform: translateY(-4px) scale(1.05);
}

.stat-blue {
  background: var(--primary);
}

.stat-green {
  background: var(--green);
}

.stat-orange {
  background: var(--orange);
}

.stat-number {
  font-size: 28px;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 4px;
}

/* ===== 通用区块 & 滚动动画 ===== */
.section {
  padding: 112px 0;
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 滚动触发动画 */
.section-header,
.culture-content,
.culture-images,
.cta-container {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.section-header.is-visible,
.culture-content.is-visible,
.culture-images.is-visible,
.cta-container.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 56px;
}

.section-title {
  font-size: 42px;
  font-weight: 750;
  line-height: 1.15;
  color: var(--gray-900);
  margin-bottom: 14px;
}

.section-desc {
  font-size: 17px;
  color: var(--gray-600);
  line-height: 1.75;
}

.section-more {
  text-align: center;
  margin-top: 52px;
}

/* ===== 热门社团 & 活动静态网格 ===== */
.clubs-section {
  background: var(--gray-50);
}

.activities-section {
  background: #fff;
}

.static-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.static-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 42px -28px rgba(15, 23, 42, 0.34);
  border: 1px solid rgba(226, 232, 240, 0.9);
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s ease, border-color 0.3s ease;
}

.static-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.static-card:hover {
  transform: translateY(-6px);
  border-color: rgba(148, 163, 184, 0.45);
  box-shadow: 0 24px 52px -30px rgba(15, 23, 42, 0.42);
}

.static-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  flex-shrink: 0;
}

.static-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.static-card:hover .static-image img {
  transform: scale(1.08);
}

.static-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  background: var(--green);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 100px;
}

.static-status.ENDED {
  background: var(--gray-400);
}

.static-content {
  padding: 22px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.static-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--gray-400);
}

.static-members {
  display: flex;
  align-items: center;
  gap: 4px;
}

.static-name {
  font-size: 19px;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.35;
  margin-bottom: 10px;
}

.static-intro {
  font-size: 14px;
  color: var(--gray-600);
  line-height: 1.7;
  margin-bottom: 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.static-content :deep(.el-button) {
  align-self: flex-start;
  min-height: 38px;
  border-radius: 10px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.static-content :deep(.el-button:active) {
  transform: translateY(1px);
}

.static-content :deep(.el-button--primary.is-text) {
  padding: 8px 2px;
  background: transparent;
}

.static-content :deep(.el-button--primary:not(.is-text)) {
  padding: 10px 18px;
  box-shadow: 0 10px 22px -16px rgba(37, 99, 235, 0.8);
}

/* 活动卡片特殊样式 */
.activity-static-image {
  aspect-ratio: 16 / 10;
}

.activity-static-card .static-club {
  font-size: 13px;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 8px;
}

.activity-static-card .static-name {
  font-size: 19px;
  margin-bottom: 12px;
}

.static-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  flex: 1;
}

.static-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--gray-600);
}

/* ===== 平台功能 ===== */
.features-section {
  background: var(--gray-50);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out, box-shadow 0.3s, translateY 0.3s;
  transition-delay: var(--delay, 0ms);
}

.feature-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.feature-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #fff;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(-5deg);
}

.icon-blue { background: var(--primary); }
.icon-green { background: var(--green); }
.icon-orange { background: var(--orange); }
.icon-purple { background: var(--purple); }
.icon-cyan { background: var(--cyan); }
.icon-pink { background: var(--pink); }

.feature-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 15px;
  color: var(--gray-600);
  line-height: 1.6;
}

/* ===== 社团风采 ===== */
.culture-section {
  background: #fff;
  padding: 100px 0;
}

.culture-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.culture-content .section-title {
  text-align: left;
  margin-bottom: 24px;
}

.culture-text {
  font-size: 16px;
  color: var(--gray-600);
  line-height: 1.8;
  margin-bottom: 16px;
}

.culture-stats {
  display: flex;
  gap: 48px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--gray-200);
}

.culture-stat {
  text-align: center;
  transition: transform 0.3s;
}

.culture-stat:hover {
  transform: translateY(-4px);
}

.culture-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--primary);
  transition: color 0.3s;
}

.culture-stat:hover .culture-number {
  color: var(--primary-dark);
}

.culture-label {
  font-size: 14px;
  color: var(--gray-600);
  margin-top: 4px;
}

.culture-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}

.culture-image {
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.4s, box-shadow 0.4s;
}

.culture-image:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.culture-image.main {
  grid-row: 1 / 3;
}

.culture-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.culture-image:hover img {
  transform: scale(1.05);
}

/* ===== CTA ===== */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  overflow: hidden;
}

.cta-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.cta-title {
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
}

.cta-desc {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.cta-actions .el-button--default {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  transition: transform 0.2s, background 0.2s;
}

.cta-actions .el-button--default:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.cta-actions .el-button--primary {
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-actions .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* ===== Footer ===== */
.landing-footer {
  background: var(--gray-900);
  color: #fff;
  padding: 64px 0 32px;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.footer-desc {
  font-size: 14px;
  color: var(--gray-400);
  line-height: 1.6;
}

.footer-links h4,
.footer-contact h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.footer-links a,
.footer-links .router-link-active {
  display: block;
  color: var(--gray-400);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 12px;
  transition: color 0.2s, transform 0.2s;
}

.footer-links a:hover,
.footer-links .router-link-active:hover {
  color: #fff;
  transform: translateX(4px);
}

.footer-contact p {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-400);
  font-size: 14px;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.footer-contact p:hover {
  color: #fff;
}

.footer-bottom {
  padding-top: 32px;
  border-top: 1px solid var(--gray-800);
  text-align: center;
  color: var(--gray-400);
  font-size: 14px;
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero-collage {
    order: -1;
  }

  .collage-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
  }

  .collage-main {
    grid-column: 1 / 3;
    grid-row: 1 / 2;
    height: 300px;
  }

  .features-grid,
  .static-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .culture-grid {
    grid-template-columns: 1fr;
  }

  .culture-images {
    order: -1;
  }

  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero-title {
    font-size: 36px;
  }

  .section-title {
    font-size: 28px;
  }

  .features-grid,
  .static-grid {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }

  .culture-stats {
    flex-direction: column;
    gap: 24px;
  }
}
/* ===== Brand refresh: align home with About page language ===== */
.landing-page {
  background:
    radial-gradient(circle at 12% 2%, rgba(37, 99, 235, 0.12), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #edf6ff 46%, #fff8ed 100%);
}

.hero-section {
  position: relative;
  isolation: isolate;
  padding: 126px 0 96px;
  background:
    radial-gradient(circle at 18% 12%, rgba(191, 219, 254, 0.46), transparent 32%),
    radial-gradient(circle at 86% 74%, rgba(255, 237, 213, 0.58), transparent 28%),
    linear-gradient(135deg, rgba(248, 251, 255, 0.9), rgba(237, 246, 255, 0.72));
}

.hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.045) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 82%);
}

.hero-grid {
  gap: 82px;
}

.hero-badge {
  border: 1px solid rgba(211, 224, 239, 0.92);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px) saturate(160%);
  color: #2563eb;
  font-weight: 850;
  box-shadow: 0 22px 70px -56px rgba(15, 23, 42, 0.5);
}

.hero-title {
  max-width: 9ch;
  font-size: clamp(52px, 6vw, 82px);
  line-height: 0.98;
  font-weight: 900;
  letter-spacing: 0;
  color: #111827;
}

.title-line.highlight {
  color: #3b82f6;
}

.hero-subtitle {
  color: #526176;
  font-size: 19px;
  line-height: 1.8;
}

.hero-actions :deep(.el-button) {
  min-height: 48px;
  padding: 0 24px;
  border-radius: 999px;
  font-weight: 850;
}

.hero-btn-primary {
  border: 0;
  background: #2563eb;
  box-shadow: 0 20px 36px -26px rgba(37, 99, 235, 0.9);
}

.hero-btn-secondary {
  border: 1px solid rgba(203, 213, 225, 0.84);
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(14px) saturate(150%);
  color: #526176;
}

.hero-btn-secondary:hover {
  border-color: rgba(37, 99, 235, 0.28);
  color: #2563eb;
  background: rgba(255, 255, 255, 0.86);
}

.collage-grid {
  grid-template-rows: repeat(3, 154px);
  gap: 18px;
  perspective: 1000px;
}

.collage-item {
  border: 1px solid rgba(255, 255, 255, 0.74);
  border-radius: 24px;
  box-shadow: 0 28px 80px -60px rgba(15, 23, 42, 0.62);
  animation:
    collageItemIn 0.6s ease-out forwards,
    homeFloat 7s ease-in-out infinite;
  animation-delay: var(--delay, 0ms), calc(var(--delay, 0ms) + 900ms);
}

.collage-item:hover {
  transform: translateY(-7px) scale(1.015);
  box-shadow: 0 36px 96px -62px rgba(15, 23, 42, 0.72);
}

.collage-stat {
  color: #f8fbff;
}

.stat-blue {
  background: #3b82f6;
}

.stat-green {
  background: #2ac56f;
}

.stat-orange {
  background: #ff7a1a;
}

.stat-number {
  font-size: 32px;
  font-weight: 900;
}

.section {
  position: relative;
  padding: 118px 0;
  background: transparent;
}

.clubs-section,
.activities-section,
.features-section,
.culture-section {
  background: transparent;
}

.section-title {
  color: #111827;
  font-size: clamp(34px, 4.8vw, 58px);
  line-height: 1.06;
  font-weight: 900;
  letter-spacing: 0;
}

.section-desc {
  max-width: 52ch;
  margin: 14px auto 0;
  color: #526176;
}

.static-grid,
.features-grid {
  gap: 24px;
}

.static-card,
.feature-card {
  border: 1px solid rgba(211, 224, 239, 0.88);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(16px) saturate(150%);
  box-shadow: 0 28px 78px -64px rgba(15, 23, 42, 0.58);
}

.static-card:hover,
.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(37, 99, 235, 0.26);
  box-shadow: 0 34px 90px -66px rgba(15, 23, 42, 0.72);
}

.static-image {
  margin: 14px 14px 0;
  border-radius: 22px;
  aspect-ratio: 16 / 10.5;
}

.static-status {
  top: 14px;
  right: 14px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  background: rgba(220, 252, 231, 0.88);
  color: #16a34a;
  font-weight: 850;
}

.static-content {
  padding: 22px 24px 24px;
}

.static-name {
  color: #111827;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0;
}

.static-intro,
.static-info-item,
.culture-text,
.feature-desc {
  color: #526176;
}

.static-content :deep(.el-button) {
  border-radius: 999px;
  font-weight: 850;
}

.feature-card {
  position: relative;
  overflow: hidden;
  min-height: 250px;
  text-align: left;
}

.feature-card::after {
  content: "";
  position: absolute;
  right: -54px;
  bottom: -68px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(219, 234, 254, 0.58);
}

.feature-icon {
  margin: 0 0 28px;
  border-radius: 20px;
  box-shadow: 0 18px 44px -32px rgba(15, 23, 42, 0.55);
}

.feature-card:hover .feature-icon {
  transform: translateY(-2px) scale(1.04);
}

.feature-title,
.feature-desc {
  position: relative;
  z-index: 1;
}

.culture-grid {
  padding: 44px;
  border: 1px solid rgba(211, 224, 239, 0.86);
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.64);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow: 0 32px 88px -68px rgba(15, 23, 42, 0.58);
}

.culture-stats {
  border-top: 1px solid rgba(203, 213, 225, 0.72);
}

.culture-number {
  color: #2563eb;
  font-weight: 900;
}

.culture-image {
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 26px;
  box-shadow: 0 22px 64px -52px rgba(15, 23, 42, 0.58);
}

.cta-section {
  padding: 112px 0;
  background: transparent;
}

.cta-container {
  max-width: 1180px;
}

.cta-content {
  position: relative;
  overflow: hidden;
  padding: 54px 36px;
  border: 1px solid rgba(211, 224, 239, 0.82);
  border-radius: 34px;
  background: linear-gradient(120deg, #dcecff 0%, #f8fbff 48%, #fff1dc 100%);
  background-size: 170% 170%;
  box-shadow: 0 34px 96px -68px rgba(15, 23, 42, 0.58);
  animation: softGradientHome 8s ease-in-out infinite alternate;
}

.cta-content::after {
  content: "";
  position: absolute;
  right: -90px;
  bottom: -130px;
  width: 330px;
  height: 330px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.48);
}

.cta-title {
  position: relative;
  z-index: 1;
  color: #111827;
  font-size: clamp(34px, 4vw, 52px);
  font-weight: 900;
}

.cta-desc,
.cta-actions {
  position: relative;
  z-index: 1;
}

.cta-desc {
  color: #526176;
}

.cta-actions .el-button--default {
  border-color: rgba(203, 213, 225, 0.82);
  background: rgba(255, 255, 255, 0.62);
  color: #526176;
  border-radius: 999px;
}

.cta-actions .el-button--primary {
  border-radius: 999px;
  background: #2563eb;
  border-color: #2563eb;
  box-shadow: 0 20px 36px -26px rgba(37, 99, 235, 0.9);
}

.landing-footer {
  border-top: 1px solid rgba(211, 224, 239, 0.78);
  background: rgba(248, 251, 255, 0.78);
  color: #111827;
}

.footer-desc,
.footer-links a,
.footer-links .router-link-active,
.footer-contact p,
.footer-bottom {
  color: #64748b;
}

.footer-links a:hover,
.footer-links .router-link-active:hover,
.footer-contact p:hover {
  color: #2563eb;
}

.footer-bottom {
  border-top-color: rgba(203, 213, 225, 0.68);
}

@keyframes homeFloat {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -7px;
  }
}

@keyframes softGradientHome {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}

@media (max-width: 1024px) {
  .hero-grid {
    gap: 42px;
  }

  .culture-grid {
    padding: 28px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding-top: 104px;
  }

  .hero-title {
    font-size: 44px;
  }

  .collage-grid {
    grid-template-rows: repeat(3, 120px);
  }

  .section {
    padding: 82px 0;
  }

  .culture-grid {
    border-radius: 28px;
  }
}
</style>
