# 🌐 Web Frontend Hujjatlari

LingvaUZ web ilovasi (Vite + React 19 + Tailwind v4) bilan bog'liq hamma narsa shu papkada.

## 📚 Hujjatlar

| Fayl | Mavzu |
|------|-------|
| [`1_architecture.md`](./1_architecture.md) | Asosiy web arxitekturasi — papka tuzilmasi, routing, asosiy komponentlar, sahifa misollari |
| [`2_admin-panel.md`](./2_admin-panel.md) | Admin panel UI — `AdminShell`, `DataTable`, sahifalar, exercise editorlari |
| [`3_design-system.md`](./3_design-system.md) | **Loft** dizayn tizimi — ranglar, shrift, soyalar, komponentlar (Stitch'dan ko'chirilgan) |

## 🎨 Dizayn xarakteri

- **Loft estetikasi** — kremrang fon, jigarrang aksent, terracotta urg'ulari
- **Plus Jakarta Sans** shrifti (ko'rinish uchun ochiq, o'qish uchun qulay)
- **Hand-drawn his-tuyg'usi** — `paper-lift`, `terracotta-lift`, yumshoq `loft-shadow`
- **Tarvuz 🍉** maskoti har joyda (margin'lardan qaraydi, hint kartalarida, profil iqtibos kartasida)
- Tipik korporativ web emas — har element o'zining xarakteriga ega

## 📐 Responsive Strategiya

| Breakpoint | Qachon | O'zgarishlar |
|-----------|--------|--------------|
| `< 768px` (mobile) | Telefon | TopAppBar + BottomNav, vertikal layout |
| `≥ 768px` (md) | Tablet/desktop | Chap **SideNav** (264px), bottom nav yashirin, ko'p ustunli layoutlar |
| `≥ 1024px` (lg) | Desktop | Lesson sahifasi 2-ustunli (markaz + hint paneli) |
| `≥ 1280px` (xl) | Keng desktop | Learn sahifasida tarvuz chetdan qaraydi |

## 🔌 Backend Bog'lanish

Web `/api/*` orqali backend bilan bog'lanadi:
- Student API: auth, courses, lessons, exercises, league, friends, words
- Admin API: `/api/admin/*` (rol-asoslangan ruxsat)

Frontend klient: `web/src/lib/api.js` — `api.*` (student) va `adminApi.*` (admin).

## ✅ Joriy holat (2026-05)

- Auth oqimi (register / login / Google) — to'liq
- Landing, Lesson, Learn, Practice, Leaderboard, Profile sahifalari — desktop+mobile
- Admin Panel: Dashboard + Users + Content CRUD + Stats + 3 ta mashq editor (TRANSLATE_TEXT, BUILD_SENTENCE, MULTIPLE_CHOICE)
- Friends: real-time qidiruv + obuna/bekor qilish
- League: real haftalik leaderboard
- Hisob bo'limi: Sozlamalar / Bildirishnomalar / Maxfiylik / Yordam — modallar bilan ishlaydi

## 🚧 Hali yo'q (kelajakka)

- Qolgan 4 mashq turi editorlari (LISTEN_AND_TYPE, MATCH_PAIRS, SELECT_IMAGE, FILL_IN_BLANK)
- Audio/rasm yuklash UI (hozir URL kiritish)
- Bulk import (CSV/JSON)
- Audit log UI
- Drag-and-drop reorder
- Mobile responsive admin panel (hozir desktop-only)
