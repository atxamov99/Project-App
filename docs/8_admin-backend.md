# ⚙️ Admin Panel — Backend

## Tech Stack

| Texnologiya | Maqsad |
|------------|--------|
| **Express.js** | Mavjud — admin endpointlar shu app'ga qo'shiladi |
| **TypeScript** | Type safety |
| **Prisma** | ORM |
| **Zod** | Input validatsiyasi |
| **JWT** | Auth (mavjud, role bilan kengaytiriladi) |

---

## 📁 Struktura

```
backend/src/modules/admin/
├── middleware/
│   ├── requireAdmin.ts           # Faqat ADMIN
│   └── requireContentEditor.ts   # CONTENT_EDITOR yoki ADMIN
│
├── audit/
│   └── audit.service.ts          # logAction() helper
│
├── users/
│   ├── admin-users.routes.ts     # /api/admin/users/*
│   ├── admin-users.controller.ts
│   ├── admin-users.service.ts
│   └── admin-users.schemas.ts
│
├── content/
│   ├── languages.routes.ts       # /api/admin/languages/*
│   ├── courses.routes.ts         # /api/admin/courses/*
│   ├── units.routes.ts
│   ├── lessons.routes.ts
│   ├── exercises.routes.ts
│   ├── words.routes.ts
│   └── achievements.routes.ts
│
└── stats/
    └── stats.routes.ts            # /api/admin/stats/*
```

> **Tamoyil:** mavjud `modules/courses/`, `modules/lessons/` (foydalanuvchi uchun read-only) ga **tegmaymiz**. Admin'lar uchun alohida modul — chunki ruxsatlar, validatsiya, javob shakli boshqacha (ko'proq maydon, ko'proq filter).

---

## 🔐 Middleware

### `requireAdmin`

```typescript
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../../../config/db'

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) return res.status(401).json({ error: 'Avtorizatsiya talab etiladi' })

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { role: true, suspendedAt: true },
  })

  if (!user) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' })
  if (user.suspendedAt) return res.status(403).json({ error: 'Hisob to\'xtatilgan' })
  if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Faqat ADMIN' })

  next()
}
```

### `requireContentEditor`

```typescript
export async function requireContentEditor(req, res, next) {
  // ...auth tekshirish...
  if (!['CONTENT_EDITOR', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Faqat CONTENT_EDITOR yoki ADMIN' })
  }
  next()
}
```

> **Tanlangan strategiya:** rolni har so'rovda DB'dan o'qish (JWT'da role saqlamaslik).
>
> **Sabab:** rol o'zgartirilsa darhol kuchga kiradi (revocation muammosi yo'q). Cost: har admin so'rovda 1 ta `User` SELECT — admin URL'lar kam ishlatiladi, qabul qilinadi.

---

## 📝 Audit Service

```typescript
// modules/admin/audit/audit.service.ts
import { prisma } from '../../../config/db'

interface LogInput {
  actorId: string
  action: string
  targetType?: string
  targetId?: string
  metadata?: any
  ipAddress?: string
  userAgent?: string
}

export async function logAction(input: LogInput) {
  await prisma.auditLog.create({ data: input }).catch((e) => {
    console.error('Audit log failed:', e)
    // log xatoligi asosiy oqimni to'xtatmaslik kerak
  })
}
```

Har admin endpoint oxirida chaqiriladi:
```typescript
await logAction({
  actorId: req.userId!,
  action: 'user.role.change',
  targetType: 'user',
  targetId: req.params.id,
  metadata: { from: oldRole, to: newRole },
  ipAddress: req.ip,
  userAgent: req.get('user-agent') ?? null,
})
```

---

## 🔌 API Endpointlar

### Foydalanuvchilar (faqat ADMIN)

| Metod | Yo'l | Tavsif |
|-------|------|--------|
| `GET` | `/api/admin/users` | Filter + sahifalash bilan ro'yxat |
| `GET` | `/api/admin/users/:id` | Detail (statistika bilan) |
| `PATCH` | `/api/admin/users/:id/role` | Rol o'zgartirish |
| `POST` | `/api/admin/users/:id/suspend` | Suspend qilish |
| `POST` | `/api/admin/users/:id/unsuspend` | Suspend'ni olib tashlash |
| `DELETE` | `/api/admin/users/:id` | O'chirish (cascade) |

#### GET `/api/admin/users` query parametrlar

```
?role=STUDENT|CONTENT_EDITOR|ADMIN
?suspended=true|false
?premium=true|false
?search=email-yoki-username
?page=1
?limit=20  (max 100)
?sort=createdAt|totalXP|streak (default createdAt:desc)
```

