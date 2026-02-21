<div align="center">
  <h1>Quick Queue</h1>
  <p>
    A robust, edge-ready Queue Management System built with Clean Architecture and Multiple UI Themes.
  </p>
  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript" alt="TypeScript"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind CSS"></a>
    <a href="https://zustand-demo.pmnd.rs/"><img src="https://img.shields.io/badge/State_Management-Zustand-orange?style=flat-square" alt="Zustand"></a>
    <a href="https://react-spring.dev/"><img src="https://img.shields.io/badge/Animations-React_Spring-ff69b4?style=flat-square" alt="React Spring"></a>
    <a href="https://turso.tech/"><img src="https://img.shields.io/badge/Database-Turso%20%7C%20libSQL-48b89e?style=flat-square&logo=sqlite" alt="Turso"></a>
  </p>
</div>

<br />

## 📌 Overview

Quick Queue is a modern, full-stack queue management application designed for high scalability, maintainability, and visual excellence. Built on **Next.js 15 (App Router)** and architected around **Clean Architecture** patterns, the system ensures that enterprise business rules remain strictly decoupled from UI and framework-specific implementations.

The app features a rich, dynamic multi-theme system (switching seamlessly between a "Classic" clean UI and a bold "Retro 90s Hacker" aesthetic), powered by **Zustand** for state persistence and **React Spring** for buttery-smooth, physics-based UI animations.

## 📖 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Database Management](#-database-management)
- [Directory Structure](#-directory-structure)

---

## 🛠 Tech Stack

Our technology choices are focused on performance, maintainability, and providing a premium user experience:

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS (Utility-first, Custom Color Tokens, Glassmorphism, Responsive UI)
- **State Management**: Zustand (Lightweight, fast, unopinionated state management with `localstorage` persistence for themes)
- **Animations**: React Spring (Physics-based, fluid micro-animations for Buttons, Modals, and Transitions)
- **Database Layer**: SQLite (`better-sqlite3` for local dev) & Turso / libSQL (edge-ready production)

---

## 🏗 Architecture

This repository strictly adheres to **Clean Architecture** and SOLID principles. The separation of concerns is explicitly defined into four layers:

1. **Domain Layer**: Contains enterprise-wide logic and types (`Entities`, `Enums`). Completely independent of any framework.
2. **Application Layer**: Contains business use cases and interface definitions (`Interfaces`, `DTOs`).
3. **Infrastructure Layer**: Implements the application interfaces. Handles external concerns like Databases, APIs, and Authentication mechanisms.
4. **Presentation Layer**: 
   - **Views**: The main container components (`AdminView`, `HomeView`).
   - **Presenters**: Custom hooks that connect Views to UseCases (handling internal component state and logic).
   - **Components & Layouts**: Highly decoupled UI elements separated into `ClassicLayout` and `RetroLayout` allowing hot-swapping of complete UI sets based on the active theme.

---

## ✨ Key Features

- **Dynamic Theming System**: Built-in global theme switcher managed by **Zustand**. Instantly swap the entire application between a clean, modern glassmorphic UI (`classic`) and a bold, 90s zine/cyberpunk aesthetic (`retro`).
- **Physics-Based Animations**: Every interaction feels alive. Using **React Spring**, the app abandons linear CSS transitions for real physics (springs, tension, friction) applied to modals, buttons, and counters.
- **Decoupled System**: Business logic is isolated from Next.js. Migrating to another framework or a microservices backend requires zero changes to the Domain and Application layers.
- **Edge-Ready Data Foundation**: Powered by `@libsql/client`, allowing seamless switching between local SQLite development and distributed Turso Cloud databases.
- **Dual-Layer Security**: 
  - **Edge Proxy**: Next.js Middleware blocks unauthenticated mutations before they reach the server.
  - **Single Source of Truth**: API routes strictly validate HTTP-Only session cookies against the database.

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
├── app/                      # Next.js App Router (Pages, API Routes)
├── src/                      # Clean Architecture Core
│   ├── application/          # Use Cases and Repository Interfaces
│   ├── domain/               # Core Types, Entities, and Enums
│   ├── infrastructure/       # DB Drivers (Turso), Auth implementations
│   └── presentation/         # UI Layer (React)
│       ├── components/       # Shared UI, Admin UI, Home UI (separated by Theme Layouts)
│       ├── hooks/            # Global hooks (useAppTheme with Zustand)
│       └── presenters/       # Logic layer connecting UI to Use Cases
```
