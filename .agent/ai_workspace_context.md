# Quick Queue — AI Context & Workspace Tracking

## 📌 Project Overview

**Quick Queue** (v1.2.2) คือระบบจัดการคิวแบบ Full-Stack สำหรับร้านค้า/ธุรกิจ ที่สร้างด้วย **Next.js 16 (App Router)** ตาม **Clean Architecture** อย่างเคร่งครัด — **UI ทั้งหมดเป็นภาษาไทย**

ระบบมี 3 ส่วนหลัก:
1. **ฝั่งลูกค้า (Public)** — หน้าแรก (Home), หน้าเช็คคิว (Queue), หน้าจอแสดงคิว (Display), หน้าขอบัตรคิว (Display/Request), ติดตามคิว (Track), ข้อมูลร้านค้า (Shop)
2. **ฝั่ง Admin** — Dashboard, จัดการคิว (Queues), คำขอคิวที่รอ (Pending Requests)
3. **ฝั่ง Admin Kiosk** — หน้าจอปฏิบัติการสำหรับพนักงานเคาน์เตอร์ โหมดเต็มจอ เรียก/จัดการคิวแบบ Real-time

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Core** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Glassmorphism, Custom Color Tokens |
| **State** | Zustand (Template, Admin Layout, Tracking History persistence ใน localStorage) |
| **Animations** | React Spring (Physics-based micro-animations) |
| **Database** | SQLite (local, via `@libsql/client`) / Turso (production, cloud edge) |
| **Auth** | Session-based (SHA-256 password hash, HTTP-only cookie `qq_session`) |
| **Others** | `qrcode.react` (QR Code), `uuid` (ID generation), `next-themes` (Dark/Light), `lucide-react` (Icons) |

---

## 🏗 Architecture (Clean Architecture — 4 Layers)

```mermaid
graph TB
    subgraph "Presentation Layer"
        Pages["App Router Pages<br/>(/, /queue, /admin, /display, /track, /shop)"]
        Views["Views<br/>(HomeView, QueueView, AdminView, DisplayView, TrackView, ShopView, AdminKioskView)"]
        Templates["Templates<br/>(Classic, Editorial, RetroTechMagazine)"]
        Hooks["Hooks<br/>(useTemplate, useQueueSoundAlert, useAdminLayoutStore, useTrackingHistory)"]
        Presenters["Presenters<br/>(HomePresenter, QueuePresenter, AdminPresenter, DisplayPresenter)"]
    end

    subgraph "Application Layer"
        IQueueItemRepo["IQueueItemRepository"]
        IQueueRequestRepo["IQueueRequestRepository"]
        IAuthRepo["IAuthRepository"]
    end

    subgraph "Domain Layer"
        Entities["Entities<br/>(QueueItem, QueueStats, ShopConfig)"]
        Enums["Enums<br/>(QueueStatus, ServiceType)"]
        DTOs["DTOs<br/>(CreateQueueItemData, UpdateQueueItemData, CreateQueueRequestData)"]
    end

    subgraph "Infrastructure Layer"
        TursoRepo["TursoQueueItemRepository"]
        TursoReqRepo["TursoQueueRequestRepository"]
        TursoAuth["TursoAuthRepository"]
        ApiRepo["ApiQueueItemRepository"]
        ApiReqRepo["ApiQueueRequestRepository"]
        ApiAuth["ApiAuthRepository"]
        DB["Turso / SQLite Database"]
        Session["Session Management"]
    end

    Pages --> Views
    Views --> Templates
    Views --> Presenters
    Presenters --> IQueueItemRepo
    Presenters --> IQueueRequestRepo
    Presenters --> IAuthRepo
    IQueueItemRepo -.-> TursoRepo
    IQueueItemRepo -.-> ApiRepo
    IQueueRequestRepo -.-> TursoReqRepo
    IQueueRequestRepo -.-> ApiReqRepo
    IAuthRepo -.-> TursoAuth
    IAuthRepo -.-> ApiAuth
    TursoRepo --> DB
    TursoReqRepo --> DB
    TursoAuth --> DB
    TursoAuth --> Session
    Entities --> IQueueItemRepo
    Enums --> Entities
    DTOs --> IQueueItemRepo
```

