<template>
  <div class="profile-page">
    <!-- 左侧设置导航 -->
    <aside class="settings-nav">
      <div class="nav-header">
        <h2 class="nav-title">个人中心</h2>
      </div>
      <nav class="nav-menu">
        <a
          v-for="item in menuItems"
          :key="item.key"
          :class="['nav-item', { active: activeSection === item.key }]"
          @click="scrollToSection(item.key)"
        >
          {{ item.label }}
        </a>
      </nav>
    </aside>

    <!-- 右侧内容区 -->
    <main class="settings-content">
      <!-- Account Profile -->
      <section id="account" ref="accountRef" class="settings-section">
        <div class="section-header">
          <h3 class="section-title">账号资料</h3>
          <p class="section-desc">管理你的个人头像和基础身份信息</p>
        </div>
        <div class="settings-card">
          <div class="profile-header">
            <div class="avatar-wrapper">
              <div class="avatar" :style="avatarStyle">
                {{ avatarText }}
              </div>
              <div class="avatar-info">
                <div class="avatar-name">{{ userStore.userInfo?.name }}</div>
                <div class="avatar-role">{{ roleText }}</div>
              </div>
            </div>
          </div>
          <div class="profile-readonly">
            <div class="readonly-row">
              <span class="readonly-label">学号</span>
              <span class="readonly-value">{{ userStore.userInfo?.studentId }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Basic Information -->
      <section id="basic" ref="basicRef" class="settings-section">
        <div class="section-header">
          <h3 class="section-title">基础资料</h3>
          <p class="section-desc">更新你的个人信息，这些信息将显示在社团活动中</p>
        </div>
        <div class="settings-card">
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-position="top"
            class="compact-form"
          >
            <div class="form-row">
              <el-form-item label="姓名" prop="name" class="form-col">
                <el-input v-model="profileForm.name" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="性别" prop="gender" class="form-col">
                <el-select v-model="profileForm.gender" placeholder="请选择">
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                  <el-option label="保密" value="unknown" />
                </el-select>
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="学院" prop="college" class="form-col">
                <el-input v-model="profileForm.college" placeholder="请输入学院" />
              </el-form-item>
              <el-form-item label="班级" prop="className" class="form-col">
                <el-input v-model="profileForm.className" placeholder="请输入班级" />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="手机号" prop="phone" class="form-col">
                <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email" class="form-col">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
              </el-form-item>
            </div>
          </el-form>
          <div class="card-footer">
            <el-button
              type="primary"
              :loading="profileSaving"
              class="save-btn"
              @click="saveProfile"
            >
              保存更改
            </el-button>
          </div>
        </div>
      </section>

      <!-- My Applications -->
      <section id="applications" ref="applicationsRef" class="settings-section">
        <div class="section-header">
          <h3 class="section-title">我的申请</h3>
          <p class="section-desc">查看你加入社团的申请记录和审核状态</p>
        </div>
        <div class="settings-card">
          <div v-if="appLoading" class="list-loading">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else-if="appList.length === 0" class="list-empty">
            <div class="empty-text">暂无申请记录</div>
            <div class="empty-hint">去社团广场发现感兴趣的社团吧</div>
          </div>
          <div v-else class="app-list">
            <div v-for="item in appList" :key="item.applicationId" class="app-item">
              <div class="app-main">
                <div class="app-club">{{ item.clubName }}</div>
                <div class="app-reason" :title="item.reason">{{ item.reason || '无申请理由' }}</div>
              </div>
              <div class="app-meta">
                <StatusTag type="application" :value="item.status" />
                <span class="app-time">{{ item.applyTime }}</span>
              </div>
              <div v-if="item.reviewTime" class="app-review">
                <span class="review-label">审核时间</span>
                <span class="review-time">{{ item.reviewTime }}</span>
                <span v-if="item.comment" class="review-comment">{{ item.comment }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- My Clubs -->
      <section id="clubs" ref="clubsRef" class="settings-section">
        <div class="section-header">
          <h3 class="section-title">我的社团</h3>
          <p class="section-desc">管理你已加入的社团和成员身份</p>
        </div>
        <div class="settings-card">
          <div v-if="clubLoading" class="list-loading">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else-if="clubList.length === 0" class="list-empty">
            <div class="empty-text">暂未加入任何社团</div>
            <div class="empty-hint">去社团广场申请加入感兴趣的社团</div>
          </div>
          <div v-else class="club-list">
            <div v-for="item in clubList" :key="item.memberId" class="club-item">
              <div class="club-main">
                <div class="club-name">{{ item.clubName }}</div>
                <div class="club-info">
                  <span class="club-position">{{ item.position }}</span>
                  <span class="club-dot">·</span>
                  <span class="club-time">{{ item.joinTime }} 加入</span>
                </div>
              </div>
              <div class="club-actions">
                <el-button text class="action-btn quit-btn" @click="handleQuit(item)">
                  申请退社
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- My Activities -->
      <section id="activities" ref="activitiesRef" class="settings-section">
        <div class="section-header">
          <h3 class="section-title">我的活动</h3>
          <p class="section-desc">查看你已报名和参加的活动记录</p>
        </div>
        <div class="settings-card">
          <div v-if="actLoading" class="list-loading">
            <el-skeleton :rows="3" animated />
          </div>
          <div v-else-if="actList.length === 0" class="list-empty">
            <div class="empty-text">暂无活动记录</div>
            <div class="empty-hint">去活动中心发现精彩活动</div>
          </div>
          <div v-else class="act-list">
            <div v-for="item in actList" :key="item.signupId" class="act-item">
              <div class="act-main">
                <div class="act-name">{{ item.activityName }}</div>
                <div class="act-info">
                  <span class="act-club">{{ item.clubName }}</span>
                  <span class="act-dot">·</span>
                  <span class="act-time">{{ item.activityTime }}</span>
                  <span class="act-dot">·</span>
                  <span class="act-loc">{{ item.location }}</span>
                </div>
              </div>
              <div class="act-meta">
                <StatusTag type="activity" :value="item.activityStatus || item.status" />
                <span class="act-checkin">
                  <StatusTag type="checkin" :value="item.checkinStatus || 'NOT_CHECKED'" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Security -->
      <section id="security" ref="securityRef" class="settings-section">
        <div class="section-header">
          <h3 class="section-title">账号安全</h3>
          <p class="section-desc">管理你的密码和账号安全设置</p>
        </div>
        <div class="settings-card security-card">
          <div class="security-row">
            <div class="security-info">
              <div class="security-label">登录密码</div>
              <div class="security-desc">定期更换密码可以保护你的账号安全</div>
            </div>
            <el-button text class="action-btn" @click="showPwdDialog = true">
              修改密码
            </el-button>
          </div>
        </div>
      </section>
    </main>

    <!-- 修改密码弹窗 -->
    <el-dialog
      v-model="showPwdDialog"
      title="修改密码"
      width="440px"
      :close-on-click-modal="false"
      class="pwd-dialog"
    >
      <el-form
        ref="pwdFormRef"
        :model="pwdForm"
        :rules="pwdRules"
        label-position="top"
        class="compact-form"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="pwdForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="pwdForm.newPassword"
            type="password"
            show-password
            placeholder="至少6位字符"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="pwdForm.confirmPassword"
            type="password"
            show-password
            placeholder="再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button text @click="showPwdDialog = false">取消</el-button>
          <el-button type="primary" :loading="pwdSaving" @click="changePassword">
            确认修改
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 退社弹窗 -->
    <el-dialog
      v-model="showQuitDialog"
      title="申请退社"
      width="440px"
      :close-on-click-modal="false"
      class="pwd-dialog"
    >
      <el-form label-position="top">
        <el-form-item label="退社原因">
          <el-input
            v-model="quitReason"
            type="textarea"
            :rows="4"
            placeholder="请输入退社原因..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button text @click="showQuitDialog = false">取消</el-button>
          <el-button type="primary" :loading="quitLoading" @click="confirmQuit">
            确认退社
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getProfile, updateProfile, updatePassword } from '@/api/user'
import { getMyApplications } from '@/api/application'
import { getMyClubs, quitClub } from '@/api/member'
import { getMyActivities } from '@/api/activity'
import { useUserStore } from '@/stores/user'
import StatusTag from '@/components/StatusTag.vue'

const userStore = useUserStore()
const activeSection = ref('account')
const profileSaving = ref(false)
const pwdSaving = ref(false)
const showPwdDialog = ref(false)
const showQuitDialog = ref(false)
const quitLoading = ref(false)
const quitReason = ref('')
const currentQuitClub = ref(null)

const profileFormRef = ref()
const pwdFormRef = ref()
const accountRef = ref()
const basicRef = ref()
const applicationsRef = ref()
const clubsRef = ref()
const activitiesRef = ref()
const securityRef = ref()

const menuItems = [
  { key: 'account', label: '账号资料' },
  { key: 'basic', label: '基础资料' },
  { key: 'applications', label: '我的申请' },
  { key: 'clubs', label: '我的社团' },
  { key: 'activities', label: '我的活动' },
  { key: 'security', label: '账号安全' }
]

const roleText = computed(() => {
  const map = { student: '学生', admin: '管理员', leader: '社团负责人', officer: '干事' }
  return map[userStore.userInfo?.role] || '学生'
})

const avatarText = computed(() => {
  const name = userStore.userInfo?.name || ''
  return name.slice(0, 1) || '?'
})

const avatarStyle = computed(() => {
  const gender = profileForm.gender || userStore.userInfo?.gender || 'unknown'
  const colors = {
    male: { bg: '#e8f4fd', text: '#2b6cb0' },
    female: { bg: '#fdf2f8', text: '#b83280' },
    unknown: { bg: '#f3f4f6', text: '#6b7280' }
  }
  const c = colors[gender] || colors.unknown
  return { backgroundColor: c.bg, color: c.text }
})

const profileForm = reactive({
  name: '',
  gender: 'unknown',
  college: '',
  className: '',
  phone: '',
  email: ''
})

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Applications
const appLoading = ref(false)
const appList = ref([])

// Clubs
const clubLoading = ref(false)
const clubList = ref([])

// Activities
const actLoading = ref(false)
const actList = ref([])

const validatePhone = (rule, value, callback) => {
  if (!value) return callback(new Error('请输入手机号'))
  if (!/^1[3-9]\d{9}$/.test(value)) return callback(new Error('手机号格式不正确'))
  callback()
}

const validateEmail = (rule, value, callback) => {
  if (!value) return callback(new Error('请输入邮箱'))
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return callback(new Error('邮箱格式不正确'))
  callback()
}

const validateConfirmPwd = (rule, value, callback) => {
  if (!value) return callback(new Error('请确认密码'))
  if (value !== pwdForm.newPassword) return callback(new Error('两次密码不一致'))
  callback()
}

const profileRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  college: [{ required: true, message: '请输入学院', trigger: 'blur' }],
  className: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  email: [{ validator: validateEmail, trigger: 'blur' }]
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirmPwd, trigger: 'blur' }]
}

