# 狮山社栈前后端联调说明

本文档给 OpenCalw / 后端联调同学阅读。目标是让同一套 Vue3 + Vite 前端既能在 Vercel 上用 mock 数据静态演示，也能在本地切换到真实后端接口联调。

## 项目定位

「狮山社栈」不是纯后台系统，而是一个校园社团平台：

- 公开前台：学生浏览社团、活动、招新信息。
- 学生个人中心：查看我的申请、我的社团、我的活动，维护个人资料。
- 管理后台：社团管理员管理自己负责的社团、申请、成员、活动、报名签到；系统管理员管理全部社团、用户和管理员分配。

## 环境切换

前端请求入口在 `src/utils/request.js`。

```js
const useMock = String(import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || ''
```

默认是 mock 模式。如果要打真实后端，本地需要创建 `.env.local`：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

然后重启：

```bash
npm run dev
```

Vercel 静态演示使用：

```env
VITE_USE_MOCK=true
```

## 统一响应格式

前端 axios 响应拦截器期望后端统一返回：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

失败时：

```json
{
  "code": 400,
  "msg": "错误原因",
  "data": null
}
```

前端判断规则：

- `code === 200`：成功，页面继续读取 `res.data`。
- `code !== 200`：弹出 `msg` 或 `message`。
- `code === 401`：前端会清空本地登录态并跳转登录页。

分页接口建议返回：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 12,
    "page": 1,
    "pageSize": 10,
    "list": []
  }
}
```

注意：有些页面传参里可能使用 `page_size`，也有页面使用 `pageSize`。后端最好同时兼容这两个字段。

## 认证方式

登录成功后前端会把 token 存在 `localStorage.token`，用户信息存在 `localStorage.user`。

后续请求会自动携带：

```http
Authorization: Bearer <token>
```

登录接口需要返回：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "your-token",
    "student": {
      "studentId": "20230001",
      "name": "张三",
      "role": "student",
      "college": "信息工程学院",
      "phone": "13800000000",
      "email": "zhangsan@example.com",
      "clubCount": 1,
      "status": "正常"
    }
  }
}
```

角色字段建议兼容：

- 普通学生：`student`
- 社团管理员：`club_admin` 或 `leader`
- 系统管理员：`super_admin`
- 旧代码也兼容：`admin`、`officer`

## 前端实际调用的接口

以下列表以当前页面实际 import 的 `src/api/*` 为准。

### 登录与用户

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| POST | `/student/login` | 登录 |
| POST | `/student/register` | 注册普通学生 |
| GET | `/student/myinfo` | 当前用户基础信息，当前页面较少使用 |
| GET | `/user/profile` | 个人中心资料 |
| PUT | `/user/profile` | 修改个人资料 |
| PUT | `/user/password` | 修改密码 |
| GET | `/admin/users` | 后台用户管理列表 |

`/admin/users` 支持参数：

- `keyword`
- `role`
- `status`
- `page`
- `pageSize`