### Layer Details

| Layer | Path | หน้าที่ |
|---|---|---|
| **Domain** | `src/domain/` | Entity types, Enums (QueueStatus, ServiceType), Static configs — ไม่พึ่งพา framework ใดๆ |
| **Application** | `src/application/` | Interface definitions (IQueueItemRepository, IQueueRequestRepository, IAuthRepository) — กำหนด contract |
| **Infrastructure** | `src/infrastructure/` | DB driver (Turso/libSQL), Auth session, Repository implementations (Turso, API, Mock) |
| **Presentation** | `src/presentation/` | React components, Views, Presenters (ViewModel pattern), Hooks, Templates |
| **Config** | `src/config/` | Static configs: `shop.config.ts` (ชื่อร้าน, เวลาเปิดปิด), `queue-display.config.ts` (format เลขคิว), `queue-form.config.ts` (preset ชื่อ/หมายเหตุ) |

---

## ✨ Features ทั้งหมด

### 1. ระบบจัดการคิว (Queue Management)
- **สร้างคิว** — Admin สร้างคิวใหม่โดยกรอกชื่อลูกค้า, ประเภทบริการ, หมายเหตุ
- **อัปเดตสถานะ** — เปลี่ยนสถานะคิว: รอคิว → กำลังให้บริการ → เสร็จแล้ว / ยกเลิก
- **ลบคิว** — ลบรายการคิวทีละรายการ หรือล้างทั้งหมด
- **หมายเลขคิวอัตโนมัติ** — ระบบกำหนดหมายเลขคิวถัดไปให้อัตโนมัติ (MAX + 1)
- **Pagination** — รองรับ pagination สำหรับรายการคิวจำนวนมาก
- **Filter by Status** — กรองรายการตามสถานะ (all, waiting, in_progress, completed, cancelled)

### 2. Admin Kiosk Mode (จอปฏิบัติการ)
- **โหมดเต็มจอ** — แสดงสถานะคิวปัจจุบัน, คิวถัดไป, รายการรอ ในมุมมองเดียว — ออกแบบสำหรับใช้บนเคาน์เตอร์
- **เรียกคิวถัดไป (CALL.NEXT)** — กดปุ่มเดียวเรียกคิวรอถัดไปมาให้บริการ
- **Walk-In** — สร้างคิว Walk-In แบบด่วน
- **เสร็จสิ้น / ข้าม** — กดเสร็จสิ้นหรือข้ามคิวที่กำลังให้บริการ
- **Hero Card** — แสดงคิวที่กำลังให้บริการล่าสุดแบบเด่นชัด พร้อม Service Type Badge
- **Responsive สำหรับ iPad** — ปรับ Layout สำหรับ iPad portrait mode (breakpoint `lg:`)
- **Route**: `/admin/kiosk`

### 3. ระบบแสดงผลสำหรับลูกค้า (Public Display)
- **หน้าแรก (Home `/`)** — แสดงหมายเลขคิวปัจจุบันที่กำลังให้บริการ, สถิติ, เวลาประมาณ, รายการล่าสุด 10 รายการ
- **หน้าเช็คคิว (Queue `/queue`)** — แสดงรายการคิวแยกตามสถานะ: กำลังให้บริการ, รอคิว, เสร็จแล้ว (สูงสุด 20 รายการ/สถานะ)
- **หน้าจอแสดงคิว (Display `/display`)** — หน้าจอเต็มจอสำหรับจอ TV/Monitor แสดงคิวปัจจุบัน, คิวถัดไป, จำนวนรอ, รายการรอ, คิวที่เรียกแล้ว, พร้อมเสียง Alert + ลิงก์ไปขอบัตรคิว/ตรวจสอบคิว
- **หน้าขอบัตรคิว (Display Request `/display/request`)** — ฟอร์ม 3 ขั้นตอน: กรอกข้อมูล → ยืนยันตัวตน (Math Challenge) → ตรวจสอบ/ส่ง พร้อมหน้า Success แสดง Tracking Code + QR Code
- **หน้าติดตามคิว (Track `/track`)** — ตรวจสอบสถานะคำขอคิวผ่านรหัส 6 หลัก พร้อมระบบบันทึกประวัติ (Zustand → localStorage)
- **หน้าข้อมูลร้าน (Shop `/shop`)** — แสดงข้อมูลร้าน, เวลาเปิดปิด, QR Code สำหรับเข้าถึง
- **ระบบขอบัตรคิว (Queue Request)** — ลูกค้ากดขอบัตรคิวได้ พร้อมระบบป้องกันบอท (Math Challenge + IP Rate Limiting)
- **QR Code** — แสดง QR Code สำหรับลูกค้าสแกน
- **Sound Alert** — เสียงแจ้งเตือนเมื่อมีการอัปเดตคิว พร้อม AudioInteractionOverlay
- **Queue Item Detail Modal** — คลิกรายการคิวเพื่อดูรายละเอียด

