# GUGA Reading - Online Reading Platform (Frontend)

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/vue-3.5+-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-7+-646cff.svg)](https://vitejs.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10+-f69220.svg)](https://pnpm.io/)
[![Vitest](https://img.shields.io/badge/vitest-4+-6b9f3a.svg)](https://vitest.dev/)

An online reading platform with multiple roles — reader, author, administrator. This repository is the **web frontend**: a pnpm monorepo of three **Vue 3 + TypeScript** applications (`app/*`) sharing a set of workspace packages (`packages/*`).

> **Note**: The backend is a **separate repository** built with Ktor (Kotlin). The legacy FastAPI (Python) backend and its old frontends were moved to the `release_python_backend` branch and are no longer maintained here.

English | [中文版](./README.zh-CN.md)

## 📖 Project Overview

GUGA Reading is a modern online reading system providing reading, creation, and management features for novels/books. It adopts a frontend-backend separation architecture with three role-specific web clients:

- **User client** — browse, search, and read books
- **Author client** — create and manage books/chapters
- **Admin panel** — platform administration, review, and statistics

### 🌐 Live Previews

- **[User Client](http://49.235.107.221)** – Reading and browsing platform for readers
- **[Author Client](http://49.235.107.221/author/#)** – Creation and management platform for authors
- **[Admin Panel](http://49.235.107.221/admin/#)** – Backend management system for administrators
- **[Android APK](http://49.235.107.221:8000/static/guga.apk)**
- **[Android Repository](https://github.com/Qianrenni/guga-android)**

### ✨ Key Features

- **🎭 Multi-role Support**: Separate UIs and permissions for users, authors, and administrators
- **📱 Cross-device Reading Progress**: Auto-sync and resume reading across multiple devices
- **💬 Rich Interactions**: Favorites, comments, likes, and other social features
- **📝 Complete Content Workflow**: From creation and drafts to review and publication
- **📚 Content Discovery**: Category/tag filtering, full-text search, personalized recommendations
- **⚡ High-concurrency Design**: First-screen load < 1s, supporting hundreds of concurrent users
- **🧩 pnpm Monorepo**: Three apps share types, API wrappers, UI components, and build config

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  GUGA Reading (Frontend)                      │
│  pnpm monorepo                                               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                  │
│  │ app/user  │ │ app/author│ │ app/admin │   Vue 3 + TS     │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                  │
│        └─────────────┼─────────────┘                         │
│   packages: types · shares · ui · config · eslint            │
└───────────┬──────────────────────────────────────────────────┘
            │ HTTP (Axios, /api)
┌───────────▼──────────────────────────────────────────────────┐
│  Backend — Ktor (Kotlin)  [separate repository]              │
│  Auth / Permissions / Book / Shelf / Statistics / Outbox     │
└───────────┬──────────────────────────────────────────────────┘
      ┌─────┴─────┐      ┌─────┴─────┐      ┌───────────────┐
      │   MySQL   │      │   Redis   │      │  File Store   │
      │  metadata │      │  cache    │      │ content/static│
      └───────────┘      └───────────┘      └───────────────┘
```

### Architecture Notes

- **Frontend layer**: Three independent Vue 3 apps under `app/`, each serving a different role; shared logic lives in `packages/`.
- **Backend layer**: Ktor (Kotlin) REST API in a separate repository; this repo talks to it through the `@guga-reading/shares` API layer.
- **Data layer**: MySQL stores metadata, Redis caches hot data, and file storage keeps chapter content and static assets.

## 📁 Repository Structure

```
guga_reading/
├── app/                             # Three frontend applications
│   ├── user/                        # User client (@guga-reading/user)
│   ├── author/                      # Author client (@guga-reading/author)
│   └── admin/                       # Admin panel (@guga-reading/admin)
├── packages/                        # Shared workspace packages
│   ├── types/                       # Shared TS types (@guga-reading/types)
│   ├── shares/                      # API wrappers / stores / app assembly (@guga-reading/shares)
│   ├── ui/                          # Shared business components + global styles (@guga-reading/ui)
│   ├── config/                      # Vite preset (@guga-reading/config)
│   └── eslint/                      # ESLint config (@qyani/eslint-config)
├── .husky/                          # Git hooks (Prettier + ESLint pre-commit)
├── .github/                         # CI workflows
├── docker-compose.yml               # mysql + redis + backend + nginx frontend
├── Dockerfile
├── nginx.conf                       # Serves the three apps and proxies /api
├── package.json                     # Root pnpm config
├── pnpm-workspace.yaml              # Workspace: packages/* + app/*
└── AGENTS.md                        # Coding assistant guide
```

> Each app's `node_modules` is installed independently (not workspace symlinks), so changes to `packages/*` take effect only after rebuilding them (see `pnpm types` below).

## 📦 Shared Packages

| Package           | Name                   | Purpose                                                                                                                                                          |
| ----------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/types`  | `@guga-reading/types`  | Frontend/backend shared TypeScript types — the single source of truth for field naming                                                                           |
| `packages/shares` | `@guga-reading/shares` | `useApiXxx` API wrappers, `request` interceptor, shared stores (`useAuthStore`/`useMenuStore`), app assembly factory `setupGugaApp`                              |
| `packages/ui`     | `@guga-reading/ui`     | author/admin shared business components (`EditableTitle`/`ContentEditor`/`HeaderNavigation`/`SiderBar`/`LoginView`, **named exports only**) + global `style.css` |
| `packages/config` | `@guga-reading/config` | Unified Vite preset `createGugaViteConfig` (alias, chunking, plugins)                                                                                            |
| `packages/eslint` | `@qyani/eslint-config` | Shared ESLint configuration                                                                                                                                      |

> **After modifying any shared package, run `pnpm types`** (rebuild order: types → shares → ui) so the three apps pick up the changes.

## 🎯 Feature Modules

### 👤 User Features

- **🔐 Account**: Register/login (phone/email), profile, password management
- **📚 Content Discovery**: Category browsing, tag filtering, full-text search, book details
- **📖 Reading Experience**: Chapter reading, paging/swiping, font/background adjustment, night mode
- **💬 Interactions**: Favorites, follow updates, chapter comments, likes
- **⏱️ Reading Progress**: Auto-sync and resume reading across devices
- **🎯 Personalized Recommendations**: Homepage, shelf, and "you may like"

### ✍️ Author Features

- **✅ Author Verification**: Online application and approval management
- **📝 Work Management**: Create books, edit info, manage chapters
- **✏️ Content Creation**: Rich-text editor, drafts, version management
- **📊 Statistics**: Views, favorites, comments, revenue analysis
- **📤 Upload Support**: EPUB, TXT, and other formats

### 🔧 Admin Features

- **👥 User Management**: User list, muting, banning, author verification approval
- **📚 Content Management**: Book/chapter review, takedown, comment moderation, report handling
- **📈 Data Statistics**: Platform data, active users, reading volume
- **⚙️ System Management**: Config, logs, category/tag management

## 🛠️ Tech Stack

### Frontend (this repository)

| Technology           | Version                                  | Description                       |
| -------------------- | ---------------------------------------- | --------------------------------- |
| **Framework**        | Vue 3.5                                  | Progressive framework             |
| **Language**         | TypeScript 5.9                           | Type safety                       |
| **Build tool**       | Vite 7                                   | Fast dev server & bundler         |
| **State management** | Pinia 3                                  | Vue 3 official store              |
| **Routing**          | Vue Router 4.6                           | SPA routing                       |
| **UI library**       | qyani-components 1.6.3 + @qianrenni/core | Local component library           |
| **HTTP**             | Axios 1.13                               | HTTP client                       |
| **Charts**           | ECharts 6                                | Data visualization (author/admin) |
| **Utilities**        | @vueuse/core 14                          | Composition utilities             |
| **Testing**          | Vitest 4 + Playwright                    | Unit + browser component tests    |
| **Monorepo**         | pnpm workspace                           | packages/_ + app/_                |

### Backend (separate repository)

| Technology                | Description                              |
| ------------------------- | ---------------------------------------- |
| **Ktor 3.5 + Kotlin 2.1** | Async web framework (JVM)                |
| **Exposed**               | Kotlin ORM                               |
| **MySQL / Redis**         | Metadata storage / cache & rate limiting |
| **Ktor Auth + JWT**       | Authentication & permission checks       |
| **Docker**                | Containerized deployment                 |

> API docs (Swagger): `http://localhost:8000/swagger` (when the backend is running locally).

### Legacy (branch `release_python_backend`)

The old FastAPI (Python) backend and its accompanying Vue frontends were moved out of this repository; they are no longer maintained.

## 🚀 Quick Start

### Requirements

- **Node.js** ≥ 20.19 (required by Vite 7)
- **pnpm** ≥ 9 (the workspace uses `pnpm@10.28.1`)
- **Docker** (optional, for full-stack deployment via `docker-compose.yml`)

### Install dependencies

```bash
# Run in the repository root
pnpm install
```

### Common commands

```bash
# ★ Rebuild shared packages after modifying packages/ (order: types → shares → ui)
pnpm types

# Start a dev server for one app
pnpm dev:user
pnpm dev:author
pnpm dev:admin

# Build all three apps
pnpm build:all

# Run all tests (node logic + browser rendering, recursive over all packages)
pnpm test

# Full type check: build shared packages + sources + tests
pnpm type:check
pnpm type:check:test        # tests only

# Format all code
pnpm prettier
```

### Run a single app

```bash
pnpm --filter @guga-reading/user run dev
# or
cd app/user && pnpm install && pnpm dev
```

> The user/author/admin apps install their own `node_modules` independently — changes in `packages/*` only propagate after `pnpm types` (and `pnpm install` if new dependencies were added).

## 🧪 Testing

Frontend testing uses **Vitest** across every `packages/*` and `app/*` package, with two environments per package (`test.projects` + `extends`):

- **node**: logic / composable / store / API tests (DOM-dependent files opt in with a `// @vitest-environment jsdom` header)
- **browser**: component rendering tests (`*.render.test.ts`) via Playwright + chromium + `vitest-browser-vue`

```bash
# All packages
pnpm test

# Single package
pnpm --filter @guga-reading/shares run test

# Coverage
pnpm test:coverage
```

> Run `npx playwright install chromium` before the browser tests. Test files sit next to the code under test; pure logic inside components is extracted into same-directory `composable.ts` files so it can be tested.

## 🐳 Deployment

### Full stack (docker-compose)

`docker-compose.yml` starts four services:

- `mysql` (8.0) — metadata storage
- `redis` (7) — cache / rate limiting
- `guga_backend` — backend image `guga_backend_ktor:latest` (built from the separate backend repository)
- `guga_frontend` — Nginx hosting the three built apps

`nginx.conf` maps `/` → user app, `/author/` → author app, `/admin/` → admin app, and proxies `/api` to the backend.

### Frontend-only build & manual deploy

```bash
pnpm build:all
# scp app/{user,author,admin}/dist to the server (see script.local)
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Code standards (see `AGENTS.md` for details): no `any`, prefer `interface`, strict equality `===`, explicit return types on public functions, JSDoc comments; `pnpm lint-staged` runs automatically on commit.

## 📄 License

ISC License

## 👥 Contact

- **Author**: qianrenni
- **Email**: 2112183503@qq.com

---

**Note**: This project is for learning and communication purposes only. Do not use for commercial purposes.