const loadProfile = async () => {
  try {
    const res = await getProfile()
    const d = res.data || {}
    Object.assign(profileForm, {
      name: d.name || '',
      gender: d.gender || 'unknown',
      college: d.college || '',
      className: d.className || '',
      phone: d.phone || '',
      email: d.email || ''
    })
    userStore.setProfile({ ...userStore.userInfo, ...d })
  } catch (e) {
    // silent
  }
}

const saveProfile = async () => {
  const valid = await profileFormRef.value?.validate().catch(() => false)
  if (!valid) return
  profileSaving.value = true
  try {
    await updateProfile({ ...profileForm })
    userStore.setProfile({ ...userStore.userInfo, ...profileForm })
    ElMessage.success('资料已更新')
  } finally {
    profileSaving.value = false
  }
}

const changePassword = async () => {
  const valid = await pwdFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (pwdForm.newPassword === pwdForm.oldPassword) {
    ElMessage.warning('新密码不能与旧密码相同')
    return
  }
  pwdSaving.value = true
  try {
    await updatePassword({
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword
    })
    ElMessage.success('密码修改成功')
    showPwdDialog.value = false
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
  } finally {
    pwdSaving.value = false
  }
}

const loadApplications = async () => {
  appLoading.value = true
  try {
    const res = await getMyApplications({ page: 1, pageSize: 50 })
    appList.value = res.data?.list || []
  } catch (e) {
    // silent
  } finally {
    appLoading.value = false
  }
}

