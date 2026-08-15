# 三味书屋在线阅读平台管理端

这是一个基于 Vue 3 + TypeScript + Vite 构建的在线阅读平台管理端系统,用于管理书籍、用户和系统设置。

## 项目介绍

三味书屋是一个在线阅读平台的管理后台,管理员可以通过该系统进行书籍管理、分类管理、用户数据监控等操作。系统提供了直观的数据展示界面和便捷的操作方式。

主要功能包括:

- 书籍管理:添加、编辑、删除书籍信息
- 分类管理:对书籍进行分类管理
- 数据统计:展示平台各项数据指标
- 用户管理:管理系统用户相关信息

## 技术栈

- [Vue 3](https://v3.vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集,添加了静态类型
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库
- [Vue Router](https://router.vuejs.org/) - Vue.js 的官方路由
- [qyani-components](https://github.com/) - UI 组件库(项目内使用)

## 项目结构

```
src/
├── api/               # 接口请求封装
├── components/        # 公共组件
├── config/            # 配置文件
├── store/             # 状态管理
├── types/             # TypeScript 类型定义
├── utils/             # 工具函数
├── views/             # 页面视图
├── App.vue            # 根组件
├── main.ts            # 入口文件
├── route.ts           # 路由配置
└── vite-env.d.ts      # Vite 环境声明
```

## 开发环境搭建

### 环境要求

- Node.js >= 16.x
- pnpm >= 8.x

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

默认访问地址: http://localhost:5173

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
# 运行 ESLint 检查
pnpm lint

# 运行 ESLint 并自动修复问题
pnpm lint:fix

# 运行 Prettier 格式化代码
pnpm format
```

## 功能模块

### 首页仪表板

- 展示平台核心数据指标
- 包括总书籍数、活跃用户数、今日阅读量等统计信息

### 书籍管理

- 书籍列表展示与分页
- 按分类筛选书籍
- 添加、编辑、删除书籍
- 书籍封面、简介、作者等信息管理

### 用户管理

- 用户信息管理(待完善)

### 系统设置

- 系统配置管理(待完善)

## 项目特点

- 使用 Vue 3 Composition API 和 `<script setup>` 语法糖
- 基于 TypeScript 提供完整的类型安全
- 使用 Pinia 进行状态管理
- 响应式设计适配不同屏幕尺寸
- 使用 qyani-components UI 组件库提升开发效率
- 实现了数据缓存机制优化性能

## 浏览器支持

- Chrome >= 80
- Edge >= 80
- Firefox >= 74
- Safari >= 13

## 许可证

MIT
