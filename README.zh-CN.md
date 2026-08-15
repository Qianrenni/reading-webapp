# GUGA Reading - 在线阅读平台

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![Vue](https://img.shields.io/badge/vue-3.5+-brightgreen.svg)](https://vuejs.org/)
[![Ktor](https://img.shields.io/badge/ktor-3.5+-blueviolet.svg)](https://ktor.io/)
[![Kotlin](https://img.shields.io/badge/kotlin-2.1+-orange.svg)](https://kotlinlang.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.119+-teal.svg)](https://fastapi.tiangolo.com/)

一个基于 **Ktor / FastAPI + Vue 3** 的多角色在线阅读平台，同时提供 Ktor (Kotlin) 和 FastAPI (Python) 两种后端实现，支持用户、作者和管理员三种角色的完整功能。

> **注意**: 当前主后端为 Ktor (Kotlin) 实现的 `ktorBackend`；旧版 FastAPI (Python) 后端及其配套前端（用户端、管理端、作者端）均已迁移至 Git 分支 `release_python_backend`。

中文 | [英文版](./README.md)

## 📖 项目概述

GUGA Reading 是一个现代化的在线阅读系统,提供小说/书籍的在线阅读、创作和管理功能。系统采用前后端分离架构,支持跨平台访问。

### 🌐 在线预览

- **[用户端](http://49.235.107.221)** - 读者浏览和阅读平台
- **[作者端](http://49.235.107.221/author/#)** - 作者创作和管理平台
- **[管理端](http://49.235.107.221/admin/#)** - 管理员后台管理系统
- **[安卓端](http://49.235.107.221:8000/static/guga.apk)**
- **[安卓项目地址](https://github.com/Qianrenni/guga-android)**

### ✨ 核心特性

- **🎭 多角色支持**: 用户、作者、管理员三种角色,权限分离
- **🤖 个性化推荐**: 基于 TF-IDF 算法的个性化书籍推荐
- **📱 实时阅读进度**: 支持断点续读,多设备同步
- **💬 丰富的互动功能**: 收藏、评论、点赞等社交功能
- **📝 完善的内容管理**: 从创作到发布的全流程管理
- **⚡ 高并发设计**: 支持单机上百用户同时访问,首屏加载 < 1s

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                     GUGA Reading                        │
├─────────────────────────────────────────────────────────┤
│  Frontend (Vue 3 + TypeScript)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   User      │  │   Author    │  │   Admin     │    │
│  │   Client    │  │   Client    │  │   Panel     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
├─────────────────────────────────────────────────────────┤
│  Backend (Ktor + Exposed)                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  API Gateway / Authentication / Rate Limiting   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐  │
│  │  Book   │ │  User   │ │  Shelf  │ │  Statistics  │  │
│  │ Service │ │ Service │ │ Service │ │   Service    │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────────┘  │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │   MySQL     │  │   Redis     │  │  File Storage │  │
│  │  (Database) │  │   (Cache)   │  │  (OBS/Local)  │  │
│  └─────────────┘  └─────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 技术架构图说明

- **前端层**: 三个独立的 Vue 3 应用,分别服务于不同角色
- **后端层**: Ktor (Kotlin) 提供 RESTful API,包含多个服务模块
- **数据层**: MySQL 持久化存储,Redis 缓存加速,对象存储管理文件
- **旧版说明**: 基于 FastAPI (Python) 的旧版后端及其配套前端（用户端、管理端、作者端）已迁移至 `release_python_backend` 分支

## 📁 项目结构

```
guga_reading/
├── ktorBackend/                      # **当前主后端** (Ktor + Kotlin)
│   ├── src/main/kotlin/com/qianrenni/
│   │   ├── controller/               # API 路由控制器
│   │   ├── services/                 # 业务逻辑服务层
│   │   ├── models/                   # 数据模型 (domain + tables)
│   │   ├── plugins/                  # 插件配置 (认证、限流、CORS 等)
│   │   ├── database/                 # 数据库与 Redis 客户端
│   │   ├── schemas/                  # 响应模型
│   │   ├── enums/                    # 枚举定义
│   │   ├── utils/                    # 工具函数
│   │   └── workers/                  # 定时任务
│   ├── build.gradle.kts              # Gradle 构建配置
│   └── Dockerfile                    # Docker 部署
│
├── backend/                          # **旧版后端 (FastAPI/Python)** - 已停止维护
│                                      # 移至 `release_python_backend` 分支
│   ├── app/
│
├── author/                           # 作者端应用 (Vue 3) [旧版]
│                                      # 移至 `release_python_backend` 分支
│   ├── src/
│   │   ├── components/               # Vue 组件
│   │   ├── views/                    # 页面视图
│   │   ├── store/                    # Pinia 状态管理
│   │   ├── config/                   # 配置文件
│   │   └── route.ts                  # 路由配置
│   ├── public/                       # 公共资源
│   ├── package.json
│   └── vite.config.ts
│
├── user/                             # 用户端应用 (Vue 3) [旧版]
│                                      # 移至 `release_python_backend` 分支
│   ├── src/
│   │   ├── components/               # Vue 组件
│   │   ├── views/                    # 页面视图
│   │   ├── store/                    # Pinia 状态管理
│   │   └── config/                   # 配置文件
│   ├── public/                       # 公共资源
│   └── package.json
│
├── admin/                            # 管理后台 (Vue 3) [旧版]
│                                      # 移至 `release_python_backend` 分支
│   ├── src/
│   │   └── views/                    # 页面视图
│   ├── public/                       # 公共资源
│   └── package.json
│
├── packages/                         # 共享包 (Monorepo)
│   ├── eslint/                       # ESLint 配置
│   ├── shares/                       # 共享工具和常量
│   └── types/                        # TypeScript 类型定义
│
├── .husky/                           # Git Hooks 配置
├── .github/                          # GitHub 工作流
├── docker-compose.yml                # 根目录 Docker 编排
├── nginx.conf                        # Nginx 配置
├── package.json                      # 根目录 pnpm 配置
├── pnpm-workspace.yaml               # pnpm 工作区配置
└── README.md                         # 项目说明文档
```

> 💡 **提示**: 本项目当前主后端为 `ktorBackend` (Ktor + Kotlin)。旧版 Python (FastAPI) 后端及其配套前端（用户端、管理端、作者端）已迁移至 `release_python_backend` 分支。本项目采用 pnpm workspace 管理前端应用。

## 🎯 功能模块

### 👤 用户功能

- **🔐 账户管理**: 注册/登录(手机号、邮箱)、个人资料、密码管理
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

### 后端技术（当前主后端）

| 技术         | 版本                  | 说明             |
| ------------ | --------------------- | ---------------- |
| **框架**     | Ktor 3.5.0            | 异步 Web 框架    |
| **语言**     | Kotlin 2.1+           | JVM 编程语言     |
| **数据库**   | MySQL                 | 主数据存储       |
| **缓存**     | Redis 6.4.0           | 缓存、限流、会话 |
| **ORM**      | Exposed               | Kotlin ORM 框架  |
| **认证**     | Ktor Auth + JWT       | JWT 身份认证     |
| **限流**     | flaxoos-rate-limiting | Redis 令牌桶限流 |
| **构建工具** | Gradle + Kotlin DSL   | 项目构建         |
| **部署**     | Docker                | 容器化部署       |

### 后端技术（旧版 - 已迁移至 `release_python_backend` 分支）

| 技术         | 版本               | 说明          |
| ------------ | ------------------ | ------------- |
| **框架**     | FastAPI 0.119.0    | 异步 Web 框架 |
| **语言**     | Python 3.8+        | 编程语言      |
| **ORM**      | SQLAlchemy 2.0.44  | 异步 ORM      |
| **推荐算法** | TF-IDF + NumPy     | 个性化推荐    |
| **任务调度** | APScheduler 3.11.2 | 定时任务      |
| **部署**     | Gunicorn + Uvicorn | 容器化部署    |

### 前端技术

| 技术         | 版本                   | 说明           |
| ------------ | ---------------------- | -------------- |
| **框架**     | Vue 3.5.24             | 渐进式框架     |
| **语言**     | TypeScript 5.9.3       | 类型安全       |
| **状态管理** | Pinia 3.0.4            | Vue 3 官方推荐 |
| **路由**     | Vue Router 4.6.4       | SPA 路由       |
| **UI 组件**  | qyani-components 1.5.3 | 自定义组件库   |
| **构建工具** | Vite 7.2.5             | 快速开发服务器 |
| **图表**     | ECharts 6.0.0          | 数据可视化     |
| **HTTP**     | Axios 1.13.6           | HTTP 客户端    |

### 移动端技术(Android)

| 技术         | 版本                        | 说明                  |
| ------------ | --------------------------- | --------------------- |
| **语言**     | Kotlin                      | 现代 Android 开发语言 |
| **UI 框架**  | Jetpack Compose             | 声明式 UI 框架        |
| **网络**     | Ktor Client                 | 轻量级 HTTP 客户端    |
| **序列化**   | kotlinx.serialization       | JSON 序列化           |
| **图片加载** | Coil 2.6.0                  | 图片加载库            |
| **导航**     | Navigation Compose          | 页面导航              |
| **存储**     | DataStore + Security Crypto | 本地安全存储          |
| **异步**     | Kotlin Coroutines           | 协程支持              |

## 🚀 快速开始

### 环境要求

- **后端 (Ktor)**: JDK 21+, Gradle 8.0+
- **前端**: Node.js >= 16.0.0, pnpm >= 8.0.0
- **数据库**: MySQL 5.7+
- **缓存**: Redis 5.0+
- **移动端**: Android Studio Hedgehog+, JDK 11+
- **旧版 Python 后端**: Python 3.8+（位于 `release_python_backend` 分支）

### 后端部署（当前主后端 - Ktor）

#### 方式一：本地运行

1. **配置环境变量**

```bash
cd ktorBackend
# 复制并编辑配置文件
cp .env.example .env
# 编辑 .env 文件,配置数据库、Redis、邮箱等信息
```

2. **初始化数据库**

```bash
# 执行 SQL 初始化脚本
mysql -u root -p < ktorBackend/database.sql
```

3. **运行服务**

```bash
cd ktorBackend
./gradlew run
```

#### 方式二：Docker 部署

```bash
cd ktorBackend
docker build -t guga_backend .
docker run -p 8000:8000 guga_backend
```

访问 API 文档（Swagger UI）：http://localhost:8000/swagger

> **提示**: 旧版 FastAPI (Python) 后端已迁移至 `release_python_backend` 分支。

### 前端部署

#### Monorepo 统一管理

本项目采用 pnpm workspace 管理多个前端应用。

**安装所有依赖**

```bash
# 在根目录执行
pnpm install
```

**常用命令**

```bash
# 启动作者端开发服务器
pnpm dev:author

# 启动用户端开发服务器
pnpm dev:user

# 启动管理端开发服务器
pnpm dev:admin

# 构建所有前端应用
pnpm build:all

# 代码格式化
pnpm prettier
```

#### 单独运行某个应用

**作者端应用**

```bash
cd author
pnpm install
pnpm dev
# 访问 http://localhost:80
```

**用户端应用**

```bash
cd user
pnpm install
pnpm dev
```

**管理端应用**

```bash
cd admin
pnpm install
pnpm dev
```

### Android 移动端部署

1. **克隆项目**

```bash
git clone <repository-url>
cd reading
```

2. **配置签名(可选,用于发布版本)**

在 `local.properties` 文件中添加：

```properties
storeFile=/path/to/your/keystore.jks
storePassword=your_store_password
keyAlias=your_key_alias
keyPassword=your_key_password
```

3. **使用 Android Studio 打开项目**

- 打开 Android Studio
- 选择 "Open an existing project"
- 选择 `reading` 目录
- 等待 Gradle 同步完成

4. **运行应用**

- 连接 Android 设备或启动模拟器
- 点击 Run 按钮或按 `Shift + F10`
- 应用将自动安装并启动

5. **命令行构建(可选)**

```bash
# 调试版本
./gradlew assembleDebug

# 发布版本
./gradlew assembleRelease

# 安装到设备
./gradlew installDebug
```

APK 文件位置：

- 调试版：`app/build/outputs/apk/debug/app-debug.apk`
- 发布版：`app/build/outputs/apk/release/app-release.apk`

## 📊 性能优化

### 后端优化策略

- **💾 缓存策略**
  - Redis 缓存热门书籍、章节内容、推荐结果
  - 用户阅读进度实时缓存
  - 分布式限流保护核心接口

- **🗄️ 数据库优化**
  - 高频查询字段索引优化
  - 读写分离设计
  - 分页查询避免大量数据加载

- **⚡ 并发处理**
  - 异步 IO 提升吞吐量
  - 分布式锁保证数据一致性
  - 线程池管理资源

### 前端优化策略

- **🚀 加载优化**: 路由懒加载、组件异步加载
- **🎨 渲染优化**: 虚拟列表、防抖节流
- **💿 缓存优化**: 本地存储、请求缓存
- **📱 响应式设计**: 移动端/桌面端自适应

### Android 移动端优化

- **🖼️ 图片优化**: Coil 自动缓存和压缩
- **📡 网络优化**: Ktor 连接池、请求合并
- **💾 本地缓存**: DataStore 持久化用户偏好
- **🔋 电量优化**: 协程结构化并发,避免内存泄漏

## 🔒 安全设计

- **🔐 认证授权**: JWT Token + 权限校验
- **🛡️ 数据校验**: 防止 SQL 注入、XSS 攻击
- **⏱️ 限流保护**: Redis 令牌桶算法限流
- **📁 文件安全**: 上传文件类型/内容校验
- **📝 日志审计**: 关键操作记录追踪

## 📈 高可用设计

- **⚖️ 负载均衡**: Nginx 反向代理 + 健康检查
- **🔄 服务冗余**: MySQL 主从复制、Redis 哨兵模式
- **🚑 故障恢复**: 自动重启、异常监控
- **💾 数据备份**: 定时备份、灾难恢复

## 📝 API 文档

后端服务启动后,访问以下地址查看 API 文档：

- **Swagger UI**: http://localhost:8000/swagger

API 文档提供了完整的接口说明、请求参数、响应示例和在线测试功能。

## 🧪 测试

### 后端测试

```bash
cd ktorBackend
./gradlew test
```

> **旧版后端测试**: FastAPI (Python) 后端的测试已随旧版后迁移至 `release_python_backend` 分支。如需运行：
>
> ```bash
> cd backend
> pytest
> ```

### 前端测试

```bash
# 代码检查和格式化(根目录)
pnpm prettier

# 单个应用检查
cd author
pnpm run lint
```

### Android 测试

```bash
# 运行单元测试
./gradlew test

# 运行仪器化测试
./gradlew connectedAndroidTest

# 生成测试报告
./gradlew jacocoTestReport
```

## 📦 部署架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │ Load Balancer│
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
    │   Ktor    │   │   Ktor    │   │   Ktor    │
    │ Instance 1│   │ Instance 2│   │ Instance 3│
    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
   ┌─────▼─────┐    ┌──────▼─────┐   ┌──────▼─────┐
   │   MySQL   │    │   Redis    │   │ File Store │
   │  Primary  │    │   Master   │   │   (OBS)    │
   └─────┬─────┘    └──────┬─────┘   └────────────┘
         │                 │
   ┌─────▼─────┐    ┌──────▼─────┐
   │   MySQL   │    │   Redis    │
   │   Slave   │    │   Slave    │
   └───────────┘    └────────────┘
```

### 移动端架构

```
┌──────────────────────────────────────┐
│        Android App (Kotlin)          │
├──────────────────────────────────────┤
│  UI Layer (Jetpack Compose)          │
│  ┌──────────┐ ┌──────────┐          │
│  │  Views   │ │Components│          │
│  └──────────┘ └──────────┘          │
├──────────────────────────────────────┤
│  ViewModel Layer                     │
│  ┌──────────────────────────┐       │
│  │   State Management       │       │
│  └──────────────────────────┘       │
├──────────────────────────────────────┤
│  Data Layer                          │
│  ┌──────────┐ ┌──────────┐          │
│  │  Ktor    │ │DataStore │          │
│  │ Client   │ │ (Local)  │          │
│  └──────────┘ └──────────┘          │
├──────────────────────────────────────┤
│         Network (HTTPS)              │
└──────────────┬───────────────────────┘
               │
               ▼
    ┌─────────────────────┐
    │   Backend API       │
    │   (Ktor)            │
    └─────────────────────┘
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循项目现有的代码风格
- 添加必要的注释和文档
- 确保测试通过
- 保持提交信息清晰明了

## 📄 许可证

ISC License

## 👥 联系方式

- **作者**:qianrenni
- **邮箱**:2112183503@qq.com

---

**注意**:本项目仅供学习交流使用,请勿用于商业用途。