### 4. ระบบ Template หลายรูปแบบ (Multi-Template System)
- **3 Templates Mood & Tone**:
  1. **Classic Mode**: เน้นความทันสมัย สะอาดตา ใช้งานง่าย (Modern UI / Apple-like) ใช้ความโค้งมน, แสงเงานุ่มนวล, Glassmorphism
  2. **Editorial Mode**: เน้นความเรียบหรู คอนทราสต์จัดจ้าน อารมณ์นิตยสาร (Minimalist / Brutalism) ใช้โทนขาว-ดำ, ขอบเส้นหนา, ฟอนต์ Serif + Sans-serif
  3. **RetroTechMagazine Mode**: สไตล์ Y2K / Cyberpunk ยุค 90s/00s ใช้สีนีออน (Cyan, Magenta, Lime Green), ฟอนต์ Mono, Hard Shadows, UI แนว Terminal/Console
- **ค่าเริ่มต้น**: `retroTechMagazine`
- **สลับได้ทันที** ผ่าน TemplateSwitcher (ใช้ Zustand persist ลง localStorage key `app-template-storage`)
- **ทุก component มีเวอร์ชันของแต่ละ Template** — แยก file เช่น `HomeClassicTemplate.tsx`, `HomeEditorialTemplate.tsx`, `HomeRetroTechMagazineTemplate.tsx`
- **Template ครอบคลุมทุกส่วน**: Home, Queue, Admin, Admin Kiosk, Display, Display Request, Track, Shop, Shared components (QRModal, QueueItemDetailModal, etc.)

### 5. ระบบ Authentication
- **Login** — Admin login ด้วย username/password
- **Session** — ใช้ HTTP-only cookie (`qq_session`) อายุ 24 ชม.
- **LoginGate** — Client-side component ตรวจสอบ session ก่อนแสดงหน้า Admin
- **Dual-Layer Security** — API routes ตรวจ session cookie + Middleware ป้องกันที่ edge

### 6. Dark/Light Mode
- รองรับ Dark/Light color scheme ผ่าน `next-themes`
- Color tokens ในทุก component รองรับทั้ง 2 โหมด

### 7. Animations
- **React Spring** — Physics-based animations สำหรับ modals, buttons, counters
- **AnimatedButton** — ปุ่มที่มี spring animation
- **AnimatedCounter** — ตัวเลขที่เปลี่ยนแบบ animated
- **FadeInSection** — Section ที่ fade in เมื่อ scroll เข้ามา

### 8. Thai Localization (ภาษาไทย)
- **UI ทั้งหมดเป็นภาษาไทย** — ปุ่ม, ป้ายกำกับ, ข้อความสถานะ, ข้อผิดพลาด, ข้อความว่าง ทั้งหมดเป็นภาษาไทย
- **เก็บ Jargon เฉพาะ** — คำเฉพาะบางคำเก็บไว้เป็นภาษาอังกฤษตามสไตล์ของ Template (เช่น `CALL.NEXT()`, `WALK_IN.ADD()`, `GENERAL`, `EXPRESS`, `VIP`, `CONFIRM_`)

