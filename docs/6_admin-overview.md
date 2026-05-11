# 🛡️ LingvaUZ — Admin Panel

## Loyiha Haqida

**Admin Panel** — LingvaUZ platformasini ichkaridan boshqarish uchun maxsus interfeys.
Maqsad: kontent yaratish, foydalanuvchilarni boshqarish va platformaning sog'lig'ini kuzatish.

---

## 🎯 Nima Uchun Kerak?

| Muammo | Yechim |
|--------|--------|
| Darslarni qo'lda SQL bilan kiritish noqulay | Kontent CRUD interfeysi |
| Spam/zararli foydalanuvchilarni bartaraf etish | Foydalanuvchi boshqaruvi (suspend, role) |
| Platforma rivojini ko'rish kerak | Analytics dashboard |
| Yangi til qo'shish murakkab | Kurs/Til yaratish ekrani |
| Buggy mashqlar foydalanuvchilarni bezdiradi | Mashqlarni tezda tahrirlash |

---

## 👥 Rollar

LingvaUZ'da **3 ta rol** bo'ladi:

| Rol | Kim | Imkoniyatlar |
|-----|-----|--------------|
| **STUDENT** | Asosiy foydalanuvchi | Til o'rganish (default rol) |
| **CONTENT_EDITOR** | Metodist / o'qituvchi | Kurslar, darslar, mashqlar, so'zlar yaratish va tahrirlash. Foydalanuvchilarga teginmaydi |
| **ADMIN** | Platforma boshqaruvchisi | Hammasi: foydalanuvchilar, rollar, kontent, analytics, sozlamalar |

> **Eslatma:** Yangi ro'yxatdan o'tgan har bir foydalanuvchi avtomatik **STUDENT** roliga ega bo'ladi. Yuqori rollar **ADMIN** tomonidan beriladi (yoki birinchi marta — qo'lda SQL orqali).

---

## 📦 Asosiy Bo'limlar

### 1. 📊 Dashboard (Bosh sahifa)
- Bugungi/haftalik/oylik faol foydalanuvchilar (DAU/WAU/MAU)
- Yangi ro'yxatdan o'tganlar
- Dars tugatish foizi
- Premium konversiya
- Eng faol kurslar
- Real-time alerts (xato sezgirligi: 5xx soni, va h.k.)

### 2. 👤 Users (Foydalanuvchilar)
- Ro'yxat: filter (rol, premium, faollik), qidiruv (email/username)
- Detail: foydalanuvchi statistikasi (XP, streak, dars tarixi)
- Amallar: rol o'zgartirish, suspend qilish, parol qayta tiklash, o'chirish
- **Faqat ADMIN ko'ra oladi**

### 3. 📚 Content (Kontent)
- **Tillar**: ro'yxat, yangi til qo'shish
- **Kurslar**: CRUD (uz→en, uz→ru, en→uz, ru→uz)
- **Unitlar**: kurs ichida tartibga solish
- **Darslar**: unit ichida, type tanlash (REGULAR / CHECKPOINT / PRACTICE / STORY)
- **Mashqlar**: 7 turli (TRANSLATE_TEXT, BUILD_SENTENCE, ...) yaratish + audio/rasm yuklash
- **So'zlar (Vocabulary)**: kategoriya, daraja (A1...C1), tarjima, audio
- **Achievementlar**: ro'yxat, yangi yutuq qo'shish
- **CONTENT_EDITOR va ADMIN ko'ra oladi**

