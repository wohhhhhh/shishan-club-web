import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const role = computed(() => userInfo.value?.role || '')
  const isAdmin = computed(() => role.value === 'admin')
  const canManage = computed(() => ['admin', 'super_admin', 'leader', 'club_admin', 'officer'].includes(role.value))

  function setLogin(data) {
    token.value = data.token
    userInfo.value = data.student || data.user || null
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.student || data.user || null))
  }

  function setProfile(data) {
    userInfo.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, userInfo, isLoggedIn, role, isAdmin, canManage, setLogin, setProfile, logout }
})
