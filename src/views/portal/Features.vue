<template>
  <div class="features-page">
    <div class="page-header">
      <h1>平台功能</h1>
      <p>狮山社栈为校园社团提供一站式数字化管理解决方案</p>
    </div>

    <el-row :gutter="24">
      <el-col :xs="24" :sm="12" :md="8" v-for="f in features" :key="f.title">
        <div class="feature-item">
          <div class="feature-icon" :style="{ background: f.color }">
            <el-icon size="32" color="#fff"><component :is="f.icon" /></el-icon>
          </div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </el-col>
    </el-row>

    <el-divider />

    <div class="feature-section">
      <h2>使用流程</h2>
      <el-steps :active="3" finish-status="success" simple>
        <el-step title="浏览社团" description="发现感兴趣的社团" />
        <el-step title="提交申请" description="填写申请理由" />
        <el-step title="审核通过" description="成为社团成员" />
        <el-step title="参与活动" description="报名社团活动" />
      </el-steps>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  { title: '社团展示', desc: '每个社团拥有独立展示页面，介绍社团文化、活动记录、成员风采', icon: 'Collection', color: '#409eff' },
  { title: '在线招新', desc: '社团发布招新信息，学生在线提交申请，简化入社流程', icon: 'User', color: '#67c23a' },
  { title: '活动发布', desc: '社团干部发布活动信息，设置报名时间与人数限制', icon: 'Calendar', color: '#e6a23c' },
  { title: '活动报名', desc: '学生浏览活动列表，一键报名，查看报名状态', icon: 'Tickets', color: '#f56c6c' },
  { title: '成员管理', desc: '社团干部管理成员信息，分配职务，处理退社申请', icon: 'Flag', color: '#909399' },
  { title: '数据统计', desc: '社团人数、活动参与、报名情况等数据一目了然', icon: 'DataAnalysis', color: '#409eff' },
  { title: '签到管理', desc: '活动现场扫码签到，记录参与情况，生成统计报表', icon: 'CircleCheck', color: '#67c23a' },
  { title: '通知公告', desc: '重要通知及时推送，确保信息传达无遗漏', icon: 'Bell', color: '#e6a23c' },
  { title: '个人中心', desc: '管理个人信息，查看申请记录、参与活动、所属社团', icon: 'UserFilled', color: '#f56c6c' }
])
</script>

<style scoped>
.features-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  margin-bottom: 40px;
  text-align: center;
}
.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 12px;
}
.page-header p {
  color: #909399;
  font-size: 16px;
  margin: 0;
}
.feature-item {
  text-align: center;
  padding: 32px 24px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.feature-item h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}
.feature-item p {
  font-size: 14px;
  color: #909399;
  margin: 0;
  line-height: 1.6;
}
.feature-section {
  margin-top: 40px;
}
.feature-section h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}
</style>
