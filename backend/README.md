# LingvaUZ Backend

Express + TypeScript + Prisma backend.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# .env ichida DATABASE_URL va JWT_SECRET ni o'zgartiring

npx prisma migrate dev --name init
npx prisma db seed

npm run dev   # http://localhost:3001
```

## Endpointlar (hozircha)

| Metod | Yo'l                | Auth | Tavsif |
|-------|---------------------|------|--------|
| GET   | `/health`           | —    | Health check |
| POST  | `/api/auth/register`| —    | Ro'yxatdan o'tish |
| POST  | `/api/auth/login`   | —    | Tizimga kirish |
| POST  | `/api/auth/logout`  | ✅   | Chiqish |
| GET   | `/api/auth/me`      | ✅   | Joriy foydalanuvchi |

Auth bilan so'rovlar: `Authorization: Bearer <token>`.

## Skriptlar

- `npm run dev` — tsx watch
- `npm run build` — TS → dist/
- `npm start` — productionda
- `npm run prisma:studio` — Prisma Studio GUI
