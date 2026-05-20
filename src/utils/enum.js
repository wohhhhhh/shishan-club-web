export const clubStatusMap = {
  NORMAL: { text: '正常招新', type: 'success' },
  PAUSED: { text: '暂停招新', type: 'warning' },
  DISSOLVED: { text: '已解散', type: 'danger' }
}

export const applicationStatusMap = {
  PENDING: { text: '待审核', type: 'warning' },
  APPROVED: { text: '已通过', type: 'success' },
  REJECTED: { text: '已拒绝', type: 'danger' }
}

export const memberStatusMap = {
  ACTIVE: { text: '在籍', type: 'success' },
  QUIT: { text: '退社', type: 'info' },
  GRADUATED: { text: '毕业', type: 'info' }
}

export const positionMap = {
  MEMBER: '普通成员',
  OFFICER: '干事',
  MINISTER: '部长',
  LEADER: '负责人'
}

export const activityStatusMap = {
  SIGNING: { text: '报名中', type: 'primary' },
  ONGOING: { text: '进行中', type: 'success' },
  ENDED: { text: '已结束', type: 'info' },
  CANCELLED: { text: '已取消', type: 'danger' }
}

export const checkinStatusMap = {
  NOT_CHECKED: { text: '未签到', type: 'warning' },
  CHECKED: { text: '已签到', type: 'success' },
  LEAVE: { text: '请假', type: 'info' }
}
