# 在线阅读作者端

这是一个基于Vue 3和TypeScript的在线阅读平台作者端项目,为作者提供完整的作品创作、管理和发布功能。

## 🚀 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - JavaScript的超集,提供静态类型检查
- **Pinia** - Vue 3官方推荐的状态管理库
- **Vue Router** - Vue.js官方路由管理器
- **qyani-components** - 基于Vue 3的UI组件库
- **Vite** - 新一代前端构建工具
- **ESLint + Prettier** - 代码质量和格式化工具

## 📁 项目结构

```
src/
├── api/                 # API接口封装
│   ├── auth.ts         # 认证相关接口
│   ├── author.ts       # 作者相关接口
│   ├── books.ts        # 图书相关接口
│   ├── captcha.ts      # 验证码接口
│   ├── index.ts        # 接口导出
│   └── user.ts         # 用户相关接口
├── components/          # 公共组件
│   ├── BackButton.vue          # 返回按钮
│   ├── BookBasicInfo.vue       # 图书基本信息
│   ├── BookChapterDraftManage.vue # 章节草稿管理
│   ├── BookChapterManage.vue   # 章节管理
│   ├── BookDetail.vue          # 图书详情
│   ├── BookDraftManage.vue     # 图书草稿管理
│   ├── BookItem.vue            # 图书项组件
│   ├── ContentEditor.vue       # 内容编辑器
│   ├── EditableTitle.vue       # 可编辑标题
│   ├── HeaderNavigation.vue    # 头部导航栏
│   └── SiderBar.vue            # 侧边栏
├── config/              # 配置文件
│   └── index.ts        # 基础配置
├── store/               # 状态管理 (Pinia)
│   ├── MenuStore.ts    # 菜单状态管理
│   ├── useAuthStore.ts # 认证状态管理
│   └── index.ts        # 状态管理导出
├── types/               # TypeScript类型定义
│   └── index.ts        # 类型定义文件
├── utils/               # 工具函数
│   ├── index.ts        # 工具函数导出
│   ├── useArray.ts     # 数组相关工具
│   ├── useClip.ts      # 剪贴板相关工具
│   ├── useFetch.ts     # 请求相关工具
│   ├── useHtmlUtil.ts  # HTML相关工具
│   ├── useNullHandel.ts # 空值处理工具
│   ├── useValidate.ts  # 验证相关工具
│   └── useWrapLoad.ts  # 加载包装工具
├── views/               # 页面视图
│   ├── AccountSetting.vue    # 账号设置
│   ├── BookEdit.vue          # 图书编辑
│   ├── CreateBook.vue        # 创建图书
│   ├── DataSumary.vue        # 数据统计
│   ├── DraftManage.vue       # 草稿管理
│   ├── HomeView.vue          # 主页容器
│   ├── IndexView.vue         # 首页
│   ├── LoginView.vue         # 登录页面
│   ├── MyBook.vue            # 我的图书
│   ├── SystemSetting.vue     # 系统设置
│   └── TestView.vue          # 测试页面
├── App.vue             # 根组件
├── main.ts             # 应用入口
├── private.css         # 自定义样式
├── route.ts            # 路由配置
└── vite-env.d.ts       # Vite环境类型定义
```

## ✨ 核心功能

### 🔐 用户认证

- 用户登录/登出
- 权限验证
- 验证码校验

### 📚 作品管理

- 图书创建与编辑
- 章节管理
- 草稿系统
- 作品详情展示

### 📝 内容创作

- 富文本编辑器
- 实时保存功能
- 版本管理
- 内容预览

### 📊 数据统计

- 作品数据概览
- 阅读量统计
- 收益分析

### ⚙️ 系统设置

- 账号信息管理
- 系统偏好设置
- 主题切换

### 🎨 用户体验

- 响应式设计(支持移动端和桌面端)
- 侧边栏菜单导航
- 主题切换功能
- 移动端适配优化

## 🛠️ 开发环境搭建

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装步骤

1. 克隆项目

   ```bash
   git clone <repository-url>
   cd online_reading_author_end
   ```

2. 安装依赖

   ```bash
   pnpm install
   ```

3. 启动开发服务器

   ```bash
   pnpm dev
   ```

   默认访问地址:http://localhost:80

4. 构建生产版本

   ```bash
   pnpm build
   ```

5. 预览生产构建
   ```bash
   pnpm preview
   ```

## 📦 依赖说明

### 核心依赖

- **qyani-components**: UI组件库,提供主题切换、响应式布局、常用组件等
- **pinia**: 状态管理解决方案
- **vue-router**: 路由管理
- **axios**: HTTP客户端(通过工具函数封装)

### 开发依赖

- **TypeScript**: 静态类型检查
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Vite**: 构建工具和开发服务器

## 📖 开发规范

### 编码规范

- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier配置的代码风格
- 组件命名采用PascalCase
- 文件命名采用kebab-case

### 状态管理

- 使用Pinia进行全局状态管理
- 按功能模块划分store
- 合理使用Composition API

### 路由管理

- 使用Vue Router进行SPA路由管理
- 采用hash模式以适应更多部署场景
- 路由懒加载优化性能

### 响应式设计

- 使用qyani-components的响应式工具
- 支持移动端和桌面端适配
- 断点设计:768px作为移动端分界点

### API调用

- 统一API接口封装在`src/api/`目录
- 使用拦截器处理请求/响应
- 错误统一处理机制

## 🌐 环境配置

项目支持多环境配置,基础URL配置在`src/config/index.ts`中:

```typescript
export const BASE_URL =
  (window as any).ENV_CONFIG?.BASE_URL || 'http://1.95.141.194:8000';
```

可通过`public/env-config.js`文件进行环境变量配置。
