# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

# GUGA Reading — 项目编码助手指南

多角色（用户/作者/管理员）在线阅读平台，前后端分离 + Android 客户端。

## 仓库速览

- **`ktorBackend/`** — ★ 当前主后端（Ktor 3.5 + Kotlin 2.1 + JVM 21 + Exposed + MySQL + Redis/Lettuce）。
- **`backend/`、`user/`、`author/`、`admin/`** — FastAPI（Python）后端与配套 Vue 前端，**遗留代码**，已迁移至 Git 分支 `release_python_backend`，工作区保留旧文件。**除非用户明确要求，不要修改这些目录**。
- **`react_user/`** — React 用户端实验（分支 `feature_react_user`）。
- **`packages/`** — pnpm workspace 共享包：`shares`（API 封装 `useApiXxx`、`request` 拦截器、`txtParser` 等）、`types`（前后端共享 TS 类型）、`eslint`。
- **`android-user/`** — Android 客户端（Jetpack Compose，独立仓库 guga-android）。

## 常用命令

### 主后端（ktorBackend）

```bash
cd ktorBackend
cp .env.example .env      # 首次运行必须配置 MySQL/Redis/邮箱等环境变量
./gradlew run             # 启动，端口 8000，Swagger: http://localhost:8000/swagger
./gradlew test            # 全部测试
./gradlew test --tests "com.qianrenni.guga.service.TestContentStoreService"   # 运行单个测试类
./gradlew test --tests "*TestContentStoreService.testCRUD"                    # 运行单个测试方法
./gradlew build           # 完整构建
```

- 环境变量全部注入 `src/main/resources/application.conf`（`MYSQL_DSN`、`REDIS_URL`、`SECRET_KEY`、`CONTENT_DIR`、`STATIC_DIR`、`ENV`、`SMTP_*`、`SERVER_URL`、`ALLOW_HOST`）。**`ENV=dev` 时才注册测试路由**（`controller/test.kt`）。
- 数据库表结构由 `database.sql` 初始化（无 Flyway/Alembic 迁移机制）。

### 前端（根目录，pnpm workspace）

```bash
pnpm install
pnpm types                # ★ 修改 packages 后必须重跑，重新构建 types + shares
pnpm dev:user|dev:author|dev:admin   # 启动对应端开发服务器
pnpm build:all            # 构建全部三个前端
pnpm prettier             # 全量格式化
```

注意：`user/author/admin` 的 `node_modules` 是独立安装（非 workspace 符号链接），`packages` 改动不会自动生效。

### 代码检查（提交前自动执行）

```bash
pnpm lint-staged          # husky pre-commit 钩子：Prettier + ESLint（js/ts/vue/css/md）+ Ruff（backend/**/*.py）
```

### Android

```bash
cd android-user
./gradlew assembleDebug | assembleRelease   # release 需要 local.properties 中签名配置
```

## 后端架构（ktorBackend）

### 分层与启动

- 启动流程：`Application.main()` → `loadConfig → configureDatabase → configureRedis → 各 configureXxx 插件 → configureRouting → 定时任务`。
- **服务注册模式**：每个 Service 以 `Application.xxxService` 扩展属性 + `registerXxxService()` 挂载（如 `bookService`），控制器通过 `application.xxxService` 访问；服务通过主构造函数注入 `Application` 获取 `databaseManager`、`appConfig` 等。
- **路由组织**：每个模块一个 `fun Routing.xxx()` 扩展（`auth.kt`、`book.kt`、`admin.kt`、`author.kt`、`comment.kt`、`shelf.kt`、`statistics.kt`、`user.kt` 等），在 `controller/Routing.kt` 统一挂载；静态文件经 `/static` 暴露（`STATIC_DIR`）。
- **权限体系**：JWT 认证（`authenticate("auth-jwt")`）+ `call.requirePermission(...)` 权限码（`ResourceTypeEnum × ActionEnum × ScopeEnum`，见 `enums/AppEnums.kt`），`plugins/PermissionCheck.kt` 与 `RightService` 实现。
- **异常处理**：业务异常统一抛 `IllegalStateException`/`IllegalArgumentException`，由 `StatusPages` 转成 `ResponseModel` 响应；`call.respond(ResponseModel.Success/Error(...))` 是统一响应格式。
- **定时任务**：`TaskManager`（cron 表达式，`workers/cornFlow.kt`）+ `Application.kt` 中注册：每小时统计聚合、每小时发布内容（`publishBook`）、审核超时自动发布、每分钟 Outbox 兜底消费（`outboxService.processPending()`，即时消费由 channel 事件驱动）。

### 核心：双存储模型（MySQL 元数据 + 本地文件内容）★

这是本项目最重要的架构事实，涉及多处文件才能理解：

