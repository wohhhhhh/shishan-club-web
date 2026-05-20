import request from '@/utils/request'

export function getSignupList(activityId, params) {
  return request.get(`/admin/activities/${activityId}/signups`, { params })
}

export function checkinSignup(activityId, signupId, data) {
  return request.put(`/admin/activities/${activityId}/signups/${signupId}/checkin`, data)
}
