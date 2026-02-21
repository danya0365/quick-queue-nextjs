# Quick Queue - AI Context & Workspace Tracking

## 📌 Project Overview
**Quick Queue** is a modern, full-stack queue management application.
It is built on **Next.js 15 (App Router)** and strictly follows **Clean Architecture** principles to decouple business logic from framework-specific implementation.

## 🛠 Tech Stack
- **Core:** Next.js 15, React 19, TypeScript
- **Styling & UI:** Tailwind CSS, React Spring (Physics-based animations)
- **State Management:** Zustand (for Template & Color Mode persistence)
- **Database:** SQLite (local via `better-sqlite3`) & Turso (production via `@libsql/client`)

## 🏗 Architecture (Clean Architecture)
The codebase in `src/` is divided into four main layers:
1. `domain/`: Enterprise logic, Types, Entities (Framework agnostic).
2. `application/`: Business use cases, DTOs, Repository Interfaces.
3. `infrastructure/`: DB Drivers, Auth Implementation.
4. `presentation/`: React UI, Custom Hooks, and Presenters. It actively supports multiple swappable UI templates (e.g., `classic`, `retroTechMagazine`, `editorial`).

## 🎯 Current Work Focus
Based on the currently open files, the following features are actively being developed:
- **Audio Notifications:** Implementing sound alerts for queue updates (`useQueueSoundAlert.ts`).
- **UI Templates:** Refining layout components for specific design systems, especially:
  - `RetroTechMagazineLayout` elements (`HomeRetroTechMagazineTemplate.tsx`, `QueueRetroTechMagazineTemplate.tsx`, `MainRetroTechMagazineTemplate.tsx`)
  - `EditorialLayout` elements (`LoginGateEditorialTemplate.tsx`)
  - Managing active templates globally (`useTemplate.ts`)

## 📝 Context for AI (Continuity)
When AI takes over or resumes tasks, it should:
1. Always maintain the **Clean Architecture** boundaries.
2. Be aware that the UI can switch themes dynamically; ensure components are properly integrated with `useTemplate` / Zustand.
3. Check `src/presentation/hooks/useQueueSoundAlert.ts` for the current state of audio alerts.