### 4. 📈 Analytics
- Foydalanuvchi metrikasi (DAU, retention)
- Kontent metrikasi (eng ko'p tugatilgan/tashlangan darslar)
- Mashq sifati (eng ko'p xatolari ketgan mashqlar — qayta yozish kerak)
- Liga taqsimoti (har ligadagi foydalanuvchilar soni)
- **Faqat ADMIN ko'ra oladi**

---

## 🎬 Foydalanuvchi Sahnalari

### Sahna 1: Yangi til qo'shish (CONTENT_EDITOR)
1. Login → /admin
2. Content → Languages → "+" tugmasi
3. `code: "tr", name: "Turk tili", flag: "🇹🇷"` → Saqlash
4. Courses → "+" → "uz → tr" tanlash
5. Yangi unit qo'shish → 5 ta dars yaratish

### Sahna 2: Spam foydalanuvchini bloklash (ADMIN)
1. Users → qidiruv: `spammer@`
2. Foydalanuvchini topish → Detail
3. "Suspend" tugmasi → sabab kiritish
4. (Audit log avtomatik yoziladi)

### Sahna 3: Buggy mashqni tuzatish (CONTENT_EDITOR)
1. Analytics → "Eng ko'p xato qilingan mashqlar"
2. Bitta mashqni tanlash → Edit
3. To'g'ri javobni tuzatish, tarjimani aniqlashtirish → Saqlash

---

## 🗺️ MVP Qamrovi (1-versiya)

✅ **MVP'ga kiradi:**
- 3 ta rol (STUDENT/CONTENT_EDITOR/ADMIN)
- Foydalanuvchi ro'yxati + rol o'zgartirish + suspend
- Kontent CRUD (Languages, Courses, Units, Lessons, Exercises, Words)
- Dashboard (asosiy 5-6 metrika)
- Mashq sifat reyting (eng ko'p xato qilinganlar)

❌ **Keyingi versiyalarga qoldiriladi:**
- Audit log to'liq tarixi (yozish bor, lekin UI yo'q)
- Foydalanuvchi tomonidan flag qilingan mashqlar (Report modeli)
- Admin'lar uchun ikki bosqichli autentifikatsiya
- Bulk import (CSV/JSON dan darslar yuklash)
- A/B test boshqaruvi
- Audio/rasm yuklash UI (avval URL kiritish)

---

## 🛠️ Texnologik Stack

| Qatlam | Texnologiya | Eslatma |
|--------|------------|---------|
| Backend | Express + TypeScript + Prisma | Mavjud `backend/` ga modul qo'shiladi |
| Database | PostgreSQL | Schema'ga `Role` enum + `User.role` qo'shiladi |
| Web | Vite + React + Tailwind v4 | Mavjud `web/` ga `/admin/*` route qo'shiladi |
| Dizayn | Loft theme + dense table | Foydalanuvchi UI'dan farqli — desktop-first, kam emoji |
| Auth | JWT + role middleware | Mavjud `requireAuth` ustiga `requireAdmin`, `requireContentEditor` |

---

## 🔒 Xavfsizlik Tamoyillari

1. **Rollarning aniq cheklov**: har endpoint kerakli rolni talab qiladi (least privilege)
2. **Backend'da tekshirish**: frontend'da yashirish yetarli emas — har API call backend'da role tekshiradi
3. **Audit logging**: barcha admin amallar (user.delete, role.change, content.edit) DB'ga yoziladi
4. **Rate limit**: admin endpointlari ham rate-limited (brute force admin token urinishlariga qarshi)
5. **Suspend ≠ Delete**: foydalanuvchini o'chirmaslik (cascade ko'p ma'lumotni yo'qotadi); suspend qilinadi
6. **Ehtiyotkor ID exposure**: admin response'larida `passwordHash` hech qachon qaytarilmaydi (mavjud qoida)

---

## 📐 Yo'l Xaritasi

```
1-bosqich  → Schema (Role enum, User.role, AuditLog) + birinchi admin (manual SQL)
2-bosqich  → requireAdmin/requireContentEditor middleware + role JWT'da
3-bosqich  → Backend: Users API (list/role/suspend) + Content CRUD API
4-bosqich  → Backend: Stats / Dashboard API
5-bosqich  → Web: AdminShell + ProtectedRoute (role bilan)
6-bosqich  → Web: Users sahifasi
7-bosqich  → Web: Content CRUD sahifalari (Courses, Lessons, Exercises, Words)
8-bosqich  → Web: Dashboard + Analytics
9-bosqich  → E2E sinov + birinchi adminni qo'lda yaratib test qilish
```

---

## 📚 Hujjatlar

- **`6_admin-overview.md`** ← shu fayl (umumiy ko'rinish)
- **`7_admin-database.md`** — Schema o'zgarishlari, migration plan, audit log
- **`8_admin-backend.md`** — API endpointlar, middleware, validatsiya
- **`9_admin-web.md`** — UI/UX, sahifalar, komponentlar, dizayn
