# OpenCalw / 其他 AI 对接速读

你正在接手的项目是「狮山社栈」，一个 Vue3 + Vite 前端项目。请先把它理解为：

> 公开社团门户 + 学生个人中心 + 管理后台

它不是纯后台管理系统。普通学生是主要用户，后台只是给有社团管理权限的人使用。

## 技术栈

- Vue 3
- Vite
- Vue Router
- Pinia
- Element Plus
- Axios
- 无 TypeScript
- 不要引入新依赖，除非用户明确要求

## 当前核心原则

1. 不要从零重构。
2. 不要把前台做成后台管理系统。
3. 页面 UI 已经大量调整过，除非用户要求，不要随便改视觉风格。
4. 业务页面应通过 `src/api/*` 调 service，不要在页面组件里直接写 mock 数据。
5. mock 和真实后端共用一套页面，通过环境变量切换。
6. 后续联调重点是让 `VITE_USE_MOCK=false` 时请求真实后端。

## 环境模式

请求入口：

```txt
src/utils/request.js
```

关键逻辑：

```js
VITE_USE_MOCK=true   -> 使用 src/mock 的 localStorage mock
VITE_USE_MOCK=false  -> 请求 VITE_API_BASE_URL 指向的真实后端
```

本地联调后端应创建 `.env.local`：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

Vercel 演示应使用：

```env
VITE_USE_MOCK=true
```

## 目录重点

```txt
src/api/                  前端接口封装，真实后端联调主要看这里
src/mock/data.js           mock 种子数据
src/mock/store.js          mock localStorage 持久化
src/mock/index.js          mock adapter 和 mock 接口处理
src/utils/request.js       axios 实例、mock/real 开关、token 注入
src/stores/user.js         登录态、用户信息、角色
src/router/index.js        路由和权限守卫
src/components/Navbar.vue  前台顶部导航和登录态显示
src/layout/AdminLayout.vue 后台侧边栏和后台布局
```

## 主要页面

前台：

```txt
src/views/landing/Home.vue          首页
src/views/portal/ClubSquare.vue     社团广场
src/views/portal/ClubDetail.vue     社团详情
src/views/portal/ActivityCenter.vue 活动中心
src/views/portal/ActivityDetail.vue 活动详情
src/views/portal/Recruit.vue        社团招新
src/views/portal/About.vue          关于我们
```

学生个人中心：

```txt
src/views/student/Profile.vue
src/views/student/MyApplications.vue
src/views/student/MyClubs.vue
src/views/student/MyActivities.vue
```

管理后台：

```txt
src/views/admin/Home.vue
src/views/admin/MyClub.vue
src/views/admin/ClubManage.vue
src/views/admin/ApplicationReview.vue
src/views/admin/MemberManage.vue
src/views/admin/ActivityManage.vue
src/views/admin/SignupManage.vue
src/views/admin/UserManage.vue
src/views/admin/QuitReview.vue
src/views/admin/AdminAssign.vue
```

Demo 页面：

```txt
src/views/demo/*
```

Demo 页面只是视觉/交互试验，不要当正式业务页面处理。

## 角色设计

角色大致如下：

- `student`：普通学生，只能用前台和个人中心。
- `club_admin` / `leader`：社团管理员，可以管理自己负责的社团。
- `super_admin`：系统管理员，可以管理所有社团和分配管理员。

路由权限主要在：

```txt
src/router/index.js
```

用户状态主要在：

```txt
src/stores/user.js
```

## 登录态

前端目前使用 localStorage：

```txt
token     -> localStorage.token
userInfo  -> localStorage.user
```

请求头自动带：

```http
Authorization: Bearer <token>
```

