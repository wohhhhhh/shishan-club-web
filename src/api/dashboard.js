import request from '@/utils/request'

export function getStudentDashboard() {
  return request.get('/dashboard/student')
}

export function getAdminDashboard() {
  return request.get('/dashboard/admin')
}