Javob:
```json
{
  "users": [
    {
      "id": "...",
      "email": "...",
      "username": "...",
      "displayName": "...",
      "role": "STUDENT",
      "suspendedAt": null,
      "totalXP": 1540,
      "streak": 7,
      "isPremium": false,
      "createdAt": "..."
    }
  ],
  "total": 132,
  "page": 1,
  "limit": 20
}
```

#### PATCH `/api/admin/users/:id/role` body

```json
{ "role": "CONTENT_EDITOR" }
```

Cheklov: o'zining rolini o'zgartirib bo'lmaydi (lockout xavfi).

---

### Kontent (CONTENT_EDITOR yoki ADMIN)

#### Tillar
| Metod | Yo'l |
|-------|------|
| `GET` | `/api/admin/languages` |
| `POST` | `/api/admin/languages` |
| `PATCH` | `/api/admin/languages/:id` |
| `DELETE` | `/api/admin/languages/:id` (faqat hech qanday kursda ishlatilmasa) |

#### Kurslar
| Metod | Yo'l |
|-------|------|
| `GET` | `/api/admin/courses` (admin ko'rinishi: barcha kurslar, hatto isActive=false) |
| `POST` | `/api/admin/courses` body: `{ fromLanguageId, toLanguageId }` |
| `PATCH` | `/api/admin/courses/:id` (isActive toggle) |
| `DELETE` | `/api/admin/courses/:id` |

#### Unitlar
| Metod | Yo'l |
|-------|------|
| `GET` | `/api/admin/courses/:courseId/units` |
| `POST` | `/api/admin/units` body: `{ courseId, order, title, color, icon, description }` |
| `PATCH` | `/api/admin/units/:id` |
| `DELETE` | `/api/admin/units/:id` |
| `POST` | `/api/admin/units/reorder` body: `[{ id, order }]` |

#### Darslar
| Metod | Yo'l |
|-------|------|
| `GET` | `/api/admin/units/:unitId/lessons` |
| `POST` | `/api/admin/lessons` body: `{ unitId, order, type, xpReward }` |
| `PATCH` | `/api/admin/lessons/:id` |
| `DELETE` | `/api/admin/lessons/:id` |

#### Mashqlar (Exercise)
| Metod | Yo'l |
|-------|------|
| `GET` | `/api/admin/lessons/:lessonId/exercises` (correctAnswer bilan!) |
| `POST` | `/api/admin/exercises` |
| `PATCH` | `/api/admin/exercises/:id` |
| `DELETE` | `/api/admin/exercises/:id` |
| `POST` | `/api/admin/lessons/:lessonId/attach-exercise` body: `{ exerciseId, order }` |

> **Muhim:** admin response'larida **correctAnswer va explanation chiqariladi** (foydalanuvchi API'da yashiriladi).

#### So'zlar (Vocabulary)
| Metod | Yo'l |
|-------|------|
| `GET` | `/api/admin/words` (filter: language, category, level, search) |
| `POST` | `/api/admin/words` |
| `PATCH` | `/api/admin/words/:id` |
| `DELETE` | `/api/admin/words/:id` |

#### Achievementlar
| Metod | Yo'l |
|-------|------|
| `GET` | `/api/admin/achievements` |
| `POST` | `/api/admin/achievements` |
| `PATCH` | `/api/admin/achievements/:id` |
| `DELETE` | `/api/admin/achievements/:id` |

---

### Statistika (faqat ADMIN)

| Metod | Yo'l | Tavsif |
|-------|------|--------|
| `GET` | `/api/admin/stats/dashboard` | Asosiy KPI to'plami |
| `GET` | `/api/admin/stats/users` | Ro'yxatdan o'tish trend, faollik |
| `GET` | `/api/admin/stats/content` | Eng faol kurslar, dars tugatish foizlari |
| `GET` | `/api/admin/stats/exercises/troubled` | Eng ko'p xato qilingan mashqlar |

#### `/api/admin/stats/dashboard` javob

```json
{
  "users": {
    "total": 1320,
    "newToday": 18,
    "newThisWeek": 124,
    "dau": 458,
    "wau": 891,
    "mau": 1190,
    "premium": 42
  },
  "content": {
    "totalCourses": 4,
    "totalLessons": 25,
    "totalExercises": 125,
    "totalWords": 480
  },
  "engagement": {
    "lessonsCompletedToday": 1843,
    "averageSessionMinutes": 8.2,
    "completionRate": 0.71
  }
}
```

