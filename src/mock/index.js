import { users, clubs, activities, applications, members, signups, quitApplications, dashboardData, saveMockStore } from './store'

// Helpers
function toSnake(obj) { return obj }  // pass-through, frontend expects camelCase
function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel)
  if (obj && typeof obj === 'object' && obj !== null) {
    const res = {}
    for (const [k, v] of Object.entries(obj)) {
      const ck = k.replace(/_([a-z])/g, (_, m) => m.toUpperCase())
      res[ck] = toCamel(v)
    }
    return res
  }
  return obj
}

function nextNumericId(list, key, prefix = '') {
  const max = list.reduce((acc, item) => {
    const raw = String(item[key] ?? '')
    const n = Number(raw.replace(prefix, ''))
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 0)
  return max + 1
}

function formatId(prefix, value) {
  return `${prefix}${String(value).padStart(3, '0')}`
}

let nextApplicationId = nextNumericId(applications, 'applicationId', 'AP')
let nextMemberId = nextNumericId(members, 'memberId', 'M')
let nextSignupId = nextNumericId(signups, 'signupId', 'S')
let nextQuitId = nextNumericId(quitApplications, 'quitApplicationId', 'Q')
let nextClubId = nextNumericId(clubs, 'clubId', 'C')
let nextActivityId = nextNumericId(activities, 'activityId', 'A')

function paginate(list, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  return {
    total: list.length,
    page,
    pageSize,
    list: list.slice(start, start + pageSize)
  }
}

function success(data = null) {
  return { code: 200, msg: 'success', data }
}

function fail(code, msg) {
  return { code, msg, data: null }
}

const applicationStatusTextMap = {
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝'
}

const positionTextMap = {
  MEMBER: '普通成员',
  OFFICER: '干事',
  MINISTER: '部长',
  LEADER: '负责人'
}

const checkinStatusTextMap = {
  NOT_CHECKED: '未签到',
  CHECKED: '已签到',
  LEAVE: '请假'
}

function normalizeApplication(app) {
  const applyReason = app.applyReason || app.reason || ''
  return {
    ...app,
    applyReason,
    reason: applyReason,
    statusText: app.statusText || applicationStatusTextMap[app.status] || app.status
  }
}

function normalizeMember(member) {
  const club = clubs.find(c => c.clubId == member.clubId)
  return {
    ...member,
    clubName: member.clubName || club?.clubName || '',
    college: member.college || club?.college || '',
    position: ['MEMBER', 'OFFICER', 'MINISTER', 'LEADER'].includes(member.position) ? member.position : 'MEMBER',
    positionText: member.positionText || positionTextMap[member.position] || '普通成员',
    status: member.status === 'QUIT' ? 'QUIT' : 'ACTIVE',
    statusText: member.statusText || (member.status === 'QUIT' ? '退社' : '在籍')
  }
}

function isActiveMember(member) {
  return member.status === 'ACTIVE' || member.status === '在籍'
}

function restoreUserRoleIfFree(studentId) {
  const user = users[studentId]
  const stillManagesClub = clubs.some(club => club.leaderId === studentId)
  if (user && !stillManagesClub && ['leader', 'club_admin', 'officer'].includes(user.role)) {
    user.role = 'student'
  }
}

function normalizeSignup(signup) {
  const act = activities.find(a => a.activityId == signup.activityId)
  return {
    ...signup,
    clubId: signup.clubId || act?.clubId || '',
    clubName: signup.clubName || act?.clubName || '',
    activityTime: act?.activityTime || signup.activityTime || '',
    location: act?.location || signup.location || '',
    activityStatus: act?.status || signup.activityStatus || '',
    checkinStatus: signup.checkinStatus || 'NOT_CHECKED',
    checkinStatusText: signup.checkinStatusText || checkinStatusTextMap[signup.checkinStatus] || '未签到'
  }
}

function getUser(headers) {
  const token = headers?.Authorization?.replace('Bearer ', '')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return users[payload.studentId]
  } catch {
    return null
  }
}

function parseData(config) {
  let data = config.data || config.params || {}
  if (typeof config.data === 'string') {
    try { data = JSON.parse(config.data) } catch {}
  }
  return toCamel(data)
}