### 9. Database CLI Scripts
| Command | หน้าที่ |
|---|---|
| `yarn db:migrate` | สร้าง schema (tables + indexes) |
| `yarn db:seed:starter` | สร้าง admin user เริ่มต้น (admin/admin) |
| `yarn db:seed:mock` | สร้างข้อมูล mock 1,000 รายการ |
| `yarn db:reset` | ล้าง DB + seed starter |
| `yarn db:reset:mock` | ล้าง DB + seed mock data |
| `yarn db:password` | เปลี่ยนรหัสผ่าน admin |

---

## 🗄 Database Schema

ใช้ **SQLite** (local) หรือ **Turso** (production) ผ่าน `@libsql/client`

```mermaid
erDiagram
    queue_items {
        TEXT id PK "UUID"
        INTEGER queue_number "NOT NULL"
        TEXT customer_name "NOT NULL"
        TEXT service_type "CHECK(general|express|vip)"
        TEXT status "DEFAULT waiting, CHECK(waiting|in_progress|completed|cancelled)"
        TEXT note "DEFAULT ''"
        TEXT created_at "DEFAULT datetime('now')"
        TEXT updated_at "DEFAULT datetime('now')"
    }

    admin_users {
        TEXT id PK "UUID"
        TEXT username "NOT NULL, UNIQUE"
        TEXT password_hash "NOT NULL, SHA-256"
        TEXT display_name "NOT NULL"
        TEXT created_at "DEFAULT datetime('now')"
    }

    sessions {
        TEXT token PK "crypto.randomBytes(32)"
        TEXT user_id FK "REFERENCES admin_users(id) ON DELETE CASCADE"
        TEXT created_at "DEFAULT datetime('now')"
        TEXT expires_at "NOT NULL, +24h"
    }

    admin_users ||--o{ sessions : "has many"

    queue_requests {
        TEXT id PK "UUID"
        TEXT tracking_code "UNIQUE, 6 chars"
        TEXT customer_name "NOT NULL"
        TEXT service_type "CHECK(general|express|vip)"
        TEXT status "DEFAULT pending, CHECK(pending|approved|rejected)"
        TEXT note
        TEXT reject_reason
        INTEGER queue_number "FK -> queue_items(queue_number)"
        TEXT created_at "DEFAULT datetime('now')"
        TEXT updated_at "DEFAULT datetime('now')"
    }
```

### Indexes
- `idx_queue_items_status` — เร่ง query ตาม status
- `idx_queue_items_queue_number` — เร่ง query ตาม queue_number
- `idx_sessions_user_id` — เร่ง join sessions → admin_users
- `idx_sessions_expires_at` — เร่ง expire check

---

## 🔌 API Routes

### Auth Routes

| Method | Route | Auth | หน้าที่ |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Login → สร้าง session → set HTTP-only cookie |
| POST | `/api/auth/logout` | ❌ | Logout → ลบ session จาก DB + clear cookie |
| GET | `/api/auth/me` | ✅ | ตรวจสอบ session ปัจจุบัน → return user info |

### Queue Items Routes

| Method | Route | Auth | หน้าที่ |
|---|---|---|---|
| GET | `/api/queue-items` | ❌ | ดึงรายการคิว (all หรือ paginated + filter by status) |
| POST | `/api/queue-items` | ✅ | สร้างคิวใหม่ |
| DELETE | `/api/queue-items` | ✅ | ล้างคิวทั้งหมด |
| GET | `/api/queue-items/[id]` | ❌ | ดึงคิวตาม ID |
| PUT | `/api/queue-items/[id]` | ✅ | อัปเดตคิว (status, name, type, note) |
| DELETE | `/api/queue-items/[id]` | ✅ | ลบคิวตาม ID |
| GET | `/api/queue-items/stats` | ❌ | สถิติคิว (total, waiting, in_progress, completed, cancelled) |
| GET | `/api/queue-items/next-number` | ❌ | หมายเลขคิวถัดไป |
| GET | `/api/queue-items/current-serving` | ❌ | หมายเลขคิวที่กำลังให้บริการ |
| GET | `/api/queue-items/by-status` | ❌ | ดึงคิวแยกตามสถานะ (serving, waiting, completed) |
| GET | `/api/queue-items/performance` | ❌ | ข้อมูล Performance (เวลารอเฉลี่ย ฯลฯ) |
| GET | `/api/queue-items/recent-activity` | ❌ | รายการ Activity ล่าสุด |

