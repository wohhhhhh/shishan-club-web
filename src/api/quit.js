import request from '@/utils/request'

export function getQuitApplications(params) {
  return request.get('/admin/quit-applications', { params })
}

export function reviewQuitApplication(quitApplicationId, data) {
  return request.put(`/admin/quit-applications/${quitApplicationId}/review`, data)
}
