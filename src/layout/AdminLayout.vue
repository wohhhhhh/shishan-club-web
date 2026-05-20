<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="header-left">
        <span class="logo">狮山社栈管理后台</span>
      </div>
      <div class="header-right">
        <span class="username">{{ userStore.userInfo?.name }}</span>
        <el-button text @click="backHome">返回首页</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px" class="aside">
        <el-menu :default-active="route.path" router class="menu" background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff">
          <el-menu-item v-for="item in visibleMenus" :key="item.path" :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const clubAdminMenus = [
  { path: '/admin/home', label: '后台首页', icon: 'DataAnalysis' },
  { path: '/admin/my-club', label: '我的社团', icon: 'Collection' },
  { path: '/admin/applications', label: '申请审核', icon: 'Document' },
  { path: '/admin/members', label: '成员管理', icon: 'UserFilled' },
  { path: '/admin/activities', label: '活动管理', icon: 'Calendar' },
  { path: '/admin/signups', label: '报名签到', icon: 'Tickets' }
]

const superAdminMenus = [
  { path: '/admin/clubs', label: '社团管理', icon: 'OfficeBuilding' },
  { path: '/admin/users', label: '用户管理', icon: 'User' },
  { path: '/admin/admin-assign', label: '管理员分配', icon: 'Setting' }
]

const isSuperAdmin = computed(() => ['super_admin', 'admin'].includes(userStore.role))
const visibleMenus = computed(() => {
  if (isSuperAdmin.value) {
    return [...clubAdminMenus, ...superAdminMenus]
  }
  return clubAdminMenus
})

const backHome = () => {
  router.push('/')
}
</script>

<style scoped>
.layout { height: 100vh; }
.header {
  display: flex; align-items: center; justify-content: space-between;
  background: #304156; color: #fff; padding: 0 24px;
}
.logo { font-size: 18px; font-weight: 600; }
.header-right { display: flex; align-items: center; gap: 12px; }
.username { color: #bfcbd9; font-size: 14px; }
.aside { background: #304156; overflow-y: auto; }
.menu { border-right: none; }
.main { background: #f0f2f5; min-height: 0; overflow-y: auto; }
</style>