const loadClubs = async () => {
  clubLoading.value = true
  try {
    const res = await getMyClubs()
    clubList.value = res.data || []
  } catch (e) {
    // silent
  } finally {
    clubLoading.value = false
  }
}

const loadActivities = async () => {
  actLoading.value = true
  try {
    const res = await getMyActivities({ page: 1, pageSize: 50 })
    actList.value = res.data?.list || []
  } catch (e) {
    // silent
  } finally {
    actLoading.value = false
  }
}

const handleQuit = (item) => {
  currentQuitClub.value = item
  quitReason.value = ''
  showQuitDialog.value = true
}

const confirmQuit = async () => {
  if (!quitReason.value.trim()) {
    ElMessage.warning('请输入退社原因')
    return
  }
  quitLoading.value = true
  try {
    await quitClub(currentQuitClub.value.clubId, { quitReason: quitReason.value })
    ElMessage.success('退社申请已提交')
    showQuitDialog.value = false
    loadClubs()
  } catch (e) {
    // silent
  } finally {
    quitLoading.value = false
  }
}

const scrollToSection = (key) => {
  activeSection.value = key
  const map = {
    account: accountRef,
    basic: basicRef,
    applications: applicationsRef,
    clubs: clubsRef,
    activities: activitiesRef,
    security: securityRef
  }
  const el = map[key]?.value
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(() => {
  loadProfile()
  loadApplications()
  loadClubs()
  loadActivities()
})
</script>

<style scoped>
.profile-page {
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px;
  gap: 48px;
  min-height: calc(100vh - 64px);
}

/* ===== 左侧导航 ===== */
.settings-nav {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  align-self: flex-start;
}

.nav-header {
  margin-bottom: 16px;
}

.nav-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  user-select: none;
}

