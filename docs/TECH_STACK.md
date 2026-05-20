# 🦜 LingvaUZ — Texnologiyalar Stack (To'liq)

> Duolingo uslubidagi til o'rgatish platformasi.
> **Tillar:** O'zbek 🇺🇿, Ingliz 🇬🇧, Rus 🇷🇺
> **Komponentlar:** Backend API + Web (admin + student) + Mobile (alohida jamoa)

---

## 📐 Umumiy arxitektura

```
┌──────────────┐   HTTP/JSON    ┌────────────────┐    SQL    ┌──────────────┐
│  Web (Vite)  │ ─────────────▶ │  Express API   │ ────────▶ │  PostgreSQL  │
│  React 19    │   Bearer JWT   │  Node 20 + TS  │  Prisma   │   16 (Alpine)│
└──────────────┘                └────────────────┘           └──────────────┘
       │                                │
       │ Google Identity                │ google-auth-library
       └──────────► accounts.google.com ◄
```

Monorepo (yarim-monorepo). Root `package.json` minimal — har bir paket o'zining `package.json` faylida bog'liqliklarini boshqaradi.

```
Project/
├── backend/      # Express + Prisma + PostgreSQL (TypeScript)
├── web/          # React 19 + Vite + Redux Toolkit (JavaScript/JSX)
├── docs/         # Loyiha hujjatlari
├── docker-compose.yml
└── .github/workflows/  # CI (backend-ci)
```

---

## 🗄️ Database

| Komponent | Versiya | Tavsif |
|-----------|---------|--------|
| **PostgreSQL** | 16-alpine | Asosiy relational DB (Docker image) |
| **Prisma ORM** | ^7.8.0 | Schema, migration, type-safe client |
| **@prisma/adapter-pg** | ^7.8.0 | Prisma yangi driver-adapter API |
| **pg (node-postgres)** | ^8.13.0 | Pastki darajadagi PG drayveri |

### Schema modellari (`backend/prisma/schema.prisma`)

**Foydalanuvchi va kirish:**
- `User` (Role: `STUDENT`, `CONTENT_EDITOR`, `ADMIN`)
- `Session` — JWT tokenlarni kuzatish uchun
- `UserLives` — yurak/hayot tizimi
- `Friendship` — follow/follower (composite PK)
- `AuditLog` — admin amallarini tarixi