---

## ✅ Validatsiya Misoli (Zod)

```typescript
// modules/admin/users/admin-users.schemas.ts
import { z } from 'zod'

export const changeRoleSchema = z.object({
  role: z.enum(['STUDENT', 'CONTENT_EDITOR', 'ADMIN']),
})

export const suspendSchema = z.object({
  reason: z.string().min(1).max(500),
})

export const listUsersQuerySchema = z.object({
  role: z.enum(['STUDENT', 'CONTENT_EDITOR', 'ADMIN']).optional(),
  suspended: z.enum(['true', 'false']).optional(),
  premium: z.enum(['true', 'false']).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'totalXP', 'streak']).default('createdAt'),
})
```

---

## 🚫 Xato Javoblari

| HTTP | Holat | Misol |
|------|-------|-------|
| 401 | Token yo'q yoki yaroqsiz | `{ error: 'Avtorizatsiya talab etiladi' }` |
| 403 | Rol yetarli emas | `{ error: 'Faqat ADMIN' }` |
| 404 | Topilmadi | `{ error: 'Foydalanuvchi topilmadi' }` |
| 409 | Konflikt (masalan, til allaqachon bor) | `{ error: 'Til kodi band' }` |
| 422 | Mantiqiy noaniqlik (masalan, faol kursni o'chirish) | `{ error: 'Avval kursni isActive=false qiling' }` |

---

## 🛡️ Self-protection Qoidalari

Backend hech qachon ruxsat bermaydi:

1. **O'zining rolini o'zgartirish** (admin lockout xavfi)
   ```typescript
   if (req.userId === req.params.id) {
     throw new AppError(422, "O'z rolingizni o'zgartira olmaysiz")
   }
   ```

2. **Oxirgi ADMIN'ni o'chirish** (orphan platform xavfi)
   ```typescript
   const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
   if (target.role === 'ADMIN' && adminCount === 1) {
     throw new AppError(422, "Oxirgi ADMIN'ni o'chirib bo'lmaydi")
   }
   ```

3. **O'zini suspend qilish**
   ```typescript
   if (req.userId === req.params.id) {
     throw new AppError(422, "O'zingizni suspend qila olmaysiz")
   }
   ```

---

## 🧪 Sinov Strategiyasi

### Integratsion testlar (vitest + supertest)

```typescript
// tests/admin-users.test.ts
describe('GET /api/admin/users', () => {
  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/admin/users')
    expect(res.status).toBe(401)
  })

  it('returns 403 for STUDENT role', async () => {
    const { token } = await registerUser('student@e.uz', 'STUDENT')
    const res = await request(app).get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })

  it('returns list for ADMIN role', async () => {
    const { token } = await registerUser('admin@e.uz', 'ADMIN')
    const res = await request(app).get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.users).toBeInstanceOf(Array)
  })
})
```

Helper test fayli (`tests/helpers.ts`)ga qo'shamiz:
```typescript
export async function registerUser(email: string, role: Role = 'STUDENT') {
  // ... ro'yxatdan o'tkazib, role'ni DB'dan yangilash
}
```

### Self-protection testlari
- O'z rolini o'zgartira olmasligi
- Oxirgi ADMIN o'chirib bo'lmasligi
- O'zini suspend qila olmasligi

---

## 📊 Kuzatuv (Logging)

- Har audit_log yozuvi DB'da saqlanadi
- `morgan` HTTP loglar (mavjud)
- Admin'larning xato javoblari (4xx, 5xx) `console.error` orqali stderr'ga
- Production'da: pino + structured logs (kelajak versiya)

---

## ⚡ Rate Limiting

Admin endpointlarga ham rate limit qo'llaniladi:
- `/api/admin/*` — `generalLimiter` (mavjud, 100/min)
- Foydalanuvchi suspend/delete kabi qattiq amallar uchun qo'shimcha cheklov ehtimoli (kelajak)

---

## 🚀 Yo'l xaritasi (backend uchun)

```
1   → Schema migrate (add_admin_roles)
2   → requireAdmin / requireContentEditor middleware
3   → Audit service (logAction helper)
4   → Users API (list/detail/role/suspend/delete)
5   → Languages, Courses, Units API
6   → Lessons, Exercises API (correctAnswer bilan)
7   → Words, Achievements API
8   → Stats API (dashboard, exercises/troubled)
9   → Integratsion testlar (har endpoint uchun bittadan happy path + 1 forbidden)
```
