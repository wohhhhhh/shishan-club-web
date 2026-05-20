import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 公开前台页面（无需登录）
const portalRoutes = [
  { path: '', name: 'PortalHome', component: () => import('@/views/landing/Home.vue'), meta: { title: '首页', hideNavbar: true } },
  { path: 'clubs', name: 'ClubSquare', component: () => import('@/views/portal/ClubSquare.vue'), meta: { title: '社团广场' } },
  { path: 'clubs/:id', name: 'ClubDetailPublic', component: () => import('@/views/portal/ClubDetail.vue'), meta: { title: '社团详情' } },
  { path: 'activities', name: 'ActivityCenter', component: () => import('@/views/portal/ActivityCenter.vue'), meta: { title: '活动中心' } },
  { path: 'activities/:id', name: 'ActivityDetailPublic', component: () => import('@/views/portal/ActivityDetail.vue'), meta: { title: '活动详情' } },
  { path: 'recruit', name: 'ClubRecruit', component: () => import('@/views/portal/Recruit.vue'), meta: { title: '社团招新' } },
  { path: 'showcase', name: 'ClubShowcase', component: () => import('@/views/portal/Showcase.vue'), meta: { title: '社团风采' } },
  { path: 'features', name: 'PlatformFeatures', component: () => import('@/views/portal/Features.vue'), meta: { title: '平台功能' } },
  { path: 'about', name: 'AboutUs', component: () => import('@/views/portal/About.vue'), meta: { title: '关于我们' } },
  // 需要登录的个人页面
  { path: 'profile', name: 'Profile', component: () => import('@/views/student/Profile.vue'), meta: { title: '个人中心', requiresAuth: true } },
  { path: 'my-applications', name: 'MyApplications', component: () => import('@/views/student/MyApplications.vue'), meta: { title: '我的申请', requiresAuth: true } },
  { path: 'my-clubs', name: 'MyClubs', component: () => import('@/views/student/MyClubs.vue'), meta: { title: '我的社团', requiresAuth: true } },
  { path: 'my-activities', name: 'MyActivities', component: () => import('@/views/student/MyActivities.vue'), meta: { title: '我的活动', requiresAuth: true } }
]

// 管理后台页面
const adminRoutes = [
  { path: 'home', name: 'AdminHome', component: () => import('@/views/admin/Home.vue'), meta: { title: '管理首页' } },
  { path: 'my-club', name: 'AdminMyClub', component: () => import('@/views/admin/MyClub.vue'), meta: { title: '我的社团' } },
  { path: 'clubs', name: 'ClubManage', component: () => import('@/views/admin/ClubManage.vue'), meta: { title: '社团管理' } },
  { path: 'users', name: 'UserManage', component: () => import('@/views/admin/UserManage.vue'), meta: { title: '用户管理' } },
  { path: 'admin-assign', name: 'AdminAssign', component: () => import('@/views/admin/AdminAssign.vue'), meta: { title: '管理员分配' } },
  { path: 'applications', name: 'ApplicationReview', component: () => import('@/views/admin/ApplicationReview.vue'), meta: { title: '申请审核' } },
  { path: 'members', name: 'MemberManage', component: () => import('@/views/admin/MemberManage.vue'), meta: { title: '成员管理' } },
  { path: 'activities', name: 'ActivityManage', component: () => import('@/views/admin/ActivityManage.vue'), meta: { title: '活动管理' } },
  { path: 'signups', name: 'SignupManage', component: () => import('@/views/admin/SignupManage.vue'), meta: { title: '报名签到' } },
  { path: 'quit-applications', name: 'QuitReview', component: () => import('@/views/admin/QuitReview.vue'), meta: { title: '退社审核' } }
]

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/demo/club-tiles',
    name: 'ClubTileDemo',
    component: () => import('@/views/demo/ClubTileDemo.vue'),
    meta: { title: '社团磁贴 Demo' }
  },
  {
    path: '/demo/activity-image-grid',
    name: 'ActivityImageGridDemo',
    component: () => import('@/views/demo/ActivityImageGridDemo.vue'),
    meta: { title: '活动图片流 Demo' }
  },
  {
    path: '/demo/activity-glass-detail',
    name: 'ActivityGlassDetailDemo',
    component: () => import('@/views/demo/ActivityGlassDetailDemo.vue'),
    meta: { title: '活动玻璃详情 Demo' }
  },
  {
    path: '/',
    component: () => import('@/layout/PortalLayout.vue'),
    children: portalRoutes
  },
  {
    path: '/admin',
    component: () => import('@/layout/AdminLayout.vue'),
    redirect: '/admin/home',
    meta: { requiresAuth: true, requiresManage: true },
    children: adminRoutes
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title || '学生社团管理系统') + ' - 狮山社栈'
  const userStore = useUserStore()
  const role = userStore.role
  const canAccessAdmin = ['admin', 'super_admin', 'leader', 'club_admin', 'officer'].includes(role)

  // 需要登录但未登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login?redirect=' + encodeURIComponent(to.fullPath))
    return
  }

  // 需要管理权限但无权限
  if (to.meta.requiresManage && !canAccessAdmin) {
    next('/')
    return
  }

  // 已登录用户访问登录页，跳首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
    return
  }

  next()
})

export default router