登录接口返回建议：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "xxx",
    "student": {
      "studentId": "20230001",
      "name": "张三",
      "role": "student"
    }
  }
}
```

## API 响应格式

前端 axios 拦截器期望：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

分页接口建议：

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

如果 `code !== 200`，前端会弹错误；如果 `code === 401`，前端会清 token 并跳登录页。

## 当前实际使用的主要接口

认证：

```txt
POST /student/login
POST /student/register
GET  /student/myinfo
```

用户：

```txt
GET /user/profile
PUT /user/profile
PUT /user/password
GET /admin/users
```

社团：

```txt
GET    /club/list
GET    /club/detail/:clubId
POST   /club/create
PUT    /club/update/:clubId
DELETE /club/delete/:clubId
GET    /admin/clubs
PUT    /admin/clubs/:clubId/admin
DELETE /admin/clubs/:clubId/admin
```

入社申请：

```txt
POST /application/apply
GET  /my/applications
GET  /admin/applications
POST /application/review/:applicationId
```

成员：

```txt
GET  /my/clubs
POST /my/clubs/:clubId/quit
GET  /club/:clubId/members
PUT  /member/:memberId/position
PUT  /member/:memberId/status
```

退社审核：

```txt
GET /admin/quit-applications
PUT /admin/quit-applications/:quitApplicationId/review
```

活动：

```txt
GET    /activity/list
GET    /activity/detail/:activityId
POST   /activity/signup
DELETE /activity/cancel/:activityId
GET    /my/activities
POST   /activity/publish
PUT    /activity/update/:activityId
DELETE /activity/delete/:activityId
GET    /admin/activities
```

报名签到：

```txt
GET /admin/activities/:activityId/signups
PUT /admin/activities/:activityId/signups/:signupId/checkin
```

仪表盘：

```txt
GET /dashboard/student
GET /dashboard/admin
```

## 需要注意的历史问题

1. `src/api/club.js` 和 `src/api/application.js` 有一些重复封装，不要贸然删除，先查调用点。
2. `src/api/activity.js` 里有旧的签到接口：

```txt
GET /activity/:activityId/signups
PUT /activity/:activityId/signups/:signupId/checkin
```

但正式页面当前使用的是：

```txt
src/api/signup.js
GET /admin/activities/:activityId/signups
PUT /admin/activities/:activityId/signups/:signupId/checkin
```

3. `src/api/application.js` 里有旧的退社审核 `POST` 版本，但页面当前使用：

```txt
src/api/quit.js
PUT /admin/quit-applications/:quitApplicationId/review
```

4. 首页 `src/views/landing/Home.vue` 目前仍有部分静态展示数据和图片；如果目标是“全部打后端”，这里需要单独改。
5. `src/views/admin/AdminAssign.vue` 已接管理员分配闭环，页面复用 `/admin/clubs`、`/admin/users`，分配动作使用 `PUT /admin/clubs/:clubId/admin`，撤销动作使用 `DELETE /admin/clubs/:clubId/admin`。
6. `src/views/demo/*` 是 demo，不要纳入正式联调。

## 字段兼容建议

项目历史里字段有过多种命名，后端或适配层最好兼容：

社团：

```txt
clubId
clubName / name
college
description
currentCount / currentMembers
maxCount / maxMembers
status / recruitStatus
statusText
leaderName
leaderPhone / contact
recruitDeadline
coverUrl
```

活动：

```txt
activityId
activityName / title / name
clubId
clubName
activityTime / startTime
endTime
location
content / description
status
currentCount / currentParticipants
maxCount / maxParticipants
signupDeadline
coverUrl
```

申请状态：

```txt
PENDING
APPROVED
REJECTED
```

活动状态：

```txt
SIGNING
ONGOING
ENDED
CANCELLED
```

签到状态：

```txt
NOT_STARTED
CHECKED_IN
ABSENT
```

成员状态：

```txt
ACTIVE
QUIT
```

## 如果你的任务是“接真实后端”

优先做这些事：

1. 确认 `.env.local` 设置 `VITE_USE_MOCK=false`。
2. 确认浏览器 Network 里请求打到了 `VITE_API_BASE_URL`。
3. 先跑通登录。
4. 再跑通社团列表、社团详情、活动列表、活动详情。
5. 再跑通申请入社、活动报名、我的申请、我的活动。
6. 最后跑通后台审核、活动管理、报名签到。
7. 如果页面没请求后端，先看它是不是静态展示页或 demo。
8. 不要在页面里硬编码后端数据，应该改 `src/api/*` 或后端返回。

## 如果你的任务是“继续开发”

改动前请先确认：

- 是否会影响登录态；
- 是否会影响 mock/real 开关；
- 是否会影响路由权限；
- 是否误改了 demo 页面；
- 是否把业务数据写死进页面组件；
- 是否改了字段名导致后端对不上。

最稳妥的做法是：页面继续调 `src/api/*`，由 service 层和后端字段做适配。