### Queue Requests Routes (ระบบขอบัตรคิวออนไลน์)

| Method | Route | Auth | หน้าที่ |
|---|---|---|---|
| POST | `/api/queue-requests` | ❌ | ลูกค้าขอบัตรคิว (Math Challenge + IP Rate Limit) |
| GET | `/api/queue-requests` | ✅ | Admin ดึงรายการคำขอที่รอ (pending) |
| PUT | `/api/queue-requests/[id]` | ✅ | Admin อนุมัติ/ปฏิเสธ คำขอ |
| GET | `/api/queue-requests/track/[code]` | ❌ | เช็คสถานะคำขอผ่าน Tracking Code |
| GET | `/api/queue-requests/challenge` | ❌ | รับโจทย์คณิตศาสตร์ (ป้องกัน Bot) |

---

## 🔄 Workflow Diagrams

### Flow 1: Queue Lifecycle (สถานะคิว)

```mermaid
stateDiagram-v2
    [*] --> waiting: Admin สร้างคิวใหม่
    waiting --> in_progress: Admin กดเรียกคิว
    waiting --> cancelled: Admin ยกเลิกคิว
    in_progress --> completed: Admin กดเสร็จสิ้น
    in_progress --> cancelled: Admin ยกเลิกคิว
    completed --> [*]
    cancelled --> [*]

    waiting: ⏳ รอคิว (waiting)
    in_progress: 🔄 กำลังให้บริการ (in_progress)
    completed: ✅ เสร็จแล้ว (completed)
    cancelled: ❌ ยกเลิก (cancelled)
```

### Flow 2: Admin Login & Queue Management

```mermaid
sequenceDiagram
    actor Admin as 👤 Admin
    participant LG as LoginGate
    participant API as API Routes
    participant Auth as TursoAuthRepository
    participant DB as SQLite / Turso

    Admin->>LG: เข้าหน้า /admin
    LG->>API: GET /api/auth/me (cookie)
    API->>Auth: validateSession(token)
    Auth->>DB: SELECT sessions JOIN admin_users

    alt Session Valid
        DB-->>Auth: User data
        Auth-->>API: AuthUser
        API-->>LG: { user }
        LG-->>Admin: แสดงหน้า Admin Dashboard
    else Session Invalid / No Cookie
        DB-->>Auth: null
        Auth-->>API: null
        API-->>LG: 401
        LG->>Admin: แสดงฟอร์ม Login
        Admin->>LG: กรอก username + password
        LG->>API: POST /api/auth/login
        API->>Auth: login(credentials)
        Auth->>DB: SELECT admin_users WHERE hash match
        Auth->>DB: INSERT session (token, 24h expiry)
        DB-->>Auth: session created
        Auth-->>API: AuthUser
        API-->>LG: Set cookie qq_session + { user }
        LG-->>Admin: แสดงหน้า Admin Dashboard
    end
```

### Flow 3: สร้างคิวใหม่ (Create Queue Item)

```mermaid
sequenceDiagram
    actor Admin as 👤 Admin
    participant UI as AdminView
    participant Modal as CreateQueueModal
    participant API as POST /api/queue-items
    participant Session as requireAuth()
    participant Repo as TursoQueueItemRepository
    participant DB as SQLite / Turso

    Admin->>UI: กดปุ่ม "สร้างคิวใหม่"
    UI->>Modal: เปิด CreateQueueModal
    Admin->>Modal: กรอก ชื่อลูกค้า, ประเภท, หมายเหตุ
    Admin->>Modal: กดยืนยัน
    Modal->>API: POST { customerName, serviceType, note }
    API->>Session: ตรวจสอบ cookie qq_session
    Session-->>API: ✅ Valid user
    API->>Repo: create(data)
    Repo->>DB: SELECT MAX(queue_number) → nextNumber
    Repo->>DB: INSERT INTO queue_items
    DB-->>Repo: Queue item created
    Repo-->>API: QueueItem
    API-->>Modal: 201 { QueueItem }
    Modal-->>UI: ปิด Modal + refresh data
    UI-->>Admin: แสดงคิวใหม่ในตาราง
```

