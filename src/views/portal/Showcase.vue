<template>
  <div class="showcase-page">
    <div class="page-header">
      <h1>社团风采</h1>
      <p>展示社团精彩瞬间，记录校园美好时光</p>
    </div>

    <el-row :gutter="24">
      <el-col :xs="24" :md="12" v-for="(item, idx) in showcases" :key="idx">
        <el-card class="showcase-card" shadow="hover">
          <div class="showcase-cover" :style="{ background: item.color }">
            <el-icon size="48" color="#fff"><component :is="item.icon" /></el-icon>
          </div>
          <div class="showcase-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="showcase-tags">
              <el-tag v-for="tag in item.tags" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Trophy, Mic, Brush, Camera, Headset, Basketball } from '@element-plus/icons-vue'

const showcases = ref([
  {
    title: '年度社团盛典',
    desc: '汇聚全校优秀社团，展示一年来的成果与风采。舞台表演、作品展览、互动体验，精彩纷呈。',
    color: '#409eff',
    icon: 'Trophy',
    tags: ['晚会', '表彰', '演出']
  },
  {
    title: '社团文化节',
    desc: '为期一周的文化盛宴，各社团轮番上阵，带来独具特色的文化体验活动。',
    color: '#67c23a',
    icon: 'Brush',
    tags: ['文化', '体验', '互动']
  },
  {
    title: '校园歌手大赛',
    desc: '由音乐社团主办，发掘校园好声音，为热爱音乐的同学提供展示舞台。',
    color: '#e6a23c',
    icon: 'Mic',
    tags: ['音乐', '比赛', '演出']
  },
  {
    title: '摄影作品展',
    desc: '摄影社团年度作品展，用镜头记录校园美景与青春故事。',
    color: '#f56c6c',
    icon: 'Camera',
    tags: ['摄影', '展览', '艺术']
  },
  {
    title: '音乐节',
    desc: '户外草坪音乐节，邀请校内乐队和独立音乐人，带来一场视听盛宴。',
    color: '#909399',
    icon: 'Headset',
    tags: ['音乐', '户外', '派对']
  },
  {
    title: '体育联赛',
    desc: '篮球、足球、羽毛球等多项体育赛事，由体育社团联合举办，展现运动魅力。',
    color: '#409eff',
    icon: 'Basketball',
    tags: ['体育', '比赛', '团队']
  }
])
</script>

<style scoped>
.showcase-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}
.page-header {
  margin-bottom: 32px;
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
.showcase-card {
  margin-bottom: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.showcase-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}
.showcase-card :deep(.el-card__body) {
  padding: 0;
}
.showcase-cover {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 4px 0 0;
}
.showcase-content {
  padding: 20px;
}
.showcase-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}
.showcase-content p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 16px;
}
.showcase-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
