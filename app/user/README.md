# 三味书屋 - 在线阅读平台前端

一个基于 Vue 3 + TypeScript + Vite 构建的现代化在线阅读平台前端应用。

## 🚀 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI组件库**: Qyani Components
- **包管理器**: npm

## 📁 项目结构

```
src/
├── api/                    # API 接口层
│   ├── auth.ts            # 认证相关API
│   ├── books.ts           # 书籍相关API
│   ├── bookReadingProgress.ts # 阅读进度API
│   └── captcha.ts         # 验证码API
├── components/            # 公共组件
│   ├── BookItem.vue       # 书籍项组件
│   └── Header.vue         # 头部导航组件
├── composables/           # 组合式函数
│   └── useRequest.ts      # 请求封装
├── config/                # 配置文件
│   └── index.ts           # 基础配置
├── store/                 # 状态管理
│   ├── index.ts           # Store入口
│   ├── useAuthStore.ts    # 认证状态管理
│   ├── useBookStore.ts    # 书籍状态管理
│   └── useReadingHistoryStore.ts # 阅读历史管理
├── types/                 # TypeScript类型定义
│   └── index.ts           # 类型导出
├── utils/                 # 工具函数
│   ├── index.ts           # 工具函数入口
│   ├── useFetch.ts        # Fetch封装
│   ├── useHtmlUtil.ts     # HTML工具
│   ├── useLocalStorage.ts # 本地存储
│   ├── useValidate.ts     # 验证工具
│   ├── useWindow.ts       # 窗口工具
│   └── useWrapLoad.ts     # 加载包装
├── views/                 # 页面组件
│   ├── BookInfo.vue       # 书籍详情页
│   ├── BookRead.vue       # 阅读页面
│   ├── BookShelf.vue      # 书架页面
│   ├── Home.vue           # 首页
│   ├── Login.vue          # 登录页面
│   ├── PersonalCenter.vue # 个人中心
│   ├── ReadingHistory.vue # 阅读历史
│   └── Register.vue       # 注册页面
├── App.vue                # 根组件
├── main.ts                # 应用入口
├── private.css            # 私有样式
├── route.ts               # 路由配置
└── vite-env.d.ts          # Vite类型声明
```

## ✨ 功能特性

### 📚 阅读功能

- 书籍浏览与搜索
- 在线阅读器
- 阅读进度保存
- 章节目录导航

### 👤 用户系统

- 用户注册/登录
- 个人中心管理
- 阅读历史记录
- 书架管理

### 🎨 界面特性

- 响应式设计,支持移动端
- 暗色/亮色主题切换
- 现代化UI设计
- 流畅的滚动体验

## 🛠️ 开发指南

### 环境要求

- Node.js 16+
- npm 7+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🔧 配置说明

### 后端API配置

在 `src/config/index.ts` 中配置后端API地址:

```typescript
export const BASE_URL = 'http://127.0.0.1:8000';
```

### 路由守卫

应用实现了路由守卫,保护需要登录的页面:

- 个人中心 (`/personal-center`)
- 书架 (`/book-shelf`)
- 阅读历史 (`/history`)
- 阅读页面 (`/book-read`)

## 📱 页面说明

### 首页 (`/`)

- 书籍列表展示
- 无限滚动加载
- 响应式布局

### 登录/注册 (`/login`, `/register`)

- 用户认证功能
- 表单验证
- 记住登录状态

### 个人中心 (`/personal-center`)

- 用户信息管理
- 阅读偏好设置

### 书架 (`/book-shelf`)

- 收藏书籍管理
- 阅读进度跟踪

### 阅读历史 (`/history`)

- 阅读记录查看
- 快速继续阅读

### 书籍详情 (`/book-detail/:id`)

- 书籍信息展示
- 目录预览
- 开始阅读入口

### 阅读页面 (`/book-read/:bookId/:contentId`)

- 在线阅读器
- 章节切换
- 阅读进度保存

## 🔐 认证流程

1. 用户登录后获取访问令牌
2. 令牌自动保存到本地存储
3. 路由守卫验证登录状态
4. 支持令牌刷新机制

## 🎯 技术特色

- **TypeScript**: 完整的类型支持,提高代码质量
- **组合式API**: 使用Vue 3的组合式API,逻辑复用性更强
- **Pinia状态管理**: 轻量级的状态管理方案
- **响应式设计**: 适配各种屏幕尺寸
- **组件化开发**: 高度可复用的组件架构

## 📄 许可证

本项目仅供学习交流使用。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 📞 联系

如有问题,请通过项目Issue进行反馈。