### Flow 4: ลูกค้าเช็คคิว (Customer View)

```mermaid
sequenceDiagram
    actor Customer as 👤 ลูกค้า
    participant Home as หน้าแรก (/)
    participant Queue as หน้าเช็คคิว (/queue)
    participant ServerPresenter as HomePresenter / QueuePresenter
    participant Repo as TursoQueueItemRepository
    participant DB as SQLite / Turso

    Customer->>Home: เข้าหน้าแรก
    Home->>ServerPresenter: getViewModel()
    ServerPresenter->>Repo: getPaginated(1, 10) + getStats() + getCurrentServingNumber()
    Repo->>DB: SELECT queries
    DB-->>Repo: data
    Repo-->>ServerPresenter: results
    ServerPresenter-->>Home: HomeViewModel
    Home-->>Customer: แสดงหมายเลขคิวปัจจุบัน + สถิติ + เวลาประมาณ

    Customer->>Queue: กดไปหน้าเช็คคิว
    Queue->>ServerPresenter: getViewModel()
    ServerPresenter->>Repo: getPaginated(waiting/in_progress/completed, 20 each) + getStats()
    Repo->>DB: SELECT queries
    DB-->>Repo: data
    Repo-->>ServerPresenter: results
    ServerPresenter-->>Queue: QueueViewModel
    Queue-->>Customer: แสดงรายการคิวแยกตามสถานะ
```

### Flow 5: ระบบขอบัตรคิวออนไลน์ (Online Queue Request)

```mermaid
sequenceDiagram
    actor Customer as 👤 ลูกค้า
    actor Admin as 👤 Admin
    participant Home as หน้าแรก (/)
    participant Track as หน้าติดตาม (/track)
    participant API as API Routes
    participant Repo as TursoQueueRequestRepository
    participant DB as SQLite / Turso

    Customer->>Home: กดปุ่ม "ขอบัตรคิว"
    Home->>API: GET /api/queue-requests/challenge
    API-->>Home: { question, token }
    Customer->>Home: กรอกข้อมูล + แก้โจทย์เลข
    Home->>API: POST /api/queue-requests
    API->>Repo: create(data) -> สร้าง Tracking Code 6 หลัก
    Repo->>DB: INSERT INTO queue_requests
    API-->>Home: { trackingCode }
    Home-->>Customer: บันทึก Tracking Code ลง Zustand (localStorage)

    Customer->>Track: เช็คสถานะด้วย Tracking Code
    Track->>API: GET /api/queue-requests/track/[code]
    API->>Repo: findByTrackingCode(code)
    API-->>Track: status (pending | approved | rejected)
    
    Admin->>API: GET /api/queue-requests (AdminView)
    API->>Repo: findPending()
    API-->>Admin: แสดงรายการคำขอที่รอดำเนินการ
    
    alt อนุมัติ
        Admin->>API: PUT /api/queue-requests/[id] { action: 'approve' }
        API->>DB: INSERT queue_items (สร้างคิวจริง)
        API->>DB: UPDATE queue_requests (status=approved, link to queue)
    else ปฏิเสธ
        Admin->>API: PUT /api/queue-requests/[id] { action: 'reject', reason }
        API->>DB: UPDATE queue_requests (status=rejected, add reason)
    end
```

### Flow 6: Template Switching

