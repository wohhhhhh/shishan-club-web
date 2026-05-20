import request from '@/utils/request'

export function getMemberList(clubId, params) {
  return request.get(`/club/${clubId}/members`, { params })
}

export function updateMemberPosition(memberId, data) {
  return request.put(`/member/${memberId}/position`, data)
}

export function updateMemberStatus(memberId, data) {
  return request.put(`/member/${memberId}/status`, data)
}

export function getMyClubs() {
  return request.get('/my/clubs')
}

export function quitClub(clubId, data) {
  return request.post(`/my/clubs/${clubId}/quit`, data)
}

export function getClubMembers(clubId) {
  return request.get(`/club/${clubId}/members`)
}
