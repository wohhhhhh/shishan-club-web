# 狮山社栈静态部署说明

本文档用于将当前 Vue3 / Vite 项目通过 GitHub + Vercel 部署为静态站点。

## 1. 部署前结论

- 项目框架：Vue 3 + Vite。
- Build Command：`npm run build`
- Output Directory：`dist`
- Router 模式：`createWebHistory()`。
- Vercel 需要 SPA rewrite，否则刷新 `/clubs/C001`、`/activities/A002`、`/admin/home` 等子路由会 404。
- 本项目已添加 `vercel.json`，把所有路径重写到 `/index.html`。

## 2. 本地构建检查

先确认 Node 版本。当前 Vite 版本要求 Node.js `20.19+` 或 `22.12+`。

```bash
node -v
npm install
npm run build
```

构建成功后，项目根目录会生成：

```text
dist/
```

可以本地预览生产包：

```bash
npm run preview
```

## 3. 创建 GitHub 仓库

1. 打开 GitHub。
2. 点击右上角 `+`，选择 `New repository`。
3. Repository name 可以填写：`shishan-club` 或你喜欢的名字。
4. 仓库建议先设为 `Public`，如果设为 `Private`，Vercel 也可以导入，但需要授权。
5. 不要勾选自动创建 README、.gitignore、license，避免和本地项目冲突。
6. 创建仓库后，GitHub 会显示仓库地址，例如：

```text
https://github.com/你的用户名/shishan-club.git
```

## 4. Push 代码到 GitHub

在项目根目录执行：

```bash
git init
git add .
git commit -m "initial deploy setup"
git branch -M main
git remote add origin https://github.com/你的用户名/shishan-club.git
git push -u origin main
```

如果你已经初始化过 Git，只需要：

```bash
git add .
git commit -m "deploy setup"
git push
```

## 5. 在 Vercel 导入项目

1. 打开 Vercel。
2. 使用 GitHub 登录。
3. 点击 `Add New...`，选择 `Project`。
4. 在 GitHub 仓库列表里选择你的项目。
5. 点击 `Import`。

## 6. Vercel 构建配置

Vercel 一般会自动识别 Vite 项目。请确认配置如下：

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

如果 Vercel 提示 Node 版本问题，请在 Vercel 项目设置里把 Node.js 版本切到 `22.x`，或使用支持 Vite 要求的 Node 版本。

## 7. 验证部署成功

部署完成后，Vercel 会给出一个线上地址，例如：

```text
https://你的项目名.vercel.app
```

建议验证以下路径：

```text
/
/clubs
/clubs/C001
/activities
/activities/A002
/recruit
/about
/login
```

重点检查：

- 首页能打开。
- 子路由刷新不 404。
- 静态资源能加载。
- 登录、注册、个人中心跳转正常。
- 管理后台路由在有权限账号登录后能进入。

## 8. 注意事项

- 当前项目使用 mock 数据和 axios mock adapter，适合静态预览。
- 线上没有真实后端时，数据仍来自前端 mock。
- 如果后续接入真实后端，需要把 API baseURL 改为线上后端地址，并配置跨域。
- 当前项目使用了一些外部图片地址，如 Unsplash 和 Picsum。部署后图片加载依赖这些外部服务可访问。
