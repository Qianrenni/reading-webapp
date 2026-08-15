# GUGA Reading - Online Reading Platform

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/)
[![Vue](https://img.shields.io/badge/vue-3.5+-brightgreen.svg)](https://vuejs.org/)
[![Ktor](https://img.shields.io/badge/ktor-3.5+-blueviolet.svg)](https://ktor.io/)
[![Kotlin](https://img.shields.io/badge/kotlin-2.1+-orange.svg)](https://kotlinlang.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.119+-teal.svg)](https://fastapi.tiangolo.com/)

An online reading platform with multiple roles based on **Ktor / FastAPI + Vue 3**, featuring two backend implementations — Ktor (Kotlin) and FastAPI (Python) — supporting full functionality for users, authors, and administrators.

> **Note**: The primary backend is now `ktorBackend` (Kotlin/Ktor). The legacy FastAPI (Python) backend and its frontend applications (user, author, admin) have been moved to the `release_python_backend` branch.

English | [中文版](./README.zh-CN.md)

## 📖 Project Overview

GUGA Reading is a modern online reading system that provides reading, creation, and management features for novels/books. The system adopts a frontend-backend separation architecture and supports cross-platform access.

### 🌐 Live Previews

- **[User Client](http://49.235.107.221)** – Reading and browsing platform for readers
- **[Author Client](http://49.235.107.221/author/#)** – Creation and management platform for authors
- **[Admin Panel](http://49.235.107.221/admin/#)** – Backend management system for administrators
- **[Android APK](http://49.235.107.221:8000/static/guga.apk)**
- **[Android Repository](https://github.com/Qianrenni/guga-android)**

### ✨ Key Features

- **🎭 Multi‑role Support**: Separate permissions for users, authors, and administrators
- **🤖 Personalized Recommendations**: TF‑IDF based book recommendation engine
- **📱 Real‑time Reading Progress**: Resume reading across multiple devices
- **💬 Rich Interactions**: Favorites, comments, likes, and other social features
- **📝 Complete Content Management**: Full workflow from creation to publication
- **⚡ High‑concurrency Design**: Supports hundreds of concurrent users on a single machine, first‑screen loading < 1s

## 🏗️ System Architecture

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

### Architecture Diagram Notes

- **Frontend Layer**: Three independent Vue 3 applications, each serving a different role
- **Backend Layer**: Ktor (Kotlin) providing RESTful APIs, including multiple service modules
- **Data Layer**: MySQL for persistent storage, Redis for caching acceleration, object storage for file management
- **Legacy Note**: The legacy FastAPI (Python) backend and its frontend apps have been moved to the `release_python_backend` branch

## 📁 Project Structure

```
guga_reading/
├── ktorBackend/                      # **Current primary backend** (Ktor + Kotlin)
│   ├── src/main/kotlin/com/qianrenni/
│   │   ├── controller/               # API route controllers
│   │   ├── services/                 # Business logic service layer
│   │   ├── models/                   # Data models (domain + tables)
│   │   ├── plugins/                  # Plugin configuration (auth, rate limiting, CORS, etc.)
│   │   ├── database/                 # Database and Redis clients
│   │   ├── schemas/                  # Response models
│   │   ├── enums/                    # Enum definitions
│   │   ├── utils/                    # Utility functions
│   │   └── workers/                  # Scheduled tasks
│   ├── build.gradle.kts              # Gradle build configuration
│   └── Dockerfile                    # Docker deployment
│
├── backend/                          # **Legacy backend (FastAPI/Python)** - no longer maintained
│                                      # Moved to `release_python_backend` branch
│   ├── app/
│
├── author/                           # Author client app (Vue 3) [Legacy]
│                                      # Moved to `release_python_backend` branch
│   ├── src/
│   │   ├── components/               # Vue components
│   │   ├── views/                    # Page views
│   │   ├── store/                    # Pinia state management
│   │   ├── config/                   # Configuration files
│   │   └── route.ts                  # Routing configuration
│   ├── public/                       # Public assets
│   ├── package.json
│   └── vite.config.ts
│
├── user/                             # User client app (Vue 3) [Legacy]
│                                      # Moved to `release_python_backend` branch
│   ├── src/
│   │   ├── components/               # Vue components
│   │   ├── views/                    # Page views
│   │   ├── store/                    # Pinia state management
│   │   └── config/                   # Configuration files
│   ├── public/                       # Public assets
│   └── package.json
│
├── admin/                            # Admin panel (Vue 3) [Legacy]
│                                      # Moved to `release_python_backend` branch
│   ├── src/
│   │   └── views/                    # Page views
│   ├── public/                       # Public assets
│   └── package.json
│
├── packages/                         # Shared packages (Monorepo)
│   ├── eslint/                       # ESLint configuration
│   ├── shares/                       # Shared tools and constants
│   └── types/                        # TypeScript type definitions
│
├── .husky/                           # Git Hooks configuration
├── .github/                          # GitHub workflows
├── docker-compose.yml                # Root Docker orchestration
├── nginx.conf                        # Nginx configuration
├── package.json                      # Root pnpm configuration
├── pnpm-workspace.yaml               # pnpm workspace configuration
└── README.md                         # Project documentation
```

> 💡 **Note**: The primary backend is now `ktorBackend` (Ktor + Kotlin). The legacy Python (FastAPI) backend and its frontend apps (user, author, admin) have been moved to the `release_python_backend` branch. This project uses pnpm workspace to manage frontend applications.

## 🎯 Feature Modules

### 👤 User Features

- **🔐 Account Management**: Register/login (phone/email), profile management, password management
- **📚 Content Browsing**: Category browsing, tag filtering, full-text search, book details
- **📖 Reading Experience**: Chapter reading, page turning/swiping, font/background adjustment, night mode
- **💬 Interaction Features**: Bookmarking, follow updates, chapter comments, likes
- **⏱️ Reading Progress**: Auto-sync, resume reading
- **🎯 Personalized Recommendations**: Homepage recommendations, shelf recommendations, “you may like”

### ✍️ Author Features

- **✅ Author Verification**: Online application, approval management
- **📝 Work Management**: Create books, edit information, manage chapters
- **✏️ Content Creation**: Rich text editor, draft system, version management
- **📊 Statistics**: Views, favorites, comments, revenue analysis
- **📤 Upload Support**: EPUB, TXT, and other formats

### 🔧 Admin Features

- **👥 User Management**: User list, muting, banning, author verification approval
- **📚 Content Management**: Book/chapter approval, takedown, comment management, report handling
- **📈 Data Statistics**: Platform data, active users, reading volume statistics
- **⚙️ System Management**: Configuration management, log viewing, category/tag management

## 🛠️ Tech Stack

### Backend Technologies (Current Primary)

| Technology        | Version               | Description                      |
| ----------------- | --------------------- | -------------------------------- |
| **Framework**     | Ktor 3.5.0            | Asynchronous web framework       |
| **Language**      | Kotlin 2.1+           | JVM programming language         |
| **Database**      | MySQL                 | Primary data storage             |
| **Cache**         | Redis 6.4.0           | Caching, rate limiting, sessions |
| **ORM**           | Exposed               | Kotlin ORM framework             |
| **Auth**          | Ktor Auth + JWT       | JWT authentication               |
| **Rate Limiting** | flaxoos-rate-limiting | Redis token bucket algorithm     |
| **Build Tool**    | Gradle + Kotlin DSL   | Project build                    |
| **Deployment**    | Docker                | Containerized deployment         |

### Backend Technologies (Legacy - moved to `release_python_backend` branch)

| Technology          | Version            | Description                  |
| ------------------- | ------------------ | ---------------------------- |
| **Framework**       | FastAPI 0.119.0    | Asynchronous web framework   |
| **Language**        | Python 3.8+        | Programming language         |
| **ORM**             | SQLAlchemy 2.0.44  | Asynchronous ORM             |
| **Recommendation**  | TF-IDF + NumPy     | Personalized recommendations |
| **Task Scheduling** | APScheduler 3.11.2 | Scheduled tasks              |
| **Deployment**      | Gunicorn + Uvicorn | Containerized deployment     |

### Frontend Technologies

| Technology           | Version                | Description                   |
| -------------------- | ---------------------- | ----------------------------- |
| **Framework**        | Vue 3.5.24             | Progressive framework         |
| **Language**         | TypeScript 5.9.3       | Type safety                   |
| **State Management** | Pinia 3.0.4            | Vue 3 official recommendation |
| **Routing**          | Vue Router 4.6.4       | SPA routing                   |
| **UI Components**    | qyani-components 1.5.3 | Custom component library      |
| **Build Tool**       | Vite 7.2.5             | Fast development server       |
| **Charts**           | ECharts 6.0.0          | Data visualization            |
| **HTTP**             | Axios 1.13.6           | HTTP client                   |

### Mobile (Android) Technologies

| Technology        | Version                     | Description                         |
| ----------------- | --------------------------- | ----------------------------------- |
| **Language**      | Kotlin                      | Modern Android development language |
| **UI Framework**  | Jetpack Compose             | Declarative UI framework            |
| **Networking**    | Ktor Client                 | Lightweight HTTP client             |
| **Serialization** | kotlinx.serialization       | JSON serialization                  |
| **Image Loading** | Coil 2.6.0                  | Image loading library               |
| **Navigation**    | Navigation Compose          | Page navigation                     |
| **Storage**       | DataStore + Security Crypto | Secure local storage                |
| **Asynchrony**    | Kotlin Coroutines           | Coroutine support                   |

## 🚀 Quick Start

### Requirements

- **Backend (Ktor)**: JDK 21+, Gradle 8.0+
- **Frontend**: Node.js >= 16.0.0, pnpm >= 8.0.0
- **Database**: MySQL 5.7+
- **Cache**: Redis 5.0+
- **Mobile**: Android Studio Hedgehog+, JDK 11+
- **Legacy Python Backend**: Python 3.8+ (on `release_python_backend` branch)

### Backend Setup (Current Primary - Ktor)

#### Option 1: Local Run

1. **Configure environment variables**

```bash
cd ktorBackend
# Copy and edit the configuration file
cp .env.example .env
# Edit .env to set database, Redis, email, etc.
```

2. **Initialize database**

```bash
# Run SQL initialization script
mysql -u root -p < ktorBackend/database.sql
```

3. **Run the service**

```bash
cd ktorBackend
./gradlew run
```

#### Option 2: Docker Deployment

```bash
cd ktorBackend
docker build -t guga_backend .
docker run -p 8000:8000 guga_backend
```

Access API docs (Swagger UI): http://localhost:8000/swagger

> **Note**: The legacy FastAPI (Python) backend has been moved to the `release_python_backend` branch.

### Frontend Setup

#### Monorepo Management

This project uses pnpm workspace to manage multiple frontend applications.

**Install all dependencies**

```bash
# Run in the root directory
pnpm install
```

**Common commands**

```bash
# Start author client dev server
pnpm dev:author

# Start user client dev server
pnpm dev:user

# Start admin panel dev server
pnpm dev:admin

# Build all frontend apps
pnpm build:all

# Code formatting
pnpm prettier
```

#### Run a single application

**Author client**

```bash
cd author
pnpm install
pnpm dev
# Access http://localhost:80
```

**User client**

```bash
cd user
pnpm install
pnpm dev
```

**Admin panel**

```bash
cd admin
pnpm install
pnpm dev
```

### Android Mobile Setup

1. **Clone the project**

```bash
git clone <repository-url>
cd reading
```

2. **Configure signing (optional, for release builds)**

Add the following to the `local.properties` file:

```properties
storeFile=/path/to/your/keystore.jks
storePassword=your_store_password
keyAlias=your_key_alias
keyPassword=your_key_password
```

3. **Open the project with Android Studio**

- Launch Android Studio
- Select "Open an existing project"
- Choose the `reading` directory
- Wait for Gradle sync to finish

4. **Run the app**

- Connect an Android device or start an emulator
- Click the Run button or press `Shift + F10`
- The app will be installed and launched automatically

5. **Command line builds (optional)**

```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Install to device
./gradlew installDebug
```

APK locations:

- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release.apk`

## 📊 Performance Optimization

### Backend Optimization Strategies

- **💾 Caching**
  - Redis caches popular books, chapter content, recommendation results
  - Real-time caching of user reading progress
  - Distributed rate limiting protects core APIs

- **🗄️ Database Optimization**
  - Index optimization for high‑frequency query fields
  - Read/write separation design
  - Paginated queries to avoid large data loads

- **⚡ Concurrency Handling**
  - Asynchronous I/O improves throughput
  - Distributed locks ensure data consistency
  - Thread pool manages resources

### Frontend Optimization Strategies

- **🚀 Loading Optimization**: Lazy loading routes, asynchronous components
- **🎨 Rendering Optimization**: Virtual lists, debouncing/throttling
- **💿 Cache Optimization**: Local storage, request caching
- **📱 Responsive Design**: Mobile/desktop adaptation

### Android Mobile Optimization

- **🖼️ Image Optimization**: Coil automatic caching and compression
- **📡 Network Optimization**: Ktor connection pooling, request coalescing
- **💾 Local Caching**: DataStore for persistent user preferences
- **🔋 Battery Optimization**: Structured concurrency with coroutines to avoid memory leaks

## 🔒 Security Design

- **🔐 Authentication & Authorization**: JWT tokens + permission checks
- **🛡️ Data Validation**: Protection against SQL injection, XSS attacks
- **⏱️ Rate Limiting**: Redis token bucket algorithm
- **📁 File Security**: Upload file type/content validation
- **📝 Audit Logging**: Tracking of critical operations

## 📈 High Availability Design

- **⚖️ Load Balancing**: Nginx reverse proxy + health checks
- **🔄 Service Redundancy**: MySQL primary‑replica replication, Redis sentinel mode
- **🚑 Failure Recovery**: Auto‑restart, exception monitoring
- **💾 Data Backup**: Scheduled backups, disaster recovery

## 📝 API Documentation

After starting the backend service, visit the following address to view API docs:

- **Swagger UI**: http://localhost:8000/swagger

The API documentation provides complete endpoint descriptions, request parameters, response examples, and online testing.

## 🧪 Testing

### Backend Testing

```bash
cd ktorBackend
./gradlew test
```

> **Legacy backend testing**: Tests for the FastAPI (Python) backend have been moved to the `release_python_backend` branch. To run them:
>
> ```bash
> cd backend
> pytest
> ```

### Frontend Testing

```bash
# Code linting and formatting (root directory)
pnpm prettier

# Single app linting
cd author
pnpm run lint
```

### Android Testing

```bash
# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest

# Generate test report
./gradlew jacocoTestReport
```

## 📦 Deployment Architecture

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

### Mobile Architecture

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

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow the existing code style of the project
- Add necessary comments and documentation
- Ensure tests pass
- Keep commit messages clear and concise

## 📄 License

ISC License

## 👥 Contact

- **Author**: qianrenni
- **Email**: 2112183503@qq.com

---

**Note**: This project is for learning and communication purposes only. Do not use for commercial purposes.
