import request from '@/utils/request'

export function getMyApplications(params) {
  return request.get('/my/applications', { params })
}

export function getAdminApplications(params) {
  return request.get('/admin/applications', { params })
}

export function reviewApplication(applicationId, data) {
  return request.post(`/application/review/${applicationId}`, data)
}

export function applyClub(data) {
  return request.post('/application/apply', data)
}

export function getQuitApplications(params) {
  return request.get('/admin/quit-applications', { params })
}

export function reviewQuitApplication(quitApplicationId, data) {
  return request.post(`/admin/quit-applications/${quitApplicationId}/review`, data)
}