**Kontent:**
- `Language` (uz/en/ru), `Course` (from→to language), `Unit`, `Lesson`
- `Exercise` (8 ta tur: `TRANSLATE_TEXT`, `BUILD_SENTENCE`, `LISTEN_AND_TYPE`, `SPEAK_AND_CHECK`, `MATCH_PAIRS`, `SELECT_IMAGE`, `FILL_IN_BLANK`, `MULTIPLE_CHOICE`)
- `LessonExercise` (n-to-n bog'lanish)
- `Word`, `ExerciseWord` (vocabulary)

**Progress va gamification:**
- `CourseProgress`, `LessonResult`, `WordProgress` (SM-2 spaced repetition uchun)
- `League`, `LeagueEntry` (10 ta liga: Bronze → Diamond)
- `Achievement`, `UserAchievement`

**Migration tarixi** (`backend/prisma/migrations/`):
- `20260506161557_init`
- `20260509191928_add_google_and_admin`
- `20260509204902_add_friendship`

**Seed:** `prisma/seed.ts` — 3 til, 10 liga, 4 ta achievement, UZ→EN Basics kursi (`prisma/content/uz-en-basics.ts`).

---

## ⚙️ Backend

**Joylashuv:** `backend/`
**Runtime:** Node.js 20 (Alpine Docker)
**Til:** TypeScript ^5.7.2 (CommonJS)
**Framework:** Express ^4.21.2

### Asosiy paketlar (`backend/package.json`)

| Paket | Versiya | Vazifa |
|-------|---------|--------|
| `express` | ^4.21.2 | HTTP framework |
| `express-async-errors` | ^3.1.1 | async/await error handling |
| `express-rate-limit` | ^7.5.0 | Rate limiting (auth: 10/15min, umumiy: 100/min) |
| `helmet` | ^8.0.0 | Security headers |
| `cors` | ^2.8.5 | CORS (credentials, origin) |
| `morgan` | ^1.10.0 | HTTP request logger |
| `cookie-parser` | ^1.4.7 | Cookies parsing |
| `bcryptjs` | ^2.4.3 | Parol hashlash (10 rounds default) |
| `jsonwebtoken` | ^9.0.2 | JWT token (30d expiry) |
| `google-auth-library` | ^9.15.0 | Google Sign-In idToken verification |
| `zod` | ^3.24.1 | Schema validation (env va request body) |
| `dotenv` | ^16.4.7 | `.env` o'qish |
| `@prisma/client` | ^7.8.0 | DB client |
| `@prisma/adapter-pg` | ^7.8.0 | Prisma adapter |
| `pg` | ^8.13.0 | PG drayveri |

### Dev qurollari

| Paket | Vazifa |
|-------|--------|
| `tsx` ^4.19.2 | TS hot-reload (`npm run dev`) |
| `typescript` ^5.7.2 | Compiler |
| `vitest` ^2.1.8 | Test framework (node env, single-fork) |
| `supertest` ^7.0.0 | HTTP integratsion test |
| `@vitest/coverage-v8` ^2.1.8 | Coverage |
| `prisma` ^7.8.0 | CLI |
| `@types/*` | TypeScript typings |

### Modulli arxitektura (`backend/src/modules/`)

```
auth/         — register, login, Google, /me
courses/      — kurslar ro'yxati, enroll
lessons/      — dars + complete (XP/streak/league update)
exercises/    — javob tekshirish
streak/       — streak holati, freeze
lives/        — hayot, sotib olish
league/       — leaderboard, hafta XP
words/        — SM-2 spaced repetition review
practice/     — takrorlash sessiyasi
friends/      — follow/unfollow/search
achievements/ — service (admin orqali boshqariladi)
admin/
  ├── users/        — ro'yxat, suspend, role
  ├── content/      — languages, courses, units, lessons, exercises, words, achievements
  ├── stats/        — dashboard + troubled exercises
  └── audit/        — audit log service
```

### Middleware (`backend/src/middleware/`)

- `auth.ts` — `requireAuth` (Bearer JWT → `req.userId`)
- `requireAdmin.ts` — faqat `ADMIN` rol
- `requireContentEditor.ts` — `ADMIN` yoki `CONTENT_EDITOR`
- `validate.ts` — Zod schema bilan body/query/params tekshirish
- `rateLimit.ts` — 2 ta limiter (auth qattiqroq)
- `error.ts` — `AppError` class + global error handler + 404

### Yordamchi utillar (`backend/src/utils/`)

- `jwt.ts` — sign / verify
- `xp.ts` — XP hisoblash (har bir xato uchun 10% jarima, min 50%)
- `spacedRepetition.ts` — **SM-2 algoritmi** (intervallar: 1, 2, 4, 8, 16, 32 kun)
- `week.ts` — hafta hisob-kitobi (liga uchun)
- `*.test.ts` — Vitest unit testlar

### API endpointlar (asosiy)

**Auth:** `POST /api/auth/register|login|google|logout`, `GET /api/auth/me`
**Kontent:** `GET /api/courses`, `/courses/:id`, `POST /courses/:id/enroll`, `GET /lessons/:id`, `POST /lessons/:id/complete`, `POST /exercises/:id/check`
**Gamification:** `GET /streak`, `POST /streak/freeze`, `GET /lives`, `POST /lives/buy`, `GET /league`, `GET /words/review`, `POST /words/:id/reviewed`, `GET /practice/session`
**Social:** `GET /friends/following|followers`, `POST /friends/follow`, `DELETE /friends/unfollow/:id`, `GET /friends/search?q=`
**Admin:** `/api/admin/{users,languages,courses,units,lessons,exercises,words,achievements,stats}`

### Environment variables (`backend/.env`)

```
DATABASE_URL=postgresql://...
JWT_SECRET=<min 16 chars>
JWT_EXPIRES_IN=30d
BCRYPT_ROUNDS=10
PORT=3001
NODE_ENV=development|production|test
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
```

`zod` orqali validatsiya — yaroqsiz `env` bo'lsa, server `process.exit(1)`.

---

## 🌐 Web (Frontend)

**Joylashuv:** `web/`
**Til:** JavaScript (JSX) — TypeScript ishlatilmagan
**Module format:** ESM (`"type": "module"`)

### Asosiy paketlar (`web/package.json`)

| Paket | Versiya | Vazifa |
|-------|---------|--------|
| `react` | ^19.2.5 | UI library |
| `react-dom` | ^19.2.5 | DOM renderer |
| `react-router-dom` | ^6.28.0 | Routing (`BrowserRouter`, nested routes) |
| `@reduxjs/toolkit` | ^2.11.2 | State management + **RTK Query** |
| `react-redux` | ^9.2.0 | React binding |

### Build / Dev qurollari

| Paket | Versiya | Vazifa |
|-------|---------|--------|
| `vite` | ^8.0.10 | Dev server + build |
| `@vitejs/plugin-react` | ^6.0.1 | React plugin (Oxc-based) |
| `tailwindcss` | ^4.1.13 | Utility-first CSS (v4 — yangi engine) |
| `@tailwindcss/vite` | ^4.1.13 | Vite plugin (CSS `@import "tailwindcss"`) |
| `eslint` | ^10.2.1 | Linter (flat config) |
| `@eslint/js` | ^10.0.1 | JS recommended config |
| `eslint-plugin-react-hooks` | ^7.1.1 | Hooks rules |
| `eslint-plugin-react-refresh` | ^0.5.2 | HMR uchun |
| `globals` | ^17.5.0 | ESLint browser globals |

### State management — Redux Toolkit + RTK Query

**Store:** `web/src/store/index.js`

```
store/
├── index.js          — configureStore
├── apiSlice.js       — RTK Query (createApi) — ~50 ta endpoint
├── hooks.js          — typed useAppDispatch / useAppSelector
└── slices/
    └── authSlice.js  — user, token (localStorage bilan sync)
```

RTK Query:
- `baseQuery: fetchBaseQuery` — `localStorage.getItem('token')` dan Bearer JWT
- `tagTypes: ['User', 'Course', 'Lesson', 'Exercise', 'Language', 'Unit', 'Word', 'Achievement']` — cache invalidatsiya
- Auto-generated hooks: `useLoginMutation`, `useGetCoursesQuery`, `useAdminUsersQuery`, ... (60+ hook)

`web/src/lib/api.js` — eski (qo'lda yozilgan) fetch wrapper, hali ham ishlatilishi mumkin.

### Routing (`web/src/App.jsx`)

```
/                    Home (landing)
/login, /register    Auth sahifalari (Google sign-in bilan)

[ProtectedRoute] (JWT bor):
  /lesson/:lessonId  Dars sahifasi (full-screen, AppShell yo'q)
  [AppShell]:
    /learn           Asosiy o'qish sahifasi
    /practice        Spaced repetition
    /leaderboard     Liga
    /profile         Profil

[AdminProtectedRoute] (ADMIN yoki CONTENT_EDITOR):
  [AdminShell]:
    /admin                           Dashboard
    /admin/users[/:id]               User boshqaruvi
    /admin/languages                 Tillar CRUD
    /admin/courses[/:id]             Kurslar
    /admin/units/:unitId             Unit detail
    /admin/lessons/:id               Lesson editor
    /admin/words                     So'zlar
    /admin/achievements              Achievement'lar
    /admin/stats                     Statistika
```

### Komponentlar (`web/src/components/`)

```
ProtectedRoute.jsx
layout/        — AppShell, TopAppBar, BottomNav, SideNav
shared/        — GoogleButton, Icon, Mascot ("Tarvuz" 🍉)
admin/
  ├── AdminShell, AdminProtectedRoute
  ├── DataTable, Modal, FormField, StatCard, RoleBadge
  └── exercise-editors/ — BuildSentenceEditor, MultipleChoiceEditor, TranslateEditor
```

### Styling

- **Tailwind CSS v4** — `@import "tailwindcss"` yangi syntax
- **Material 3 dizayn tokenlari** — `@theme { --color-surface, --color-primary, ... }` (Loft palette: jigarrang/qizg'ish tonlar)
- Shriftlar: **Plus Jakarta Sans** (400–800), **Material Symbols Outlined**
- Google Identity SDK: `<script src="https://accounts.google.com/gsi/client">`

### Environment (`web/.env`)

```
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
```

---

## 🐳 DevOps va infrastruktura

### Docker (`docker-compose.yml`)

| Service | Image | Port |
|---------|-------|------|
| `postgres` | `postgres:16-alpine` | 5432 |
| `api` | local build (`backend/Dockerfile`) | 3001 |

**Backend Dockerfile** — 3-stage build:
1. `deps` — `npm ci`
2. `build` — `prisma generate` + `tsc`
3. `runtime` — `node:20-alpine` + `tini` + `curl` + production deps
- `HEALTHCHECK` — `curl /health`
- `ENTRYPOINT` — `tini` (PID 1 signal handling)
- `CMD` — `prisma migrate deploy && node dist/server.js`

### CI (`.github/workflows/backend-ci.yml`)

- Trigger: `backend/**` o'zgarsa (push/PR)
- Servis: PostgreSQL 16-alpine
- Node 20, npm cache
- Steps: `npm ci` → `prisma generate` → `prisma migrate deploy` → `tsc --noEmit` → `npm run build` → `npm test`

### Tests

- **Backend:** Vitest + Supertest (`backend/src/utils/*.test.ts`, `backend/tests/`)
- **Frontend:** test infratuzilmasi hozircha o'rnatilmagan
- Test DB: alohida `lingvauz_test` schema

---

## 🔐 Xavfsizlik

| Qatlam | Implementatsiya |
|--------|------------------|
| Parol | `bcryptjs` (10 rounds default, env'da sozlanadi) |
| Auth token | JWT (HS256, 30 kun, `JWT_SECRET` min 16 ch) |
| Google OAuth | `google-auth-library` orqali ID token tekshirish (audience: `GOOGLE_CLIENT_ID`) |
| HTTP headers | `helmet` |
| CORS | Origin whitelist + credentials |
| Rate limiting | auth: 10/15min/IP, umumiy: 100/1min/IP |
| Input validation | Zod (env + barcha request bodies) |
| Foreign keys | Prisma `onDelete: Cascade/Restrict` |
| RBAC | `Role` enum (`STUDENT|CONTENT_EDITOR|ADMIN`) + middleware |
| Audit log | `AuditLog` model — admin amallari yoziladi |
| Suspended users | `suspendedAt` / `suspendReason` / `adminNote` |

---

## 🧮 Algoritmlar va biznes mantiq

| Joy | Mantiq |
|-----|--------|
| `utils/spacedRepetition.ts` | **SM-2** algoritmi (interval: 1→2→4→8→16→32 kun, strength 0–5) |
| `utils/xp.ts` | XP penalty: `xp * (1 - min(mistakes*0.1, 0.5))`, min `baseXP/2` |
| `utils/week.ts` | ISO hafta boshlanishi → liga reset |
| `auth.service.ts` | Username uniqueness — emaildan 6 marta urinish, fallback `base + Date.now().toString(36)` |

---

## 📦 Root-level (Project/)

`package.json` ildizda — minimal:
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "react-router-dom": "^7.15.0"
  }
}
```
Bu eksperimental — asosiy `web/` va `backend/` o'zining mustaqil bog'liqliklarini ishlatadi.

---

## 📝 Yana ishlatiladigan tashqi servislar

| Servis | Vazifa |
|--------|--------|
| **Google Identity Services** (`accounts.google.com/gsi/client`) | Web sign-in |
| **Google Fonts** | Plus Jakarta Sans, Material Symbols |
| **PostgreSQL** | Asosiy ma'lumotlar bazasi |
| **GitHub Actions** | CI |
| **Docker Hub** | `postgres:16-alpine`, `node:20-alpine` images |

---

## 🚧 Mobile (alohida)

Hujjat (`docs/5_mobile.md`) bo'yicha **React Native + Expo** rejalashtirilgan, ammo bu repo'da web + backend qismi mavjud (mobile boshqa jamoa tomonidan).

---

## ⚡ Tezkor o'rnatish

```bash
# Database + API (Docker)
docker compose up -d --build

# Backend (lokal dev)
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev   # http://localhost:3001

# Web (lokal dev)
cd web
npm install
cp .env.example .env
npm run dev   # http://localhost:5173
```

---

## 📊 Stack qisqacha (one-liner)

> **PostgreSQL 16 + Prisma 7 + Express 4 + TypeScript 5 + Node 20** (backend) — **React 19 + Vite 8 + Redux Toolkit 2 + Tailwind 4** (web) — **JWT + bcrypt + Google OAuth + Zod** (auth/validation) — **Vitest + Supertest** (test) — **Docker + GitHub Actions** (infra).
