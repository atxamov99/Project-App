# 🗄️ Admin Panel — Database O'zgarishlari

## Texnologiyalar

| Vazifa | Texnologiya |
|--------|------------|
| Asosiy DB | **PostgreSQL 16** |
| ORM | **Prisma** |
| Migration | `npx prisma migrate dev` |

> **Qoida:** Hech qanday breaking o'zgarish kiritmaymiz — qo'shimcha ustun va modellar **nullable** yoki **default** qiymatli bo'ladi. Shu sababli mavjud foydalanuvchilarga ta'sir qilmaydi.

---

## 📐 Schema O'zgarishlari

### 1. Yangi Enum: `Role`

```prisma
enum Role {
  STUDENT
  CONTENT_EDITOR
  ADMIN
}
```

### 2. `User` modeliga `role` ustuni

```prisma
model User {
  // ... mavjud ustunlar
  role           Role      @default(STUDENT)
  suspendedAt    DateTime?
  suspendReason  String?
  adminNote      String?   // ADMIN ichki belgi qo'yishi mumkin

  // ... mavjud munosabatlar
  auditLogs     AuditLog[] @relation("ActorAuditLogs")
}
```

| Ustun | Tip | Sabab |
|-------|-----|-------|
| `role` | `Role @default(STUDENT)` | Asosiy rol nazorati. Default — mavjud userlar STUDENT bo'lib qoladi |
| `suspendedAt` | `DateTime?` | NULL = aktiv. Sana = qachondan suspend |
| `suspendReason` | `String?` | Suspend sababini saqlash (audit uchun) |
| `adminNote` | `String?` | ADMIN ichki belgi (foydalanuvchi ko'rmaydi) |

### 3. Yangi Model: `AuditLog`

Har bir admin amali (rol o'zgarish, suspend, kontent o'zgarish) yoziladi.

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  actorId    String
  actor      User     @relation("ActorAuditLogs", fields: [actorId], references: [id])
  action     String   // "user.role.change", "course.delete", "lesson.create"
  targetType String?  // "user", "course", "lesson", ...
  targetId   String?
  metadata   Json?    // before/after, sabab, va boshqa
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  @@index([actorId])
  @@index([action])
  @@index([targetType, targetId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

> **Eslatma:** AuditLog yozuv MVP'da **yoziladi** (har admin amal qayd qilinadi), lekin **UI** keyingi versiyada chiqadi. Hozircha SQL/Prisma Studio orqali ko'riladi.

---

## 🔄 Migration Strategiyasi

### Birinchi migration: `add_admin_roles`

```bash
npx prisma migrate dev --name add_admin_roles
```

**Nima bo'ladi:**
1. `Role` enum yaratiladi
2. `users` jadvaliga `role`, `suspendedAt`, `suspendReason`, `adminNote` ustunlari qo'shiladi
   - `role` default `'STUDENT'` — mavjud yozuvlar avtomatik to'ldiriladi
3. `audit_logs` jadvali yaratiladi indekslari bilan

**Xavfsizlik:** mavjud ma'lumotlar buzilmaydi (default qiymatlar bilan).

---

## 👑 Birinchi Adminni Yaratish

**Tanlangan strategiya:** Manual SQL.

Sabab: Code-base'da hardcoded admin email yo'q (xavfsizroq), CLI script qo'shilmagan (sodda turish), DB'da bir buyruq yetarli.

### Qadamlar

1. Foydalanuvchi avval oddiy ravishda ro'yxatdan o'tadi (`/register`)
2. DB'da to'g'ridan-to'g'ri rolni o'zgartirish:

```sql
-- psql yoki Prisma Studio orqali
UPDATE users SET role = 'ADMIN' WHERE email = 'siz@email.com';
```

Yoki Prisma Studio'da:
```
npm run prisma:studio  → users → row tanlash → role: ADMIN → save
```

3. Foydalanuvchi qayta login qiladi (yangi JWT chiqariladi role bilan)
4. Endi `/admin` ga kira oladi

> **MUHIM:** birinchi ADMIN o'rnatilgandan keyin, qolgan rollar **UI orqali** beriladi (Users sahifasidan). SQL'ga qaytish kerak emas.

---

## 🧪 Sinov Strategiyasi

### Migration sinovi
```bash
# Test DB'da
DATABASE_URL=postgresql://lingva:lingva@localhost:5432/lingvauz_test \
  npx prisma migrate deploy

# Schema'ni tekshirish
psql -d lingvauz_test -c "\d users"     # role ustuni borligini ko'rish
psql -d lingvauz_test -c "\dT"          # Role enum borligini ko'rish
psql -d lingvauz_test -c "\d audit_logs"
```

### Default qiymatni sinash
```sql
-- Yangi user yaratiladi (role berilmagan)
INSERT INTO users (id, email, username, "displayName", "passwordHash", "updatedAt")
  VALUES ('test1', 't@e.uz', 'tu', 'TU', 'hash', now());

-- role 'STUDENT' ekanini tasdiqlash
SELECT email, role FROM users WHERE id = 'test1';
```

---

## 📊 Indekslar va Ishlash

| Indeks | Maqsad |
|--------|--------|
| `users.role` (ehtimol qo'shamiz) | Admin sahifasida rol bo'yicha filterlash uchun |
| `audit_logs.actorId` | "Bu admin nima qilgan" ko'rish uchun |
| `audit_logs.action` | "Hammada qancha role.change bo'lgan" agregatsiyalari uchun |
| `audit_logs.targetType + targetId` | "Bu kursni kim o'zgartirgan" uchun |
| `audit_logs.createdAt` | Sanaga ko'ra tartiblash uchun |

> **Eslatma:** Foydalanuvchi soni 100K dan oshganda `users.role` ga qo'shimcha indeks qo'yish foydali bo'lishi mumkin. MVP'da kerak emas.

---

## 🚫 Cascade Strategiyasi

| Yozuv o'chsa | Nima bo'ladi |
|--------------|--------------|
| User o'chsa | `auditLogs.actorId` orphan bo'ladi (NULL bo'la olmaydi — `User`'ga FK bog'liq, **ON DELETE RESTRICT**) |
| Admin user o'chmoqchi bo'lsa | Avval audit log yozuvlarini o'chirish kerak yoki `actorId`'ga `onDelete: SetNull` qo'yish |

**Tavsiya:** AuditLog'da `actorId` FK'ni `onDelete: Restrict` qo'yamiz — admin tasodifan o'chirilmasligi uchun. Faqat ADMIN'lar boshqa ADMIN'larni o'chirishi mumkin va tarix saqlanadi.

```prisma
actor User @relation("ActorAuditLogs", fields: [actorId], references: [id], onDelete: Restrict)
```

---

## 🔐 Maxfiylik Maslahati

- **Admin yozuvlari** boshqa qatlamlardan ajratilmaydi (alohida DB schema kerak emas — Postgres `public` schema'da qoladi). Lekin endpoint darajasida cheklov qattiq bo'ladi.
- **passwordHash** admin response'larida hech qachon qaytarilmaydi (mavjud `publicUser()` helper kengaytiriladi: `role`, `suspendedAt` qo'shiladi)
- **Audit log**'larni o'chirib tashlash mumkin emas — DELETE permission faqat DB sysadmin'da qoladi

---

## 📦 Yakuniy Schema Diff (qisqartirilgan)

```prisma
// Yangi
enum Role {
  STUDENT
  CONTENT_EDITOR
  ADMIN
}

model User {
  // ... mavjud
  role          Role      @default(STUDENT)
  suspendedAt   DateTime?
  suspendReason String?
  adminNote     String?

  auditLogs     AuditLog[] @relation("ActorAuditLogs")
}

// Yangi
model AuditLog {
  id         String   @id @default(cuid())
  actorId    String
  actor      User     @relation("ActorAuditLogs", fields: [actorId], references: [id], onDelete: Restrict)
  action     String
  targetType String?
  targetId   String?
  metadata   Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  @@index([actorId])
  @@index([action])
  @@index([targetType, targetId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

Migration buyrug'i: `npx prisma migrate dev --name add_admin_roles`
