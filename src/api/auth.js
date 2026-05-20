import request from '@/utils/request'

export function register(data) {
  return request.post('/student/register', data)
}

export function login(data) {
  return request.post('/student/login', data)
}

export function getMyInfo() {
  return request.get('/student/myinfo')
}
