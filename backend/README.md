# LingvaUZ Backend

Express + TypeScript + Prisma + PostgreSQL.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# .env ichida DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID ni kiriting

npx prisma migrate dev --name init   # birinchi marta
npx prisma db seed                   # 3 til + 10 liga + 5 ta dars

npm run dev                          # http://localhost:3001
```

## Skriptlar

| Buyruq | Vazifa |
|--------|--------|
| `npm run dev` | tsx watch — hot reload |
| `npm run build` | TS → dist/ |
| `npm start` | productionda dist/server.js |
| `npm test` | vitest run |
| `npm run test:watch` | vitest watch mode |
| `npm run typecheck` | tsc --noEmit |
| `npm run prisma:studio` | Prisma Studio GUI |
| `npm run prisma:migrate` | Yangi migration yaratish |
| `npm run prisma:seed` | Seed kontent |

## API Endpointlar

### Auth
| Metod | Yo'l | Auth | Tavsif |
|-------|------|------|--------|
| POST | `/api/auth/register` | — | Email + parol |
| POST | `/api/auth/login` | — | Email + parol |
| POST | `/api/auth/google` | — | Google idToken |
| POST | `/api/auth/logout` | ✅ | — |
| GET | `/api/auth/me` | ✅ | Joriy foydalanuvchi |

### Kontent
| Metod | Yo'l | Auth | Tavsif |
|-------|------|------|--------|
| GET | `/api/courses` | — | Barcha kurslar |
| GET | `/api/courses/:id` | optional | Kurs + unitlar (auth bilan progress) |
| POST | `/api/courses/:id/enroll` | ✅ | Kursga yozilish |
| GET | `/api/lessons/:id` | ✅ | Dars + mashqlar |
| POST | `/api/lessons/:id/complete` | ✅ | XP, streak, liga yangilash |
| POST | `/api/exercises/:id/check` | ✅ | Javobni tekshirish |

### O'yinlashtirish
| Metod | Yo'l | Auth | Tavsif |
|-------|------|------|--------|
| GET | `/api/streak` | ✅ | Streak holati |
| POST | `/api/streak/freeze` | ✅ | Gem bilan freeze |
| GET | `/api/lives` | ✅ | Hayot soni |
| POST | `/api/lives/buy` | ✅ | Gem bilan to'liq tiklash |
| GET | `/api/league` | ✅ | Liga + leaderboard |
| GET | `/api/words/review` | ✅ | Takrorlash kerak so'zlar |
| POST | `/api/words/:id/reviewed` | ✅ | Takrorlash natijasi |

## Docker

```bash
# Project root'dan
docker compose up -d --build
# api: localhost:3001, postgres: localhost:5432
```

## Testlar

```bash
npm test                    # bir marta
npm run test:watch          # watch mode
```

Test'lar uchun alohida DB ishlatish tavsiya etiladi:
```bash
DATABASE_URL=postgresql://lingva:lingva@localhost:5432/lingvauz_test?schema=public npm test
```

## Tuzilma

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── content/uz-en-basics.ts
│   └── migrations/
├── src/
│   ├── server.ts
│   ├── app.ts
│   ├── config/      (db, env)
│   ├── middleware/  (auth, validate, rateLimit, error)
│   ├── modules/
│   │   ├── auth/        (register, login, Google)
│   │   ├── courses/
│   │   ├── lessons/
│   │   ├── exercises/   (javob tekshirish)
│   │   ├── streak/
│   │   ├── lives/
│   │   ├── league/
│   │   ├── words/       (SM-2 spaced repetition)
│   │   └── achievements/
│   └── utils/       (xp, spacedRepetition, week, jwt)
├── tests/           (vitest + supertest)
├── Dockerfile
└── package.json
```

## Rate Limiting

- `/api/auth/login`, `/register`, `/google`: **10 / 15 daqiqa / IP**
- Boshqa `/api/*`: **100 / 1 daqiqa / IP**