.nav-item:hover {
  color: #374151;
  background: #f9fafb;
}

.nav-item.active {
  color: #2563eb;
  background: #eff6ff;
  font-weight: 500;
}

/* ===== 右侧内容 ===== */
.settings-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.settings-section {
  scroll-margin-top: 24px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.section-desc {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

/* ===== 卡片 ===== */
.settings-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

/* ===== 头像区 ===== */
.profile-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  flex-shrink: 0;
}

.avatar-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.avatar-role {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 2px;
}

/* ===== 只读信息 ===== */
.profile-readonly {
  padding-top: 4px;
}

.readonly-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.readonly-label {
  font-size: 13px;
  color: #6b7280;
  width: 60px;
  flex-shrink: 0;
}

.readonly-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* ===== 表单 ===== */
.compact-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.compact-form :deep(.el-form-item__label) {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  padding-bottom: 6px;
  line-height: 1.4;
}

.compact-form :deep(.el-input__wrapper),
.compact-form :deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px #d1d5db inset;
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
}

.compact-form :deep(.el-input__wrapper:hover),
.compact-form :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #9ca3af inset;
}

.compact-form :deep(.el-input__wrapper.is-focus),
.compact-form :deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #2563eb inset;
}

.compact-form :deep(.el-input__inner) {
  font-size: 14px;
  color: #111827;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-col {
  flex: 1;
  min-width: 0;
}

/* ===== 卡片底部 ===== */
.card-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

.save-btn {
  height: 36px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* ===== 列表通用 ===== */
.list-loading {
  padding: 8px 0;
}

.list-empty {
  text-align: center;
  padding: 40px 0;
}

.empty-text {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 13px;
  color: #9ca3af;
}

/* ===== 申请列表 ===== */
.app-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-item {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  background: #fafafa;
}

.app-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.app-club {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.app-reason {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.app-time {
  font-size: 12px;
  color: #9ca3af;
}

.app-review {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
  font-size: 12px;
  color: #6b7280;
}

.review-label {
  color: #9ca3af;
  margin-right: 4px;
}

.review-time {
  margin-right: 12px;
}

.review-comment {
  color: #2563eb;
}

/* ===== 社团列表 ===== */
.club-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.club-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  background: #fafafa;
}

.club-main {
  min-width: 0;
}

.club-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.club-info {
  font-size: 13px;
  color: #6b7280;
}

.club-position {
  font-weight: 500;
  color: #374151;
}

.club-dot {
  margin: 0 6px;
  color: #d1d5db;
}

.club-time {
  color: #9ca3af;
}

.club-actions {
  flex-shrink: 0;
}

.quit-btn {
  color: #dc2626;
}

.quit-btn:hover {
  color: #b91c1c;
  background: #fef2f2;
}

/* ===== 活动列表 ===== */
.act-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.act-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  background: #fafafa;
}

.act-main {
  min-width: 0;
}

.act-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.act-info {
  font-size: 13px;
  color: #6b7280;
}

.act-club {
  font-weight: 500;
  color: #374151;
}

.act-dot {
  margin: 0 6px;
  color: #d1d5db;
}

.act-time {
  color: #9ca3af;
}

.act-loc {
  color: #9ca3af;
}

.act-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.act-checkin {
  margin-left: 4px;
}

/* ===== 安全区 ===== */
.security-card {
  padding: 20px 24px;
}

.security-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.security-label {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.security-desc {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 2px;
}

.action-btn {
  color: #2563eb;
  font-weight: 500;
  font-size: 14px;
}

/* ===== 弹窗 ===== */
.pwd-dialog :deep(.el-dialog__header) {
  padding: 20px 24px 0;
  margin-bottom: 16px;
}

.pwd-dialog :deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.pwd-dialog :deep(.el-dialog__body) {
  padding: 0 24px;
}

.pwd-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .profile-page {
    flex-direction: column;
    gap: 24px;
    padding: 16px;
  }

  .settings-nav {
    width: 100%;
    position: static;
  }

  .nav-menu {
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
  }

  .nav-item {
    padding: 6px 14px;
    white-space: nowrap;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .settings-card {
    padding: 16px;
  }

  .app-main,
  .act-item {
    flex-direction: column;
    gap: 8px;
  }

  .app-meta,
  .act-meta {
    align-self: flex-start;
  }
}
</style>