### 社团

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/club/list` | 前台社团广场、招新页、首页社团数据 |
| GET | `/club/detail/:clubId` | 社团详情 |
| POST | `/club/create` | 后台创建社团 |
| PUT | `/club/update/:clubId` | 后台编辑社团 |
| DELETE | `/club/delete/:clubId` | 后台删除社团 |
| GET | `/admin/clubs` | 后台社团列表、我的社团、下拉选项 |
| PUT | `/admin/clubs/:clubId/admin` | 系统管理员分配或更换社团管理员 |
| DELETE | `/admin/clubs/:clubId/admin` | 系统管理员撤销社团管理员 |

`/club/list` 和 `/admin/clubs` 常用参数：

- `keyword`
- `college`
- `status`
- `page`
- `pageSize` 或 `page_size`

社团对象建议字段：

```json
{
  "clubId": "C001",
  "clubName": "读书社",
  "name": "读书社",
  "category": "文化",
  "college": "文学院",
  "description": "社团简介",
  "tags": ["阅读", "分享"],
  "currentCount": 30,
  "currentMembers": 30,
  "maxCount": 50,
  "maxMembers": 50,
  "status": "NORMAL",
  "recruitStatus": "NORMAL",
  "statusText": "正常招新",
  "leaderName": "王五",
  "leaderPhone": "13800000000",
  "contact": "13800000000",
  "recruitDeadline": "2026-07-15",
  "coverUrl": "/mock-images/clubs/reading.jpg"
}
```

说明：前端历史字段里同时存在 `currentCount/maxCount` 和 `currentMembers/maxMembers`，后端最好优先返回 `currentCount/maxCount`，也可以同时返回兼容字段。

管理员分配页面复用社团 `leaderId/leaderName/leaderPhone` 和用户 `studentId/name/phone/role` 字段。分配请求：

```json
{
  "studentId": "20230001"
}
```

分配成功后建议同步该学生可进入社团后台的角色，例如 `club_admin`，并返回更新后的社团对象。撤销后该社团的 `leaderId/leaderName/leaderPhone` 可返回空值；如果该用户不再负责其他社团，后端可将其恢复为普通学生角色。

### 入社申请

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| POST | `/application/apply` | 学生申请加入社团 |
| GET | `/my/applications` | 我的申请 |
| GET | `/admin/applications` | 后台申请审核列表 |
| POST | `/application/review/:applicationId` | 后台审核入社申请 |

申请加入请求：

```json
{
  "clubId": "C001",
  "reason": "我喜欢阅读，希望参加社团活动"
}
```

审核请求：

```json
{
  "status": "APPROVED",
  "comment": "欢迎加入"
}
```

状态建议：

- `PENDING`
- `APPROVED`
- `REJECTED`

### 我的社团与成员管理

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/my/clubs` | 学生个人中心：我的社团 |
| POST | `/my/clubs/:clubId/quit` | 学生申请退社 |
| GET | `/club/:clubId/members` | 后台成员管理 |
| PUT | `/member/:memberId/position` | 修改成员职务 |
| PUT | `/member/:memberId/status` | 修改成员状态 |

退社申请请求：

```json
{
  "quitReason": "时间安排冲突"
}
```

成员对象建议字段：

```json
{
  "memberId": "M001",
  "clubId": "C001",
  "clubName": "读书社",
  "studentId": "20230001",
  "studentName": "张三",
  "college": "信息工程学院",
  "phone": "13800000000",
  "joinTime": "2026-03-01",
  "position": "MEMBER",
  "positionText": "普通成员",
  "status": "ACTIVE",
  "statusText": "在籍"
}
```

### 退社审核

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/admin/quit-applications` | 后台退社审核列表 |
| PUT | `/admin/quit-applications/:quitApplicationId/review` | 后台审核退社 |

注意：当前真正被页面使用的是 `src/api/quit.js`，它使用 `PUT`。`src/api/application.js` 里还有一个旧的 `POST` 版本，后端联调请以 `PUT` 为准。

审核请求：

```json
{
  "status": "APPROVED",
  "reviewComment": "已同意退社"
}
```

### 活动

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/activity/list` | 前台活动中心、社团详情页活动列表 |
| GET | `/activity/detail/:activityId` | 活动详情 |
| POST | `/activity/signup` | 报名活动 |
| DELETE | `/activity/cancel/:activityId` | 取消报名 |
| GET | `/my/activities` | 我的活动 |
| POST | `/activity/publish` | 后台创建活动 |
| PUT | `/activity/update/:activityId` | 后台编辑活动 |
| DELETE | `/activity/delete/:activityId` | 后台删除活动 |
| GET | `/admin/activities` | 后台活动管理、报名签到活动下拉 |

活动列表参数：

- `keyword`
- `clubId`
- `status`
- `page`
- `pageSize` 或 `page_size`

活动对象建议字段：

```json
{
  "activityId": "A001",
  "activityName": "读书分享会：百年孤独",
  "title": "读书分享会：百年孤独",
  "name": "读书分享会：百年孤独",
  "clubId": "C002",
  "clubName": "读书社",
  "activityTime": "2026-05-25 14:00:00",
  "startTime": "2026-05-25 14:00:00",
  "endTime": "2026-05-25 17:00:00",
  "location": "图书馆一楼报告厅",
  "content": "活动介绍",
  "description": "活动介绍",
  "status": "SIGNING",
  "currentCount": 35,
  "currentParticipants": 35,
  "maxCount": 50,
  "maxParticipants": 50,
  "signupDeadline": "2026-05-23 23:59:00",
  "coverUrl": "/mock-images/activities/reading.jpg"
}
```

说明：前端历史字段里同时出现 `activityName/title/name`、`content/description`、`currentCount/currentParticipants`、`maxCount/maxParticipants`。后端最好返回主要字段 `activityId/activityName/clubId/clubName/activityTime/location/content/status/currentCount/maxCount/coverUrl`，如方便可以同时返回兼容字段。

