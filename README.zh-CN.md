# GUGA Reading - 在线阅读平台（前端）

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/vue-3.5+-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-7+-646cff.svg)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10+-f69220.svg)](https://pnpm.io/)
[![Vitest](https://img.shields.io/badge/vitest-4+-6b9f3a.svg)](https://vitest.dev/)

一个面向读者、作者、管理员三种角色的在线阅读平台。本仓库为 **Web 前端**：一个由三个 **Vue 3 + TypeScript** 应用（`app/*`）与一组共享 workspace 包（`packages/*`）组成的 pnpm monorepo。

> **注意**: 后端位于**独立仓库**（Ktor / Kotlin 实现）。旧版 FastAPI (Python) 后端及其配套前端已迁移至 Git 分支 `release_python_backend`，不再于本仓库维护。

中文 | [英文版](./README.md)

## 📖 项目概述

GUGA Reading 是一个现代化的在线阅读系统，提供小说/书籍的在线阅读、创作和管理功能。系统采用前后端分离架构，包含三个角色专属的 Web 客户端：

- **用户端** — 书籍浏览、搜索与阅读
- **作者端** — 书籍/章节创作与管理
- **管理端** — 平台运营、审核与数据统计

### 🌐 在线预览

- **[用户端](http://49.235.107.221)** - 读者浏览和阅读平台
- **[作者端](http://49.235.107.221/author/#)** - 作者创作和管理平台
- **[管理端](http://49.235.107.221/admin/#)** - 管理员后台管理系统
- **[安卓端](http://49.235.107.221:8000/static/guga.apk)**
- **[安卓项目地址](https://github.com/Qianrenni/guga-android)**

### ✨ 核心特性

- **🎭 多角色支持**: 用户、作者、管理员三种角色，权限与界面分离
- **📱 跨设备阅读进度**: 自动同步、断点续读
- **💬 丰富的互动功能**: 收藏、评论、点赞等社交功能
- **📝 完善的内容流程**: 从创作、草稿到审核、发布的完整闭环
- **📚 内容发现**: 分类/标签筛选、全文搜索、个性化推荐
- **⚡ 高并发设计**: 首屏加载 < 1s，支持单机上百用户同时访问
- **🧩 pnpm Monorepo**: 三端共享类型、API 封装、UI 组件与构建配置

## 🏗️ 系统架构

```
┌──────────────────────────────────────────────────────────────┐
│                  GUGA Reading（前端）                          │
│  pnpm monorepo                                               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                  │
│  │ app/user  │ │ app/author│ │ app/admin │   Vue 3 + TS     │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                  │
│        └─────────────┼─────────────┘                         │
│   packages: types · shares · ui · config · eslint            │
└───────────┬──────────────────────────────────────────────────┘
            │ HTTP（Axios，/api）
┌───────────▼──────────────────────────────────────────────────┐
│  后端 — Ktor（Kotlin）[独立仓库]                              │
│  认证 / 权限 / 书籍 / 书架 / 统计 / Outbox                    │
└───────────┬──────────────────────────────────────────────────┘
      ┌─────┴─────┐      ┌─────┴─────┐      ┌───────────────┐
      │   MySQL   │      │   Redis   │      │  File Store   │
      │  metadata │      │  cache    │      │ content/static│
      └───────────┘      └───────────┘      └───────────────┘
```

### 技术架构图说明

- **前端层**: `app/` 下三个独立的 Vue 3 应用，分别服务于不同角色；共享逻辑统一放在 `packages/`。
- **后端层**: Ktor (Kotlin) REST API 位于独立仓库，本仓库通过 `@guga-reading/shares` 的 API 层与之通信。
- **数据层**: MySQL 存储元数据，Redis 缓存加速，文件存储保存章节正文与静态资源。

## 📁 仓库结构

```
guga_reading/
├── app/                             # 三个前端应用
│   ├── user/                        # 用户端 (@guga-reading/user)
│   ├── author/                      # 作者端 (@guga-reading/author)
│   └── admin/                       # 管理端 (@guga-reading/admin)
├── packages/                        # 共享 workspace 包
│   ├── types/                       # 前后端共享 TS 类型 (@guga-reading/types)
│   ├── shares/                      # API 封装 / store / 应用装配 (@guga-reading/shares)
│   ├── ui/                          # 共享业务组件 + 全局样式 (@guga-reading/ui)
│   ├── config/                      # Vite 预设 (@guga-reading/config)
│   └── eslint/                      # ESLint 配置 (@qyani/eslint-config)
├── .husky/                          # Git Hooks（pre-commit：Prettier + ESLint）
├── .github/                         # CI 工作流
├── docker-compose.yml               # mysql + redis + 后端 + nginx 前端
├── Dockerfile
├── nginx.conf                       # 托管三端 + 反代 /api
├── package.json                     # 根目录 pnpm 配置
├── pnpm-workspace.yaml              # workspace：packages/* + app/*
└── AGENTS.md                        # 编码助手指南
```

> 各应用的 `node_modules` 为独立安装（非 workspace 符号链接），修改 `packages/*` 后需重新构建才会生效（见下文 `pnpm types`）。

## 📦 共享包

| 包                | 名称                   | 作用                                                                                                                                     |
| ----------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/types`  | `@guga-reading/types`  | 前后端共享 TypeScript 类型——字段命名的唯一来源                                                                                           |
| `packages/shares` | `@guga-reading/shares` | `useApiXxx` API 封装、`request` 拦截器、共享 store（`useAuthStore`/`useMenuStore`）、应用装配工厂 `setupGugaApp`                         |
| `packages/ui`     | `@guga-reading/ui`     | author/admin 共享业务组件（`EditableTitle`/`ContentEditor`/`HeaderNavigation`/`SiderBar`/`LoginView`，**仅具名导出**）+ 全局 `style.css` |
| `packages/config` | `@guga-reading/config` | 统一 Vite 预设 `createGugaViteConfig`（alias、拆包、插件）                                                                               |
| `packages/eslint` | `@qyani/eslint-config` | 共享 ESLint 配置                                                                                                                         |

> **修改共享包后必须运行 `pnpm types`**（构建顺序：types → shares → ui），三端才会拿到更新。

## 🎯 功能模块

### 👤 用户功能

- **🔐 账户管理**: 注册/登录（手机号、邮箱）、个人资料、密码管理
- **📚 内容浏览**: 分类浏览、标签筛选、全文搜索、书籍详情
- **📖 阅读体验**: 章节阅读、翻页/滑动、字体/背景调节、夜间模式
- **💬 互动功能**: 书籍收藏、追更、章节评论、点赞
- **⏱️ 阅读进度**: 自动同步、断点续读
- **🎯 个性化推荐**: 首页推荐、书架推荐、猜你喜欢

### ✍️ 作者功能

- **✅ 作者认证**: 在线申请、审核管理
- **📝 作品管理**: 创建书籍、编辑信息、章节管理
- **✏️ 内容创作**: 富文本编辑器、草稿系统、版本管理
- **📊 数据统计**: 阅读量、收藏数、评论数、收益分析
- **📤 上传支持**: EPUB、TXT 等多种格式

### 🔧 管理员功能

- **👥 用户管理**: 用户列表、禁言、封号、作者认证审核
- **📚 内容管理**: 书籍/章节审核、下架、评论管理、举报处理
- **📈 数据统计**: 平台数据、活跃用户、阅读量统计
- **⚙️ 系统管理**: 配置管理、日志查看、分类/标签管理

## 🛠️ 技术栈

### 前端（本仓库）

| 技术          | 版本                                     | 说明                      |
| ------------- | ---------------------------------------- | ------------------------- |
| **框架**      | Vue 3.5                                  | 渐进式框架                |
| **语言**      | TypeScript 5.9                           | 类型安全                  |
| **构建工具**  | Vite 7                                   | 快速开发服务器与打包      |
| **状态管理**  | Pinia 3                                  | Vue 3 官方推荐            |
| **路由**      | Vue Router 4.6                           | SPA 路由                  |
| **UI 组件库** | qyani-components 1.6.3 + @qianrenni/core | 本地组件库                |
| **HTTP**      | Axios 1.13                               | HTTP 客户端               |
| **图表**      | ECharts 6                                | 数据可视化（作者/管理端） |
| **工具库**    | @vueuse/core 14                          | 组合式工具                |
| **测试**      | Vitest 4 + Playwright                    | 单元 + 浏览器组件测试     |
| **Monorepo**  | pnpm workspace                           | packages/_ + app/_        |

### 后端（独立仓库）

| 技术                      | 说明                    |
| ------------------------- | ----------------------- |
| **Ktor 3.5 + Kotlin 2.1** | 异步 Web 框架（JVM）    |
| **Exposed**               | Kotlin ORM              |
| **MySQL / Redis**         | 元数据存储 / 缓存与限流 |
| **Ktor Auth + JWT**       | 身份认证与权限校验      |
| **Docker**                | 容器化部署              |

> API 文档（Swagger）：本地运行后端后访问 `http://localhost:8000/swagger`。

### 遗留（分支 `release_python_backend`）

旧版 FastAPI (Python) 后端及其配套 Vue 前端已迁出本仓库，不再维护。

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 20.19（Vite 7 要求）
- **pnpm** ≥ 9（本仓库使用 `pnpm@10.28.1`）
- **Docker**（可选，用于 `docker-compose.yml` 全栈部署）

### 安装依赖

```bash
# 在仓库根目录执行
pnpm install
```

### 常用命令

```bash
# ★ 修改 packages/ 后必须重跑（构建顺序：types → shares → ui）
pnpm types

# 启动对应端开发服务器
pnpm dev:user
pnpm dev:author
pnpm dev:admin

# 构建全部三个前端
pnpm build:all

# 全量测试（node 逻辑测试 + browser 组件渲染测试，递归全部包）
pnpm test

# 全量类型检查：构建共享包 + 各包源码 + 测试
pnpm type:check
pnpm type:check:test        # 仅测试文件

# 全量格式化
pnpm prettier
```

### 单独运行某个应用

```bash
pnpm --filter @guga-reading/user run dev
# 或
cd app/user && pnpm install && pnpm dev
```

> user/author/admin 的 `node_modules` 为独立安装，`packages/*` 的改动需先 `pnpm types`（若新增依赖还需 `pnpm install`）才会生效。

## 🧪 测试

前端使用 **Vitest** 对每个 `packages/*` 与 `app/*` 包做全量测试，每个包内配置双环境 projects（`test.projects` + `extends`）：

- **node**: 纯逻辑 / composable / store / API 测试（依赖 DOM 的文件用 `// @vitest-environment jsdom` 文件头切换）
- **browser**: 组件渲染测试（`*.render.test.ts`），Playwright + chromium + `vitest-browser-vue`

```bash
# 全部包测试
pnpm test

# 单包测试
pnpm --filter @guga-reading/shares run test

# 覆盖率
pnpm test:coverage
```

> 浏览器测试前先运行 `npx playwright install chromium`。测试文件与被测文件同目录；组件内不可测的纯逻辑解耦为同目录 `composable.ts`（目录 + `index.ts` 导出）以便测试。

## 🐳 部署

### 全栈（docker-compose）

`docker-compose.yml` 启动四个服务：

- `mysql`（8.0）— 元数据存储
- `redis`（7）— 缓存 / 限流
- `guga_backend` — 后端镜像 `guga_backend_ktor:latest`（由独立后端仓库构建）
- `guga_frontend` — Nginx 托管三个构建产物

`nginx.conf` 将 `/` 映射到用户端、`/author/` 到作者端、`/admin/` 到管理端，并将 `/api` 反代到后端。

### 仅前端构建与手动部署

```bash
pnpm build:all
# scp app/{user,author,admin}/dist 到服务器（见 script.local）
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

代码规范详见 `AGENTS.md`：禁 `any`、优先 `interface`、严格相等 `===`、公共函数显式返回类型、JSDoc 注释；提交时 `pnpm lint-staged` 自动执行。

## 📄 许可证

ISC License

## 👥 联系方式

- **作者**: qianrenni
- **邮箱**: 2112183503@qq.com

---

**注意**: 本项目仅供学习交流使用，请勿用于商业用途。
