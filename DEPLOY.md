# 狮山社栈部署与联调说明

本项目是一套 Vue3 + Vite 前端代码，支持两种运行模式：

- 静态演示 mock 模式：不需要后端，适合 Vercel 部署和课程演示。
- 本地前后端联调 real 模式：请求后端同学本地启动的真实接口。

两种模式通过环境变量切换，不需要维护两份代码。

## 环境变量

### Mock 演示模式

用于 Vercel 或本地静态演示：

```bash
VITE_USE_MOCK=true
VITE_API_BASE_URL=
```

特点：

- 不需要启动后端。
- 登录、社团列表、活动列表、申请加入、报名活动、管理员审核、个人资料修改等流程由前端 mock 模拟。
- mock 数据会写入浏览器 `localStorage`，刷新后仍然保留本次演示数据。

### Real 联调模式

用于本地连接真实后端：

```bash
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

特点：

- 前端请求真实后端接口。
- 后端地址由 `VITE_API_BASE_URL` 控制。
- 页面组件不需要改代码。

## 本地运行

安装依赖：

```bash
npm install
```

复制环境变量示例：

```bash
copy .env.mock.example .env.local
```

或联调后端时：

```bash
copy .env.local.example .env.local
```

启动开发服务：

```bash
npm run dev
```

构建生产包：

```bash
npm run build
```

预览生产包：

```bash
npm run preview
```

当前 Vite 版本要求 Node.js `>=20.19.0`。如果本机 Node 版本过低，请升级 Node 或在部署平台选择 Node 22+。

## GitHub 部署准备

首次提交代码：

```bash
git init
git add .
git commit -m "init project"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

后续提交：

```bash
git add .
git commit -m "update project"
git push
```

## Vercel 部署

在 Vercel 导入 GitHub 仓库后，确认配置：

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

在 Vercel 的 Environment Variables 中添加：

```text
VITE_USE_MOCK=true
VITE_API_BASE_URL=
```

如果 Vercel 提示 Node 版本问题，在项目设置中选择 Node 22.x 或更高兼容版本。

## 子路由刷新 404

项目使用 Vue Router `createWebHistory()`，Vercel 静态部署需要 rewrite。

项目根目录已提供 `vercel.json`：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

这样刷新 `/clubs`、`/activities/A002`、`/admin/home` 等子路由时不会 404。

## 验证路径

部署完成后建议检查：

```text
/
/clubs
/clubs/C001
/activities
/activities/A002
/recruit
/about
/login
/profile
/admin/home
```

建议测试账号：

```text
学生账号：20230001 / 123456
社团管理员：clubadmin001 / 123456
系统管理员：admin001 / 123456
```

## 后端联调说明

前端页面统一通过 `src/api/*` 调用接口。

请求层在 `src/utils/request.js` 中根据环境变量切换：

- `VITE_USE_MOCK=true`：使用 `src/mock/index.js` 的 mock adapter。
- `VITE_USE_MOCK=false`：使用 axios 请求 `VITE_API_BASE_URL`。

mock 数据集中在：

```text
src/mock/data.js
src/mock/store.js
src/mock/index.js
```

页面组件不直接 import mock 数据，也不直接判断 mock/real 模式。
