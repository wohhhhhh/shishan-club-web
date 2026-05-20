<template>
  <div class="portal-layout">
    <Navbar v-if="!$route.meta.hideNavbar" />
    <main class="portal-main" :class="{ 'no-padding': $route.meta.hideNavbar }">
      <router-view />
    </main>
    <footer class="portal-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <el-icon size="24" color="#409eff"><School /></el-icon>
          <span>狮山社栈</span>
        </div>
        <p class="footer-desc">发现热爱 · 连接成长 — 校园社团一站式服务平台</p>
        <p class="footer-copy">© 2026 狮山社栈 All Rights Reserved</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { School } from '@element-plus/icons-vue'
</script>

<style scoped>
.portal-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 16% 6%, rgba(59, 130, 246, 0.12), transparent 30%),
    linear-gradient(135deg, #f8fbff 0%, #edf6ff 48%, #fff8ed 100%);
}
.portal-main {
  flex: 1;
  padding-top: 64px;
}
.portal-main.no-padding {
  padding-top: 0;
}
.portal-footer {
  background: #f5f7fa;
  border-top: 1px solid #e8e8e8;
  padding: 40px 24px;
  text-align: center;
}
.footer-content {
  max-width: 1280px;
  margin: 0 auto;
}
.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}
.footer-desc {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}
.footer-copy {
  color: #c0c4cc;
  font-size: 12px;
}
</style>
