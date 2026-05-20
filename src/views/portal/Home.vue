<template>
  <div class="portal-home">
    <!-- Hero 首屏 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <el-icon><StarFilled /></el-icon>
            <span>校园社团一站式服务平台</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line">发现热爱</span>
            <span class="title-line highlight">加入属于你的</span>
            <span class="title-line">校园社团</span>
          </h1>
          <p class="hero-subtitle">
            浏览社团、报名活动、记录你的校园生活
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="$router.push('/clubs')">
              <el-icon><Search /></el-icon>
              浏览社团
            </el-button>
            <el-button size="large" @click="$router.push('/activities')">
              探索活动
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-num">{{ stats.clubCount }}</div>
            <div class="stat-label">入驻社团</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.activityCount }}</div>
            <div class="stat-label">近期活动</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.memberCount }}</div>
            <div class="stat-label">参与学生</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门社团 -->
    <section class="section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">🔥 热门社团</h2>
          <router-link to="/clubs" class="section-more">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="club in hotClubs" :key="club.clubId">
            <el-card shadow="hover" class="club-card" @click="$router.push(`/clubs/${club.clubId}`)">
              <div class="club-cover" :style="{ background: club.coverColor || '#409eff' }">
                <el-icon size="40" color="#fff"><component :is="club.icon || 'Collection'" /></el-icon>
              </div>
              <div class="club-info">
                <h3 class="club-name">{{ club.clubName }}</h3>
                <p class="club-college">{{ club.college }}</p>
                <div class="club-meta">
                  <span><el-icon><User /></el-icon> {{ club.currentCount }}/{{ club.maxCount }}</span>
                  <StatusTag type="club" :value="club.status" size="small" />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- 近期活动 -->
    <section class="section section-alt">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">📅 近期活动</h2>
          <router-link to="/activities" class="section-more">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="act in recentActivities" :key="act.activityId">
            <el-card shadow="hover" class="activity-card" @click="$router.push(`/activities/${act.activityId}`)">
              <div class="activity-cover" :style="{ background: act.coverColor || '#67c23a' }">
                <el-icon size="36" color="#fff"><component :is="act.icon || 'Calendar'" /></el-icon>
              </div>
              <div class="activity-info">
                <h3 class="activity-name">{{ act.activityName }}</h3>
                <p class="activity-club">{{ act.clubName }}</p>
                <p class="activity-time">
                  <el-icon><Clock /></el-icon> {{ act.activityTime }}
                </p>
                <p class="activity-location">
                  <el-icon><Location /></el-icon> {{ act.location }}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- 平台特性 -->
    <section class="section">
      <div class="section-container">
        <h2 class="section-title center">✨ 平台功能</h2>
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="8" v-for="f in features" :key="f.title">
            <div class="feature-card">
              <div class="feature-icon" :style="{ background: f.color }">
                <el-icon size="28" color="#fff"><component :is="f.icon" /></el-icon>
              </div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { StarFilled, Search, ArrowRight, User, Clock, Location, Collection, Calendar, Document, Flag, Tickets, Setting } from '@element-plus/icons-vue'
import StatusTag from '@/components/StatusTag.vue'
import { getClubList } from '@/api/club'
import { getActivityList } from '@/api/activity'

const stats = ref({ clubCount: 0, activityCount: 0, memberCount: 0 })
const hotClubs = ref([])
const recentActivities = ref([])

const features = [
  { title: '社团浏览', desc: '发现感兴趣的社团，了解社团详情与招新信息', icon: 'Collection', color: '#409eff' },
  { title: '活动报名', desc: '查看近期活动，一键报名参与校园精彩活动', icon: 'Calendar', color: '#67c23a' },
  { title: '在线申请', desc: '提交入社申请，实时查看审核进度', icon: 'Document', color: '#e6a23c' },
  { title: '成员管理', desc: '社团干部高效管理成员信息与职务分配', icon: 'Flag', color: '#f56c6c' },
  { title: '报名签到', desc: '活动报名管理与现场签到，数据统计一目了然', icon: 'Tickets', color: '#909399' },
  { title: '个人中心', desc: '管理个人信息、修改密码、查看参与记录', icon: 'Setting', color: '#409eff' }
]

onMounted(async () => {
  try {
    const [clubRes, actRes] = await Promise.all([
      getClubList({ page: 1, page_size: 8 }),
      getActivityList({ page: 1, page_size: 6 })
    ])
    hotClubs.value = clubRes.data?.list?.slice(0, 4) || []
    recentActivities.value = actRes.data?.list?.slice(0, 3) || []
    stats.value = {
      clubCount: clubRes.data?.total || 0,
      activityCount: actRes.data?.total || 0,
      memberCount: 5000
    }
  } catch (e) {
    console.error('首页数据加载失败', e)
  }
})
</script>

<style scoped>
.portal-home {
  background: #fff;
}

/* Hero */
.hero-section {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  padding: 80px 24px 60px;
}
.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
}
.hero-content {
  flex: 1;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 20px;
}
.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: #303133;
  margin: 0 0 20px;
}
.title-line {
  display: block;
}
.title-line.highlight {
  color: #409eff;
}
.hero-subtitle {
  font-size: 18px;
  color: #606266;
  margin-bottom: 32px;
}
.hero-actions {
  display: flex;
  gap: 16px;
}
.hero-stats {
  display: flex;
  gap: 40px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
.stat-item {
  text-align: center;
}
.stat-num {
  font-size: 36px;
  font-weight: 700;
  color: #409eff;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

/* Section */
.section {
  padding: 60px 24px;
}
.section-alt {
  background: #f5f7fa;
}
.section-container {
  max-width: 1280px;
  margin: 0 auto;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}
.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin: 0;
}
.section-title.center {
  text-align: center;
  margin-bottom: 40px;
}
.section-more {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}
.section-more:hover {
  color: #66b1ff;
}

/* Club Card */
.club-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 20px;
}
.club-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}
.club-card :deep(.el-card__body) {
  padding: 0;
}
.club-cover {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0 0;
}
.club-info {
  padding: 16px;
}
.club-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}
.club-college {
  font-size: 13px;
  color: #909399;
  margin: 0 0 12px;
}
.club-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #606266;
}
.club-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Activity Card */
.activity-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 20px;
}
.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}
.activity-card :deep(.el-card__body) {
  padding: 0;
}
.activity-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0 0;
}
.activity-info {
  padding: 16px;
}
.activity-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}
.activity-club {
  font-size: 13px;
  color: #409eff;
  margin: 0 0 8px;
}
.activity-time,
.activity-location {
  font-size: 13px;
  color: #909399;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Feature Card */
.feature-card {
  text-align: center;
  padding: 32px 24px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}
.feature-card p {
  font-size: 14px;
  color: #909399;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
  }
  .hero-title {
    font-size: 32px;
  }
  .hero-stats {
    width: 100%;
    justify-content: center;
  }
  .hero-actions {
    justify-content: center;
  }
}
</style>