- **元数据在 MySQL**：`BookTable`、`BookChapterTable`、`BookCommentTable` 等（`models/tables/`），章节内容、评论正文等**不存 DB**。
- **正文内容在本地文件**：`ContentStoreService`（`services/ContentStoreService.kt`）是一个 LSM 风格的日志式存储——追加写 `data.log`（LZ4 压缩，记录头 + 内容），索引 `index.idx`（MessagePack 快照，丢失时可以从 data.log 重建），逻辑删除，`compact()` 用临时文件 + 原子移动整理。路径（`Path(baseDir, name)` 拼接）：章节 `{CONTENT_DIR}/book/{bookId}/`，书评 `{CONTENT_DIR}/comment/book/{bookId}/`，章节评论 `{CONTENT_DIR}/comment/chapter/{chapterId}/`。
- **并发模型**：`ContentStoreManager` 保证同一 `(baseDir, name)` 全局只有一个 `ContentStoreSync` 单元（引用计数），内部 `Mutex`（写写互斥）+ `CoroutineReadWriteLock`（compact 读写隔离）。操作同一本书的内容必须走 `ContentStoreService`（构造即复用同步单元，用完 `.use {}` 释放）。
- **✅ 一致性兜底（Outbox 模式）**：所有"DB 元数据 + 文件内容"双写路径都在**同一个 DB 事务**内写业务行 + `file_sync_outbox` 行（表定义 `models/tables/outbox.kt`；登记入口：各 Service 调 `application.outboxService.write(...)`，`workers/task.kt` 因无 Application 引用用顶层 `enqueueFileSync`，二者等价）。**Channel 事件驱动消费**（`services/OutboxService.kt`）：登记时通过 `StatementInterceptor.afterCommit`（Exposed 提交钩子）在**事务提交后**向 CONFLATED channel 发信号（回滚不发信号），服务启动时 `registerOutboxService()` 即启动监听协程，收到信号立刻批量消费——先落库、后通知，消费者查询必有内容；另保留每分钟 cron 作兜底（覆盖进程重启遗留、信号丢失、多实例场景）。文件操作幂等（update=追加+索引快照覆盖、delete=墓碑），失败自动重试（MAX_RETRY=5），重试耗尽标记 FAILED 待人工介入，SUCCESS 记录保留 7 天后清理。已接入：`AdminService.uploadBookWithTxt`、`AuthorService.updateBookChapter/deleteBookChapter/deleteBook`、`CommentService.createBookReview/upsertLineComment`、`workers/task.kt` 发布时负数章节合并。**已知例外**：封面静态资源（`{STATIC_DIR}/book/{bookId}/cover.webp`）仍是"先 DB 后文件"，未纳入 outbox；`CommentService.deleteLineComment` 存在跨表条件 bug 且未被控制器调用。新增"DB + 文件"双写功能时，必须同事务登记 outbox。
- **封面等静态资源**在 `{STATIC_DIR}/book/{bookId}/cover.webp`，与 DB 也是"先 DB 后文件"。

### 缓存模式

- `CacheService` 提供 `application.cache(...)` / `call.cache(...)`：Redis cache-aside + 分布式锁防击穿（`RenewLock` 看门狗续期 + Lua 释放锁），key 为 `keyPrefix:md5(args)`。
- **缓存不自动失效**：读接口（如 `bookService.getBookChapter`）包了 `cache`，但写接口不会主动删除对应缓存 key——修改缓存相关逻辑时需自行处理失效，或注意短 TTL（默认 300s）。
- Redis 还用于验证码、限流（flaxoos token bucket）、分布式锁（`utils/DistributedLock.kt`）。

## 前端架构要点

- 三个 Vue 应用共享 `@guga-reading/shares`（`useApiXxx` API 封装、`request` 拦截器、`txtParser`）与 `@guga-reading/types`；**前后端字段命名必须保持一致**（如 `userName` vs `username`），改动需两端同步。
- 认证状态用 Pinia store（`user` 端 `useAuthStore`），登录后设置 Axios 全局 `Authorization` 头。
- UI 组件库 `qyani-components` 为本地库，各应用 `.env.local` 的 `QYANI_COMPONENTS_PATH` 可指向本地源码调试。

## 代码规范

- **Kotlin**（`ktorBackend`）：构造函数注入（禁内部实例化依赖）；禁用 `!!`（用 `?.`/`?:`/`requireNotNull`）；资源用 `.use {}`；注释/KDoc 用中文，解释 WHY 不解释 WHAT；公共 API 显式返回类型；消除魔法值；不写占位符（`// TODO`、`NotImplementedError`）。
- **TypeScript**（前端 + packages）：禁 `any`（必要时加 eslint-disable 注释说明）；优先 `interface`；禁 `!`；严格相等 `===`；公共函数显式返回类型；JSDoc 注释。
- **Python**（仅遗留代码改动时）：Ruff（`backend/pyproject.toml`：line-length 88、双引号、isort 分组），PEP 484 类型注解。
- 提交受 husky pre-commit（`pnpm lint-staged`）门禁，格式不过无法提交。

## 测试

- 后端测试在 `ktorBackend/src/test/kotlin/`，使用 `kotlin.test` + `kotlinx-coroutines-test`（`runTest`）；`ServerTest.kt` 用 Ktor `testApplication` 起应用级测试。
- **注意**：`TestContentStoreService` 等涉及 `ContentStoreService` 的测试，`@BeforeTest` 必须调用 `ContentStoreManager.resetForTest()` 清空全局缓存单元，避免用例间交叉影响。

## 部署与 CI/CD

- `docker-compose.yml`：mysql（8.0）、redis（7）、guga_backend（镜像 `guga_backend_ktor:latest`）、guga_frontend（Nginx 托管三个前端）；`nginx.conf` 反向代理 `/api` 与静态资源。
- GitHub Actions（`.github/workflows/docker-image.yml`）：推送 `test_backend`/`test_frontend`/`test_main` 分支触发对应镜像构建，scp + ssh 部署到服务器（数据目录 `/opt/online_reading/`）。
- 手工发布参考根目录 `script.local`。

## Agent 注意事项

- 修改代码前优先用 codegraph 探索目标符号的调用关系（爆炸半径），避免遗漏跨端/跨语言影响（如改后端字段时同步改 `packages/types`）。
- 不要修改 `dist/`、`node_modules/`、`build/`、`.gradle/`、`.ruff_cache/`、`.pytest_cache/` 等生成物目录；不要修改 `backend/` 遗留代码。
- `.env`、`docker-compose.yml` 含真实密钥/凭据：代码中不硬编码敏感信息，也不写入文档或提交。
