<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="login-brand">
      <div class="brand-content">
        <div class="brand-logo">
          <el-icon size="48" color="#3b82f6"><School /></el-icon>
        </div>
        <h1 class="brand-title">学生社团管理系统</h1>
        <p class="brand-slogan">发现热爱 · 连接成长</p>
        <div class="brand-features">
          <div class="feature-item">
            <el-icon color="#3b82f6"><Collection /></el-icon>
            <span>120+ 入驻社团</span>
          </div>
          <div class="feature-item">
            <el-icon color="#22c55e"><Calendar /></el-icon>
            <span>300+ 校园活动</span>
          </div>
          <div class="feature-item">
            <el-icon color="#f97316"><UserFilled /></el-icon>
            <span>5000+ 学生参与</span>
          </div>
        </div>
      </div>
      <!-- 装饰色块 -->
      <div class="brand-shape shape-1"></div>
      <div class="brand-shape shape-2"></div>
      <div class="brand-shape shape-3"></div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-form-area">
      <div class="login-card">
        <div class="form-header">
          <h2 class="form-title">{{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}</h2>
          <p class="form-subtitle">{{ activeTab === 'login' ? '登录以继续探索社团精彩' : '注册开启你的社团之旅' }}</p>
        </div>

        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="登录" name="login">
            <el-form ref="loginRef" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin" class="login-form">
              <el-form-item prop="studentId">
                <el-input v-model="loginForm.studentId" placeholder="请输入学号" prefix-icon="User" size="large" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" size="large" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="large" :loading="loading" class="submit-btn" @click="handleLogin">
                  <el-icon><Right /></el-icon>
                  登 录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="注册" name="register">
            <el-form ref="registerRef" :model="registerForm" :rules="registerRules" @keyup.enter="handleRegister" class="login-form">
              <el-form-item prop="studentId">
                <el-input v-model="registerForm.studentId" placeholder="请输入13位学号" prefix-icon="User" size="large" maxlength="13" />
              </el-form-item>
              <el-form-item prop="name">
                <el-input v-model="registerForm.name" placeholder="请输入名称（用户名）" prefix-icon="UserFilled" size="large" />
              </el-form-item>
              <el-form-item prop="college">
                <el-select-v2
                  v-model="registerForm.college"
                  :options="collegeOptions"
                  placeholder="请选择或搜索学院"
                  prefix-icon="School"
                  size="large"
                  filterable
                  clearable
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item prop="phone">
                <el-input v-model="registerForm.phone" placeholder="请输入手机号" prefix-icon="Phone" size="large" maxlength="11" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（8-20位，含字母和数字）" prefix-icon="Lock" size="large" show-password />
              </el-form-item>
              <el-form-item prop="confirmPassword">
                <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" prefix-icon="Lock" size="large" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="large" :loading="loading" class="submit-btn" @click="handleRegister">
                  <el-icon><Plus /></el-icon>
                  注 册
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="tips">
          <el-icon size="14" color="#909399"><InfoFilled /></el-icon>
          <span>测试账号：学生 20230001 / 123456，管理员 admin001 / 123456</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import { School, Collection, Calendar, UserFilled, Right, Plus, InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('login')
const loading = ref(false)
const loginRef = ref(null)
const registerRef = ref(null)

const collegeList = [
  '经济管理学院',
  '公共管理学院',
  '文法学院',
  '外国语学院',
  '马克思主义学院',
  '华中农业大学林肯大学联合学院',
  '植物科学技术学院',
  '动物科学技术学院/动物医学院',
  '资源与环境学院',
  '园艺林学学院',
  '水产学院',
  '食品科学技术学院',
  '生物医学与健康学院'
]

const collegeOptions = collegeList.map(name => ({ label: name, value: name }))

// 校验规则
const validateStudentId = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入学号'))
  } else if (!/^\d{13}$/.test(value)) {
    callback(new Error('学号必须为13位数字'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 8 || value.length > 20) {
    callback(new Error('密码长度需在8-20位之间'))
  } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(value)) {
    callback(new Error('密码必须同时包含字母和数字'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的11位手机号'))
  } else {
    callback()
  }
}

const loginForm = reactive({ studentId: '', password: '' })
const loginRules = {
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const registerForm = reactive({ studentId: '', password: '', confirmPassword: '', name: '', college: '', phone: '' })
const registerRules = {
  studentId: [{ validator: validateStudentId, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }, { min: 2, max: 20, message: '名称长度在2-20个字符之间', trigger: 'blur' }],
  college: [{ required: true, message: '请选择学院', trigger: 'change' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await loginRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const res = await login(loginForm)
    userStore.setLogin(res.data)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (e) {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  const valid = await registerRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const { confirmPassword, ...submitData } = registerForm
    await register(submitData)
    ElMessage.success('注册成功，请登录')
    activeTab.value = 'login'
    loginForm.studentId = registerForm.studentId
    loginForm.password = registerForm.password
  } catch (e) {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 左侧品牌区 */
.login-brand {
  flex: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  padding: 40px;
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.15);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  backdrop-filter: blur(10px);
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.brand-slogan {
  font-size: 16px;
  opacity: 0.85;
  margin-bottom: 48px;
  letter-spacing: 2px;
}

.brand-features {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  background: rgba(255,255,255,0.1);
  padding: 10px 20px;
  border-radius: 100px;
  backdrop-filter: blur(10px);
}

/* 装饰色块 */
.brand-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}

.shape-1 {
  width: 300px; height: 300px;
  background: #60a5fa;
  top: -50px; left: -50px;
}

.shape-2 {
  width: 250px; height: 250px;
  background: #34d399;
  bottom: 10%; right: -30px;
}

.shape-3 {
  width: 200px; height: 200px;
  background: #fb923c;
  bottom: -30px; left: 30%;
}

/* 右侧登录区 */
.login-form-area {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 28px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
}

/* 标签页样式 */
.login-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background: #e2e8f0;
}

.login-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
}

.login-tabs :deep(.el-tabs__item.is-active) {
  color: #3b82f6;
  font-weight: 600;
}

.login-tabs :deep(.el-tabs__active-bar) {
  background: #3b82f6;
  height: 3px;
  border-radius: 3px;
}

/* 表单样式 */
.login-form :deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  padding: 4px 12px;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

.login-form :deep(.el-input__inner) {
  font-size: 14px;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  background: #3b82f6;
  border: none;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

/* 提示信息 */
.tips {
  margin-top: 20px;
  padding: 12px 16px;
  background: #f1f5f9;
  border-radius: 10px;
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式 */
@media (max-width: 900px) {
  .login-brand {
    display: none;
  }
  .login-form-area {
    width: 100%;
    padding: 24px;
  }
}
</style>