```mermaid
flowchart LR
    A["TemplateSwitcher"] -->|"toggleTemplate()"| B["Zustand Store"]
    B -->|"persist"| C["localStorage<br/>(app-template-storage)"]
    B -->|"template state"| D{"Current Template?"}
    D -->|"classic"| E["ClassicTemplate"]
    D -->|"editorial"| F["EditorialTemplate"]
    D -->|"retroTechMagazine"| G["RetroTechMagazineTemplate"]

    E --> H["ClassicLayout"]
    F --> I["EditorialLayout"]
    G --> J["RetroTechMagazineLayout"]
```

### Flow 7: Repository Pattern (Dependency Injection)

```mermaid
flowchart TB
    subgraph "Server-Side (API Routes / Pages)"
        ServerFactory["PresenterServerFactory"]
        ServerFactory -->|"creates"| Presenter["Presenter"]
        Presenter -->|"uses"| RepoFactory["RepositoryFactory"]
        RepoFactory -->|"returns"| TursoImpl["TursoQueueItemRepository<br/>(Direct DB access)"]
    end

    subgraph "Client-Side (React Components)"
        ClientFactory["PresenterClientFactory"]
        ClientFactory -->|"creates"| PresenterC["Presenter"]
        PresenterC -->|"uses"| RepoFactoryC["RepositoryFactory"]
        RepoFactoryC -->|"returns"| ApiImpl["ApiQueueItemRepository<br/>(fetch API routes)"]
    end

    TursoImpl -->|"SQL queries"| DB["SQLite / Turso DB"]
    ApiImpl -->|"HTTP fetch"| APIRoutes["Next.js API Routes"]
    APIRoutes -->|"uses"| TursoImpl
```

---

## 📂 Directory Structure

```
quick-queue-nextjs/
├── app/                                    # Next.js App Router
│   ├── layout.tsx                          # Root layout + ThemeProvider
│   ├── page.tsx                            # Home page (Server Component)
│   ├── loading.tsx                         # Global loading skeleton
│   ├── admin/
│   │   ├── layout.tsx                      # Admin layout (LoginGate wrapper)
│   │   ├── page.tsx                        # Admin Dashboard
│   │   ├── kiosk/page.tsx                  # Admin Kiosk (full-screen counter)
│   │   ├── queues/page.tsx                 # Admin Queue Management
│   │   └── pending-requests/page.tsx       # Admin Pending Requests
│   ├── display/
│   │   ├── page.tsx                        # Public Display (TV/Monitor)
│   │   └── request/page.tsx               # Customer Queue Request form
│   ├── queue/page.tsx                      # Queue status page
│   ├── track/page.tsx                      # Track queue by code
│   ├── shop/page.tsx                       # Shop info page
│   └── api/
│       ├── auth/{login,logout,me}/         # Auth endpoints
│       ├── queue-items/                    # CRUD + stats + by-status + performance + recent-activity
│       └── queue-requests/                 # Request CRUD + challenge + track
├── src/
│   ├── config/
│   │   ├── shop.config.ts                 # ShopConfig (ชื่อร้าน, เวลาเปิดปิด)
│   │   ├── queue-display.config.ts        # Queue number formatting
│   │   └── queue-form.config.ts           # Preset names/notes for forms
│   ├── domain/
│   │   └── types/queue.ts                 # QueueItem, QueueStatus, ServiceType, DTOs
│   ├── application/
│   │   └── repositories/
│   │       ├── IQueueItemRepository.ts
│   │       ├── IQueueRequestRepository.ts
│   │       └── IAuthRepository.ts
│   ├── infrastructure/
│   │   ├── auth/session.ts                # requireAuth() helper
│   │   ├── database/                      # turso.ts, migrate, seed, reset, change-password
│   │   └── repositories/
│   │       ├── RepositoryFactory.ts
│   │       ├── turso/                     # TursoQueueItem, TursoQueueRequest, TursoAuth
│   │       ├── api/                       # ApiQueueItem, ApiQueueRequest, ApiAuth
│   │       └── mock/                      # MockQueueItem, MockAuth
│   └── presentation/
│       ├── hooks/
│       │   ├── useTemplate.ts             # Zustand: template switching (default: retroTechMagazine)
│       │   ├── useQueueSoundAlert.ts      # Sound notifications
│       │   ├── useAppVersion.ts           # Build version display
│       │   ├── useAdminLayoutStore.ts     # Admin sidebar/layout state
│       │   └── useTrackingHistory.ts      # Zustand: tracking code history (localStorage)
│       ├── presenters/
│       │   ├── home/                      # HomePresenter + Server/Client factories
│       │   ├── queue/                     # QueuePresenter + Server/Client factories
│       │   ├── admin/                     # AdminPresenter + Server/Client factories
│       │   └── display/                   # DisplayPresenter + Server/Client factories
│       ├── providers/                     # Context providers
│       └── components/
│           ├── shared/                    # AnimatedButton, GlassCard, QRModal, StatusBadge,
│           │   │                          # QueueItemDetailModal, AudioInteractionOverlay,
│           │   │                          # CustomSelect, ColorModeToggle, FadeInSection
│           │   └── templates/             # Shared template variants (modals, badges, etc.)
│           ├── layout/                    # MainTemplate, Header, Footer, TemplateSwitcher
│           ├── home/                      # HomeView + 3 template variants
│           ├── queue/                     # QueueView + 3 template variants
│           ├── admin/
│           │   ├── AdminView.tsx          # Dashboard view
│           │   ├── AdminLayoutView.tsx    # Admin layout with sidebar nav
│           │   ├── LoginGate.tsx          # Auth gate component
│           │   ├── kiosk/                 # AdminKioskView + 3 template variants
│           │   ├── queues/                # Queue management views
│           │   ├── templates/             # Admin dashboard templates
│           │   └── widgets/               # Dashboard widgets (stats, charts)
│           ├── display/
│           │   ├── DisplayView.tsx        # Public display view + track modal
│           │   ├── templates/             # 3 Display templates (Classic, Editorial, RetroTech)
│           │   └── request/
│           │       ├── DisplayRequestView.tsx  # Request flow (3-step form)
│           │       └── templates/         # 3 Request templates
│           ├── track/                     # TrackView + 3 template variants
│           └── shop/                      # ShopView + ShopInfoBanner + 3 template variants
└── data/                                  # Local SQLite database files
```

