<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': scrolled }">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/" class="logo">
          <span class="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m8 3 4 8 5-5 5 15H2z" />
              <path d="M4.14 15.08q3.93-2.355 7.86.42c2.74 1.94 5.49 2 8.23.19" />
            </svg>
          </span>
          <span class="logo-text">狮山社栈</span>
        </router-link>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">首页</router-link>
        <router-link to="/clubs" class="nav-link" :class="{ active: route.path.startsWith('/clubs') }">社团广场</router-link>
        <router-link to="/activities" class="nav-link" :class="{ active: route.path.startsWith('/activities') }">活动中心</router-link>
        <router-link to="/recruit" class="nav-link" :class="{ active: route.path === '/recruit' }">社团招新</router-link>
        <router-link to="/about" class="nav-link" :class="{ active: route.path === '/about' }">关于我们</router-link>
      </div>
      <div class="nav-right">
        <template v-if="!userStore.isLoggedIn">
          <div class="auth-actions">
            <button type="button" class="auth-link auth-primary" @click="$router.push('/login')">登录</button>
            <button type="button" class="auth-link" @click="goRegister">注册</button>
          </div>
        </template>
        <template v-else>
          <el-dropdown trigger="click" popper-class="user-dropdown-popper" @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="user-name">{{ userStore.userInfo?.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item v-if="userStore.canManage" command="admin">
                  <el-icon><Setting /></el-icon>管理后台
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserFilled, ArrowDown, User, Setting, SwitchButton } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const goRegister = () => {
  router.push({ path: '/login', query: { tab: 'register' } })
}

const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    userStore.logout()
    router.push('/')
  } else if (cmd === 'admin') {
    router.push('/admin/home')
  } else {
    router.push('/' + cmd)
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 14px;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}
.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 54px;
  display: grid;
  grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr);
  align-items: center;
  gap: 18px;
}
.nav-left {
  display: flex;
  align-items: center;
  min-width: 0;
  pointer-events: auto;
}
.logo {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  padding: 7px 14px 7px 11px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  background: rgba(240, 247, 255, 0.66);
  backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.logo:hover {
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
}
.logo-mark {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  filter:
    drop-shadow(0 1px 0 rgba(37, 99, 235, 0.34))
    drop-shadow(0 6px 12px rgba(37, 99, 235, 0.18));
  flex-shrink: 0;
}
.logo-mark svg {
  width: 23px;
  height: 23px;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.logo-text {
  font-size: 16px;
  font-weight: 750;
  color: #334155;
}
.nav-links {
  display: flex;
  justify-self: center;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  background: rgba(240, 247, 255, 0.66);
  backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
  pointer-events: auto;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 650;
  color: rgba(71, 85, 105, 0.72);
  text-decoration: none;
  padding: 8px 16px;
  position: relative;
  border-radius: 999px;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.nav-link:hover {
  color: #1f2937;
  background: rgba(255, 255, 255, 0.62);
  transform: translateY(-1px);
}
.nav-link.active {
  color: #2563eb;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.14);
}
.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
  pointer-events: auto;
}
.auth-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  background: rgba(240, 247, 255, 0.66);
  backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
}
.auth-link {
  min-height: 34px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgba(71, 85, 105, 0.72);
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.auth-link:hover {
  color: #1f2937;
  background: rgba(255, 255, 255, 0.62);
  transform: translateY(-1px);
}
.auth-primary {
  color: #2563eb;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.14);
}
.auth-primary:hover {
  color: #1d4ed8;
  background: rgba(255, 255, 255, 1);
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  min-height: 44px;
  padding: 6px 12px 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  background: rgba(240, 247, 255, 0.66);
  backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.08);
  transition:
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}
.user-info:hover {
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
}
.user-name {
  font-size: 14px;
  font-weight: 750;
  color: #334155;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-info :deep(.el-avatar) {
  background: rgba(148, 163, 184, 0.48);
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.user-info :deep(.el-icon) {
  color: #64748b;
}

:global(.user-dropdown-popper.el-popper) {
  border: 1px solid rgba(226, 232, 240, 0.86);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 22px 60px -42px rgba(15, 23, 42, 0.55);
}

:global(.user-dropdown-popper .el-dropdown-menu) {
  padding: 8px;
  background: transparent;
}

:global(.user-dropdown-popper .el-dropdown-menu__item) {
  min-height: 40px;
  border-radius: 12px;
  color: #475569;
  font-size: 14px;
  font-weight: 650;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

:global(.user-dropdown-popper .el-dropdown-menu__item:hover) {
  background: rgba(37, 99, 235, 0.09);
  color: #2563eb;
  transform: translateY(-1px);
}

@media (max-width: 980px) {
  .nav-container {
    grid-template-columns: auto 1fr auto;
    gap: 12px;
  }

  .nav-links {
    justify-self: stretch;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .nav-links::-webkit-scrollbar {
    display: none;
  }

  .nav-link {
    flex: 0 0 auto;
    padding: 8px 14px;
  }
}
</style>
