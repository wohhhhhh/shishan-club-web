import request from '@/utils/request'

export function getClubList(params) {
  return request.get('/club/list', { params })
}

export function getClubDetail(clubId) {
  return request.get(`/club/detail/${clubId}`)
}

export function createClub(data) {
  return request.post('/club/create', data)
}

export function updateClub(clubId, data) {
  return request.put(`/club/update/${clubId}`, data)
}

export function updateClubStatus(clubId, data) {
  return request.put(`/club/update/${clubId}`, data)
}

export function deleteClub(clubId) {
  return request.delete(`/club/delete/${clubId}`)
}

export function applyClub(data) {
  return request.post('/application/apply', data)
}

export function getMyClubs() {
  return request.get('/my/clubs')
}

export function getMyApplications(params) {
  return request.get('/my/applications', { params })
}

export function getAdminClubList(params) {
  return request.get('/admin/clubs', { params })
}

export function getAdminApplications(params) {
  return request.get('/admin/applications', { params })
}

export function reviewApplication(applicationId, data) {
  return request.post(`/application/review/${applicationId}`, data)
}
