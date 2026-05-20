<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="header-left">
        <span class="logo">📚 学生社团管理系统</span>
      </div>
      <div class="header-right">
        <span class="username">{{ userStore.userInfo?.name }}</span>
        <el-button type="danger" text @click="handleLogout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu :default-active="route.path" router class="menu">
          <el-menu-item index="/student/home">
            <el-icon><HomeFilled /></el-icon><span>首页</span>
          </el-menu-item>
          <el-menu-item index="/student/clubs">
            <el-icon><Collection /></el-icon><span>社团浏览</span>
          </el-menu-item>
          <el-menu-item index="/student/applications">
            <el-icon><Document /></el-icon><span>我的申请</span>
          </el-menu-item>
          <el-menu-item index="/student/my-clubs">
            <el-icon><Flag /></el-icon><span>我的社团</span>
          </el-menu-item>
          <el-menu-item index="/student/activities">
            <el-icon><Calendar /></el-icon><span>活动中心</span>
          </el-menu-item>
          <el-menu-item index="/student/my-activities">
            <el-icon><Tickets /></el-icon><span>我的活动</span>
          </el-menu-item>
          <el-menu-item index="/student/profile">
            <el-icon><User /></el-icon><span>个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout { height: 100vh; }
.header {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0 24px;
}
.logo { font-size: 18px; font-weight: 600; color: #409eff; }
.header-right { display: flex; align-items: center; gap: 12px; }
.username { color: #666; font-size: 14px; }
.aside { background: #fafafa; border-right: 1px solid #e8e8e8; }
.menu { border-right: none; }
.main { background: #f5f7fa; min-height: 0; overflow-y: auto; }
</style>