function handleRequest(config) {
  const { method, url, headers } = config
  const m = method.toUpperCase()
  const data = parseData(config)
  const currentUser = getUser(headers || {})
  let result = null

  // POST /student/register
  if (m === 'POST' && url === '/student/register') {
    if (users[data.studentId]) {
      result = fail(409, '学号已存在')
      return Promise.resolve({ status: 200, data: result })
    }
    users[data.studentId] = {
      studentId: data.studentId,
      name: data.name,
      college: data.college,
      phone: data.phone,
      password: data.password,
      clubCount: 0,
      status: '正常',
      role: 'student'
    }
    result = success({ msg: '注册成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // POST /student/login
  if (m === 'POST' && url === '/student/login') {
    const user = users[data.studentId]
    if (!user) { result = fail(401, '用户不存在'); return Promise.resolve({ status: 200, data: result }) }
    if (data.password !== user.password) { result = fail(401, '密码错误'); return Promise.resolve({ status: 200, data: result }) }
    const tokenStr = `mock.${btoa(JSON.stringify({ studentId: user.studentId, role: user.role }))}.sig`
    result = success({
      student: {
        studentId: user.studentId,
        name: user.name,
        gender: user.gender || 'unknown',
        college: user.college,
        className: user.className || '',
        phone: user.phone,
        email: user.email || '',
        clubCount: user.clubCount || 0,
        status: user.status || '正常',
        role: user.role
      },
      token: tokenStr
    })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /student/myinfo
  if (m === 'GET' && url === '/student/myinfo') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    result = success({
      studentId: currentUser.studentId,
      name: currentUser.name,
      role: currentUser.role
    })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /club/list
  if (m === 'GET' && url === '/club/list') {
    let list = [...clubs]
    if (data.keyword) list = list.filter(c => c.clubName?.includes(data.keyword))
    if (data.college) list = list.filter(c => c.college === data.college)
    if (data.status) list = list.filter(c => c.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /club/detail/:clubId
  const clubDetailMatch = url.match(/^\/club\/detail\/([^/]+)$/)
  if (m === 'GET' && clubDetailMatch) {
    const club = clubs.find(c => c.clubId == clubDetailMatch[1])
    if (!club) { result = fail(404, '社团不存在'); return Promise.resolve({ status: 200, data: result }) }
    result = success(club)
    return Promise.resolve({ status: 200, data: result })
  }

  // POST /club/create
  if (m === 'POST' && url === '/club/create') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    const c = {
      clubId: formatId('C', nextClubId++),
      clubName: data.clubName,
      description: data.description,
      leaderId: data.leaderId,
      leaderName: data.leaderName,
      leaderPhone: data.leaderPhone,
      college: data.college,
      currentCount: 0,
      maxCount: data.maxCount || 60,
      status: 'NORMAL',
      statusText: '正常招新',
      recruitDeadline: data.recruitDeadline || ''
    }
    clubs.push(c)
    result = success({ msg: '社团创建成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // PUT /club/update/:clubId
  const clubUpdateMatch = url.match(/^\/club\/update\/([^/]+)$/)
  if (m === 'PUT' && clubUpdateMatch) {
    const club = clubs.find(c => c.clubId == clubUpdateMatch[1])
    if (!club) { result = fail(404, '社团不存在'); return Promise.resolve({ status: 200, data: result }) }
    Object.assign(club, data)
    result = success({ msg: '社团信息修改成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // DELETE /club/delete/:clubId
  const clubDeleteMatch = url.match(/^\/club\/delete\/([^/]+)$/)
  if (m === 'DELETE' && clubDeleteMatch) {
    const idx = clubs.findIndex(c => c.clubId == clubDeleteMatch[1])
    if (idx === -1) { result = fail(404, '社团不存在'); return Promise.resolve({ status: 200, data: result }) }
    clubs.splice(idx, 1)
    result = success({ msg: '社团已删除' })
    return Promise.resolve({ status: 200, data: result })
  }

  // POST /application/apply
  if (m === 'POST' && url === '/application/apply') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    const existing = applications.find(a => a.clubId == data.clubId && a.studentId === currentUser.studentId && a.status === 'PENDING')
    if (existing) { result = fail(400, '已提交过申请'); return Promise.resolve({ status: 200, data: result }) }
    const app = {
      applicationId: formatId('AP', nextApplicationId++),
      clubId: data.clubId,
      clubName: clubs.find(c => c.clubId == data.clubId)?.clubName || '',
      studentId: currentUser.studentId,
      studentName: currentUser.name,
      applyReason: data.reason || data.applyReason || '',
      reason: data.reason || '',
      applyTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'PENDING',
      statusText: '待审核',
      reviewerId: null,
      comment: null
    }
    applications.push(app)
    result = success({ msg: '申请提交成功，请等待审核' })
    return Promise.resolve({ status: 200, data: result })
  }

  // POST /application/review/:applicationId
  const reviewMatch = url.match(/^\/application\/review\/([^/]+)$/)
  if (m === 'POST' && reviewMatch) {
    const app = applications.find(a => a.applicationId == reviewMatch[1])
    if (!app) { result = fail(404, '申请不存在'); return Promise.resolve({ status: 200, data: result }) }
    app.status = data.status
    app.reviewerId = data.reviewerId
    app.comment = data.comment || ''
    if (data.status === 'APPROVED') {
      const user = users[app.studentId]
      const club = clubs.find(c => c.clubId == app.clubId)
      if (user && club) {
        const m2 = {
          memberId: formatId('M', nextMemberId++),
          clubId: app.clubId,
          clubName: app.clubName,
          studentId: app.studentId,
          studentName: app.studentName,
          college: user.college,
          phone: user.phone,
          joinTime: new Date().toISOString().substring(0, 10),
          position: 'MEMBER',
          positionText: '普通成员',
          status: 'ACTIVE',
          statusText: '在籍'
        }
        members.push(normalizeMember(m2))
        club.currentCount++
        user.clubCount = (user.clubCount || 0) + 1
      }
    }
    result = success({ msg: '审核处理成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /my/applications
  if (m === 'GET' && url === '/my/applications') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    let list = applications
      .filter(a => a.studentId === currentUser.studentId)
      .map(normalizeApplication)
    if (data.status) list = list.filter(a => a.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /my/clubs
  if (m === 'GET' && url === '/my/clubs') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    const list = members
      .filter(m2 => m2.studentId === currentUser.studentId && isActiveMember(m2))
      .map(normalizeMember)
    result = success(list)
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /activity/list
  if (m === 'GET' && url === '/activity/list') {
    let list = [...activities]
    if (data.keyword) list = list.filter(a => a.activityName?.includes(data.keyword))
    if (data.clubId) list = list.filter(a => a.clubId == data.clubId)
    if (data.status) list = list.filter(a => a.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /activity/detail/:activityId
  const actDetailMatch = url.match(/^\/activity\/detail\/([^/]+)$/)
  if (m === 'GET' && actDetailMatch) {
    const act = activities.find(a => a.activityId == actDetailMatch[1])
    if (!act) { result = fail(404, '活动不存在'); return Promise.resolve({ status: 200, data: result }) }
    result = success(act)
    return Promise.resolve({ status: 200, data: result })
  }

  // POST /activity/signup
  if (m === 'POST' && url === '/activity/signup') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    const act = activities.find(a => a.activityId == data.activityId)
    if (!act) { result = fail(404, '活动不存在'); return Promise.resolve({ status: 200, data: result }) }
    const existing = signups.find(s => s.activityId == data.activityId && s.studentId === currentUser.studentId)
    if (existing) { result = fail(400, '已报名'); return Promise.resolve({ status: 200, data: result }) }
    if (act.currentCount >= act.maxCount) { result = fail(400, '报名人数已满'); return Promise.resolve({ status: 200, data: result }) }
    const s = {
      signupId: formatId('S', nextSignupId++),
      activityId: data.activityId,
      activityName: act.activityName,
      studentId: currentUser.studentId,
      studentName: currentUser.name,
      college: currentUser.college,
      phone: currentUser.phone,
      signupTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: '已报名',
      checkinStatus: 'NOT_CHECKED'
    }
    signups.push(s)
    act.currentCount++
    result = success({ msg: '报名成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // DELETE /activity/cancel/:activityId
  const cancelMatch = url.match(/^\/activity\/cancel\/([^/]+)$/)
  if (m === 'DELETE' && cancelMatch) {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    const activityId = cancelMatch[1]
    const idx = signups.findIndex(s => s.activityId == activityId && s.studentId === currentUser.studentId)
    if (idx === -1) { result = fail(400, '未报名'); return Promise.resolve({ status: 200, data: result }) }
    signups.splice(idx, 1)
    const act = activities.find(a => a.activityId == activityId)
    if (act) act.currentCount = Math.max(0, act.currentCount - 1)
    result = success({ msg: '取消报名成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /my/activities
  if (m === 'GET' && url === '/my/activities') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    let list = signups
      .filter(s => s.studentId === currentUser.studentId)
      .map(normalizeSignup)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // POST /activity/publish
  if (m === 'POST' && url === '/activity/publish') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    const a = {
      activityId: formatId('A', nextActivityId++),
      activityName: data.activityName,
      clubId: data.clubId,
      content: data.content,
      activityTime: data.activityTime,
      location: data.location,
      maxCount: data.maxCount || 50,
      currentCount: 0,
      status: 'SIGNING',
      signupDeadline: data.signupDeadline || '',
      createTime: new Date().toISOString()
    }
    const club = clubs.find(c => c.clubId == data.clubId)
    a.clubName = club?.clubName || ''
    activities.push(a)
    result = success({ msg: '活动发布成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // PUT /activity/update/:activityId
  const actUpdateMatch = url.match(/^\/activity\/update\/([^/]+)$/)
  if (m === 'PUT' && actUpdateMatch) {
    const act = activities.find(a => a.activityId == actUpdateMatch[1])
    if (!act) { result = fail(404, '活动不存在'); return Promise.resolve({ status: 200, data: result }) }
    Object.assign(act, data)
    result = success({ msg: '活动信息修改成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // DELETE /activity/delete/:activityId
  const actDeleteMatch = url.match(/^\/activity\/delete\/([^/]+)$/)
  if (m === 'DELETE' && actDeleteMatch) {
    const idx = activities.findIndex(a => a.activityId == actDeleteMatch[1])
    if (idx === -1) { result = fail(404, '活动不存在'); return Promise.resolve({ status: 200, data: result }) }
    activities.splice(idx, 1)
    result = success({ msg: '活动已删除' })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /club/:clubId/members
  const memberListMatch = url.match(/^\/club\/([^/]+)\/members$/)
  if (m === 'GET' && memberListMatch) {
    let list = members.filter(m2 => m2.clubId == memberListMatch[1])
    if (data.keyword) list = list.filter(m2 => m2.studentName?.includes(data.keyword) || m2.studentId?.includes(data.keyword))
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // PUT /member/:memberId/position
  const posMatch = url.match(/^\/member\/([^/]+)\/position$/)
  if (m === 'PUT' && posMatch) {
    const member = members.find(m2 => m2.memberId == posMatch[1])
    if (!member) { result = fail(404, '成员不存在'); return Promise.resolve({ status: 200, data: result }) }
    member.position = data.position
    result = success({ msg: '成员职务调整成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // PUT /member/:memberId/status
  const memberStatusMatch = url.match(/^\/member\/([^/]+)\/status$/)
  if (m === 'PUT' && memberStatusMatch) {
    const member = members.find(m2 => m2.memberId == memberStatusMatch[1])
    if (!member) { result = fail(404, '成员不存在'); return Promise.resolve({ status: 200, data: result }) }
    member.status = data.status
    if (data.status === '退社') {
      const club = clubs.find(c => c.clubId == member.clubId)
      if (club) club.currentCount = Math.max(0, club.currentCount - 1)
      const user = users[member.studentId]
      if (user) user.clubCount = Math.max(0, (user.clubCount || 0) - 1)
    }
    result = success({ msg: '成员状态修改成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /admin/clubs
  if (m === 'GET' && url === '/admin/clubs') {
    let list = [...clubs]
    if (data.keyword) list = list.filter(c => c.clubName?.includes(data.keyword))
    if (data.college) list = list.filter(c => c.college === data.college)
    if (data.status) list = list.filter(c => c.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // PUT /admin/clubs/:clubId/admin
  const clubAdminAssignMatch = url.match(/^\/admin\/clubs\/([^/]+)\/admin$/)
  if (m === 'PUT' && clubAdminAssignMatch) {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    if (!['admin', 'super_admin'].includes(currentUser.role)) {
      result = fail(403, '仅系统管理员可分配社团管理员')
      return Promise.resolve({ status: 200, data: result })
    }

    const club = clubs.find(item => item.clubId == clubAdminAssignMatch[1])
    const nextAdmin = users[data.studentId]
    if (!club) { result = fail(404, '社团不存在'); return Promise.resolve({ status: 200, data: result }) }
    if (!nextAdmin) { result = fail(404, '学生账号不存在'); return Promise.resolve({ status: 200, data: result }) }
    if (nextAdmin.status === '禁用') { result = fail(400, '禁用账号不能分配为管理员'); return Promise.resolve({ status: 200, data: result }) }
    if (['admin', 'super_admin'].includes(nextAdmin.role)) {
      result = fail(400, '系统管理员无需重复分配为社团管理员')
      return Promise.resolve({ status: 200, data: result })
    }

    const previousLeaderId = club.leaderId
    Object.assign(club, {
      leaderId: nextAdmin.studentId,
      leaderName: nextAdmin.name,
      leaderPhone: nextAdmin.phone || ''
    })
    if (nextAdmin.role === 'student') {
      nextAdmin.role = 'club_admin'
    }

    const previousMember = members.find(member => member.clubId == club.clubId && member.studentId === previousLeaderId)
    if (previousMember?.position === 'LEADER') {
      previousMember.position = 'MEMBER'
      previousMember.positionText = positionTextMap.MEMBER
    }
    const nextMember = members.find(member => member.clubId == club.clubId && member.studentId === nextAdmin.studentId)
    if (nextMember && isActiveMember(nextMember)) {
      nextMember.position = 'LEADER'
      nextMember.positionText = positionTextMap.LEADER
    }
    if (previousLeaderId && previousLeaderId !== nextAdmin.studentId) {
      restoreUserRoleIfFree(previousLeaderId)
    }

    result = success(club)
    return Promise.resolve({ status: 200, data: result })
  }

  // DELETE /admin/clubs/:clubId/admin
  if (m === 'DELETE' && clubAdminAssignMatch) {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    if (!['admin', 'super_admin'].includes(currentUser.role)) {
      result = fail(403, '仅系统管理员可撤销社团管理员')
      return Promise.resolve({ status: 200, data: result })
    }

    const club = clubs.find(item => item.clubId == clubAdminAssignMatch[1])
    if (!club) { result = fail(404, '社团不存在'); return Promise.resolve({ status: 200, data: result }) }

    const previousLeaderId = club.leaderId
    const previousMember = members.find(member => member.clubId == club.clubId && member.studentId === previousLeaderId)
    if (previousMember?.position === 'LEADER') {
      previousMember.position = 'MEMBER'
      previousMember.positionText = positionTextMap.MEMBER
    }
    Object.assign(club, {
      leaderId: '',
      leaderName: '',
      leaderPhone: ''
    })
    if (previousLeaderId) {
      restoreUserRoleIfFree(previousLeaderId)
    }

    result = success(club)
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /admin/users
  if (m === 'GET' && url === '/admin/users') {
    let list = Object.values(users).map(user => ({
      studentId: user.studentId,
      name: user.name,
      gender: user.gender,
      college: user.college,
      className: user.className || '',
      phone: user.phone || '',
      email: user.email || '',
      clubCount: user.clubCount || 0,
      status: user.status === '禁用' ? '禁用' : '正常',
      role: user.role || 'student'
    }))
    if (data.keyword) {
      list = list.filter(user => user.name?.includes(data.keyword) || user.studentId?.includes(data.keyword))
    }
    if (data.role) list = list.filter(user => user.role === data.role)
    if (data.status) list = list.filter(user => user.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /admin/applications
  if (m === 'GET' && url === '/admin/applications') {
    let list = [...applications]
    if (data.clubId) list = list.filter(a => a.clubId == data.clubId)
    if (data.status) list = list.filter(a => a.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /admin/activities
  if (m === 'GET' && url === '/admin/activities') {
    let list = [...activities]
    if (data.keyword) list = list.filter(a => a.activityName?.includes(data.keyword))
    if (data.clubId) list = list.filter(a => a.clubId == data.clubId)
    if (data.status) list = list.filter(a => a.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /admin/quit-applications
  if (m === 'GET' && url === '/admin/quit-applications') {
    let list = [...quitApplications]
    if (data.clubId) list = list.filter(q => q.clubId == data.clubId)
    if (data.status) list = list.filter(q => q.status === data.status)
    result = success(paginate(list, data.page, data.pageSize))
    return Promise.resolve({ status: 200, data: result })
  }

  // POST /admin/quit-applications/:quitApplicationId/review
  const quitReviewMatch = url.match(/^\/admin\/quit-applications\/([^/]+)\/review$/)
  if (m === 'POST' && quitReviewMatch) {
    const qa = quitApplications.find(q => q.quitApplicationId == quitReviewMatch[1])
    if (!qa) { result = fail(404, '退社申请不存在'); return Promise.resolve({ status: 200, data: result }) }
    qa.status = data.result
    if (data.result === 'APPROVED') {
      const member = members.find(m2 => m2.memberId === qa.memberId)
      if (member) {
        member.status = '退社'
        const club = clubs.find(c => c.clubId == member.clubId)
        if (club) club.currentCount = Math.max(0, club.currentCount - 1)
        const user = users[member.studentId]
        if (user) user.clubCount = Math.max(0, (user.clubCount || 0) - 1)
      }
    }
    result = success({ msg: '退社审核成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /dashboard/student
  if (m === 'GET' && url === '/dashboard/student') {
    result = success(dashboardData.student)
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /user/profile
  if (m === 'GET' && url === '/user/profile') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    result = success({
      studentId: currentUser.studentId,
      name: currentUser.name,
      gender: currentUser.gender || 'unknown',
      college: currentUser.college,
      className: currentUser.className || '',
      phone: currentUser.phone,
      email: currentUser.email || '',
      clubCount: currentUser.clubCount || 0,
      status: currentUser.status || '正常',
      role: currentUser.role || 'student'
    })
    return Promise.resolve({ status: 200, data: result })
  }

  // PUT /user/profile
  if (m === 'PUT' && url === '/user/profile') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    if (data.name !== undefined) currentUser.name = data.name
    if (data.gender !== undefined) currentUser.gender = data.gender
    if (data.college !== undefined) currentUser.college = data.college
    if (data.className !== undefined) currentUser.className = data.className
    if (data.phone !== undefined) currentUser.phone = data.phone
    if (data.email !== undefined) currentUser.email = data.email
    result = success({
      studentId: currentUser.studentId,
      name: currentUser.name,
      gender: currentUser.gender,
      college: currentUser.college,
      className: currentUser.className,
      phone: currentUser.phone,
      email: currentUser.email
    })
    return Promise.resolve({ status: 200, data: result })
  }

  // PUT /user/password
  if (m === 'PUT' && url === '/user/password') {
    if (!currentUser) { result = fail(401, '未登录'); return Promise.resolve({ status: 200, data: result }) }
    if (!data.oldPassword) { result = fail(400, '请输入旧密码'); return Promise.resolve({ status: 200, data: result }) }
    if (data.oldPassword !== currentUser.password) { result = fail(400, '旧密码错误'); return Promise.resolve({ status: 200, data: result }) }
    if (!data.newPassword || data.newPassword.length < 6) { result = fail(400, '新密码至少6位'); return Promise.resolve({ status: 200, data: result }) }
    if (data.newPassword === data.oldPassword) { result = fail(400, '新密码不能与旧密码相同'); return Promise.resolve({ status: 200, data: result }) }
    currentUser.password = data.newPassword
    result = success({ msg: '密码修改成功' })
    return Promise.resolve({ status: 200, data: result })
  }

  // GET /dashboard/admin
  if (m === 'GET' && url === '/dashboard/admin') {
    result = success(dashboardData.admin)
    return Promise.resolve({ status: 200, data: result })
  }

  // Fallback
  result = fail(404, `接口不存在: ${m} ${url}`)
  return Promise.resolve({ status: 200, data: result })
}

// Build mock adapter
const mockAdapter = (config) => {
  return handleRequest(config).then(response => {
    if ((config.method || 'GET').toUpperCase() !== 'GET' && response.data?.code === 200) {
      saveMockStore()
    }
    return new Promise((resolve) => {
      resolve({
        data: response.data,
        status: response.status || 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config
      })
    })
  })
}

export { mockAdapter }