活动状态建议：

- `SIGNING`：报名中
- `ONGOING`：进行中
- `ENDED`：已结束
- `CANCELLED`：已取消

### 活动报名签到

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/admin/activities/:activityId/signups` | 后台报名签到列表 |
| PUT | `/admin/activities/:activityId/signups/:signupId/checkin` | 后台签到/缺席 |

注意：页面实际使用的是 `src/api/signup.js` 的这套 `/admin/activities/.../signups` 路径。`src/api/activity.js` 里还有旧的 `/activity/:activityId/signups`，目前页面没用。

签到请求：

```json
{
  "checkinStatus": "CHECKED_IN"
}
```

或：

```json
{
  "checkinStatus": "ABSENT"
}
```

签到状态建议：

- `NOT_STARTED`：未签到
- `CHECKED_IN`：已签到
- `ABSENT`：缺席

报名对象建议字段：

```json
{
  "signupId": "S001",
  "activityId": "A001",
  "activityName": "读书分享会：百年孤独",
  "studentId": "20230001",
  "studentName": "张三",
  "college": "信息工程学院",
  "phone": "13800000000",
  "signupTime": "2026-05-20 10:00:00",
  "checkinStatus": "NOT_STARTED",
  "checkinTime": null
}
```

### 仪表盘

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET | `/dashboard/student` | 学生首页数据 |
| GET | `/dashboard/admin` | 后台首页数据 |

学生端建议返回：

```json
{
  "joinedClubCount": 2,
  "availableActivityCount": 8,
  "pendingApplicationCount": 1,
  "attendedActivityCount": 3
}
```

后台建议返回：

```json
{
  "clubCount": 12,
  "studentCount": 120,
  "memberCount": 180,
  "activityCount": 20,
  "pendingApplicationCount": 5
}
```

## 当前仍是静态展示的页面

这些页面不影响核心联调，它们本来就是品牌/展示内容，当前不会请求后端：

- `src/views/landing/Home.vue`：当前首页的部分展示图片、统计数字、热门卡片仍有静态内容。
- `src/views/portal/About.vue`：关于我们。
- `src/views/portal/Showcase.vue`：社团风采。
- `src/views/portal/Features.vue`：平台功能。
- `src/views/demo/*`：全部是设计 demo。

如果要让首页也完全后端驱动，可以后续把 `src/views/landing/Home.vue` 的静态社团/活动数组改为调用 `/club/list` 和 `/activity/list`。

## 当前需要优先联通的最小闭环

建议后端优先保证以下流程可用：

1. 登录：`POST /student/login`
2. 社团列表：`GET /club/list`
3. 社团详情：`GET /club/detail/:clubId`
4. 申请入社：`POST /application/apply`
5. 我的申请：`GET /my/applications`
6. 后台审核申请：`GET /admin/applications` + `POST /application/review/:applicationId`
7. 活动列表：`GET /activity/list`
8. 活动详情：`GET /activity/detail/:activityId`
9. 活动报名：`POST /activity/signup`
10. 我的活动：`GET /my/activities`
11. 后台活动管理：`GET /admin/activities` + `POST /activity/publish` + `PUT /activity/update/:activityId` + `DELETE /activity/delete/:activityId`
12. 报名签到：`GET /admin/activities/:activityId/signups` + `PUT /admin/activities/:activityId/signups/:signupId/checkin`

这 12 个流程通了，课程演示的主线就比较完整。

## Mock 数据位置

前端 mock 数据集中在：

- `src/mock/data.js`
- `src/mock/store.js`
- `src/mock/index.js`

当 `VITE_USE_MOCK=true` 时，前端不会请求后端，而是走本地 mock adapter 和 localStorage。

当 `VITE_USE_MOCK=false` 时，前端不会加载 mock adapter，请求会发送到 `VITE_API_BASE_URL`。

## 联调检查清单

1. 前端创建 `.env.local`。
2. 设置：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

3. 后端允许前端跨域访问，例如 `http://localhost:5173`。
4. 后端统一返回 `code/msg/data`。
5. 登录接口返回 `token` 和 `student`。
6. 需要登录的接口识别 `Authorization: Bearer <token>`。
7. 分页接口返回 `total/page/pageSize/list`。
8. 状态值尽量使用本文档中的英文枚举。
9. 如果后端字段名不同，优先在后端 DTO 中兼容前端字段，减少页面改动。
