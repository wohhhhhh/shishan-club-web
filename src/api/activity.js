import request from '@/utils/request'

export function getActivityList(params) {
  return request.get('/activity/list', { params })
}

export function getActivityDetail(activityId) {
  return request.get(`/activity/detail/${activityId}`)
}

export function signupActivity(data) {
  return request.post('/activity/signup', data)
}

export function cancelSignup(activityId) {
  return request.delete(`/activity/cancel/${activityId}`)
}

export function getMyActivities(params) {
  return request.get('/my/activities', { params })
}

export function publishActivity(data) {
  return request.post('/activity/publish', data)
}

export function createActivity(data) {
  return request.post('/activity/publish', data)
}

export function updateActivity(activityId, data) {
  return request.put(`/activity/update/${activityId}`, data)
}

export function updateActivityStatus(activityId, data) {
  return request.put(`/activity/update/${activityId}`, data)
}

export function deleteActivity(activityId) {
  return request.delete(`/activity/delete/${activityId}`)
}

export function getAdminActivityList(params) {
  return request.get('/admin/activities', { params })
}

export function getActivitySignups(activityId, params) {
  return request.get(`/activity/${activityId}/signups`, { params })
}

export function checkinSignup(activityId, signupId, data) {
  return request.put(`/activity/${activityId}/signups/${signupId}/checkin`, data)
}