---

## 📝 Context for AI (Continuity)

1. **Clean Architecture** — ห้ามข้ามชั้น layer โดยตรง (เช่น Presentation ห้ามเรียก DB) ต้องผ่าน Repository interface เสมอ
2. **Multi-Template** — ทุก component ที่ render UI ต้องมี 3 เวอร์ชัน (Classic, Editorial, RetroTechMagazine) แยก file ชัดเจน
3. **Server vs Client** — Pages เป็น Server Components, Views เป็น Client Components ที่รับ `initialViewModel` จาก server
4. **Repository Factory** — Server-side ใช้ `TursoRepository` (direct DB), Client-side ใช้ `ApiRepository` (fetch API routes)
5. **Auth** — ใช้ HTTP-only cookie `qq_session`, ตรวจผ่าน `requireAuth()` ใน API routes ที่ต้อง auth
6. **DB** — Dev ใช้ local SQLite file (`data/quick-queue.db`), Production ใช้ Turso cloud (ตั้งค่า env `DB_PROVIDER=turso`)
7. **Thai Localization** — UI text ทั้งหมดเป็นภาษาไทย เก็บ Jargon เฉพาะ (เช่น `CALL.NEXT()`, `GENERAL`, `VIP`) ตามสไตล์ Template
8. **Admin Layout** — Admin ใช้ Layout component (`AdminLayoutView`) พร้อม sidebar navigation: Dashboard → Queues → Pending Requests → Kiosk
9. **Responsive Kiosk** — Kiosk templates ใช้ `lg:` breakpoint เพื่อให้ iPad portrait ได้ mobile layout
10. **Config Files** — `src/config/` เก็บ static config ที่ใช้ทั่ว app: ชื่อร้าน (`shop.config.ts`), format เลขคิว (`queue-display.config.ts`), preset ฟอร์ม (`queue-form.config.ts`)
