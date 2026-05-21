import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const useMock = String(import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || ''

const request = axios.create({
  baseURL: useMock ? '' : apiBaseURL,
  timeout: 10000
})

if (useMock) {
  request.defaults.adapter = (config) => import('@/mock/index').then(({ mockAdapter }) => mockAdapter(config))
}

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.msg || res.message || '请求失败')
      if (res.code === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login')
      }
      return Promise.reject(new Error(res.msg || res.message))
    }
    return res
  },
  error => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
