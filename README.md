<div align="center">
  <h1>Quick Queue</h1>
  <p>
    A robust, edge-ready Queue Management System built with Clean Architecture.
  </p>
  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript" alt="TypeScript"></a>
    <a href="https://turso.tech/"><img src="https://img.shields.io/badge/Database-Turso%20%7C%20libSQL-48b89e?style=flat-square&logo=sqlite" alt="Turso"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
  </p>
</div>

<br />

## 📌 Overview

Quick Queue is a modern, full-stack queue management application designed for high scalability, maintainability, and responsiveness. Built on **Next.js 16 (App Router)** and architected around **Clean Architecture** patterns, the system ensures that enterprise business rules remain strictly decoupled from UI and framework-specific implementations.

It features an edge-ready database connection via **Turso (libSQL)**, a dual-layer security middleware, and a mobile-first UI designed to feel like a native application.

## 📖 Table of Contents

- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Database Management](#-database-management)
- [Directory Structure](#-directory-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏗 Architecture

This repository strictly adheres to **Clean Architecture** and SOLID principles. The separation of concerns is explicitly defined into four layers:

1. **Domain Layer**: Contains enterprise-wide logic and types (`Entities`, `Enums`). Completely independent of any framework.
2. **Application Layer**: Contains business use cases and interface definitions (`Interfaces`, `DTOs`). Dictates what the application can do.
3. **Infrastructure Layer**: Implements the application interfaces. Handles external concerns like Databases, APIs, and Authentication mechanisms.
4. **Presentation Layer**: Handles UI and user interactions. Composed of Next.js Views, Tailwind styles, and Presenters that bridge the UI to the Infrastructure.

## ✨ Key Features

- **Decoupled System**: Business logic is isolated from Next.js; migrating to another framework or a microservices backend requires zero changes to the Domain and Application layers.
- **Edge-Ready Data Foundation**: Powered by `@libsql/client`, allowing seamless switching between local SQLite development and distributed Turso Cloud databases.
- **O(1) Pagination**: Optimized database queries utilizing `LIMIT` and `OFFSET` to smoothly handle millions of records without degrading memory performance.
- **Dual-Layer Security**: 
  - **Edge Proxy**: Next.js Middleware blocks unauthenticated mutations before they reach the server.
  - **Single Source of Truth**: API routes strictly validate HTTP-Only session cookies against the database.
- **Native-Like Mobile UX**: Implements `100dvh` styling and `react-spring` physics to prevent layout shifts and provide smooth micro-interactions.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- Yarn >= 1.22.x
- A [Turso](https://turso.tech/) account (only required for Cloud Database mode)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/quick-queue.git
   cd quick-queue
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Configuration

Create a `.env.local` file at the root of your project.

**Development Mode (Local SQLite):**
Leave the provider empty to fallback to a local `.db` file.
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Quick Queue"
```

**Production Mode (Turso Cloud):**
```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_NAME="Quick Queue"

DB_PROVIDER="turso"
TURSO_DATABASE_URL="libsql://<your-database>.turso.io"
TURSO_AUTH_TOKEN="<your-auth-token>"
```

---

## 🗄 Database Management

The project includes a robust set of CLI scripts to manage your database schema and seed data. If `DB_PROVIDER=turso` is set, these scripts will automatically execute against your remote database.

| Command | Description |
| :--- | :--- |
| `yarn db:migrate` | Enforces the schema by creating required tables and indexes. |
| `yarn db:seed:starter` | Creates the default `admin` user. (Password: `admin`) |
| `yarn db:seed:mock` | Generates 1,000 realistic mock queue records for pagination testing. |
| `yarn db:reset:mock` | Flushes the database entirely and re-runs the mock seed. |

---

## 📂 Directory Structure

```text
quick-queue/
├── app/                      # Next.js App Router (Pages, API Routes, Layouts)
├── prompt/                   # AI Assistant context and tasks
├── public/                   # Static assets and global CSS modules
└── src/                      # Clean Architecture Core
    ├── application/          # Use Cases and Repository Interfaces
    ├── domain/               # Core Types, Entities, and Enums
    ├── infrastructure/       # DB Drivers (Turso), Auth implementations
    └── presentation/         # React Components, Views, and Presenters
```

---

## 🤝 Contributing

We welcome contributions to Quick Queue! Please adhere to the established Clean Architecture guidelines when submitting Pull Requests. Ensure that imports do not cross boundaries (e.g., Domain layer should never import Next.js specific libraries).

## 📄 License

This project is licensed under the [MIT License](LICENSE).
