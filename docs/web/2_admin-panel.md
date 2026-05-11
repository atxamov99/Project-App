# 🌐 Admin Panel — Web Frontend

## Tech Stack

| Texnologiya | Maqsad |
|------------|--------|
| **Vite + React 19** | Mavjud — admin sahifalar shu app'ga qo'shiladi |
| **React Router 6** | `/admin/*` routelari |
| **Tailwind CSS v4** | Mavjud loft theme tokenlar |
| **TanStack Query** *(tavsiya)* | Server state, kesh, mutation |
| **Lucide / Material Symbols** | Icons (mavjud) |
| **react-hook-form + Zod** *(tavsiya)* | Form boshqaruvi |

> **Eslatma:** TanStack Query va react-hook-form **hali o'rnatilmagan** — bular keyingi qadamda qo'shiladi. MVP uchun shunchaki `useState` + `fetch` ham ishlaydi, lekin kontent tahriri uchun react-hook-form yaxshiroq.

---

## 📁 Struktura

```
web/src/
├── pages/
│   ├── (mavjud — student sahifalari)
│   │
│   └── admin/
│       ├── AdminDashboard.jsx       # /admin
│       ├── AdminUsers.jsx           # /admin/users
│       ├── AdminUserDetail.jsx      # /admin/users/:id
│       ├── AdminCourses.jsx         # /admin/courses
│       ├── AdminCourseDetail.jsx    # /admin/courses/:id (units list)
│       ├── AdminLessonEditor.jsx    # /admin/lessons/:id (exercises CRUD)
│       ├── AdminWords.jsx           # /admin/words
│       ├── AdminAchievements.jsx    # /admin/achievements
│       └── AdminStats.jsx           # /admin/stats
│
├── components/
│   ├── (mavjud)
│   │
│   └── admin/
│       ├── AdminShell.jsx           # Sidebar + header layout
│       ├── AdminProtectedRoute.jsx  # role tekshirish
│       ├── DataTable.jsx            # Universal jadval (sort, filter, pagination)
│       ├── Modal.jsx                # Confirm / form modal
│       ├── FormField.jsx            # Label + input + error
│       ├── RoleBadge.jsx            # STUDENT / EDITOR / ADMIN chip
│       ├── StatCard.jsx             # Dashboard'dagi katta raqam
│       └── exercise-editors/
│           ├── TranslateEditor.jsx
│           ├── BuildSentenceEditor.jsx
│           ├── MultipleChoiceEditor.jsx
│           └── ... (har 7 mashq turi uchun)
│
└── lib/
    └── adminApi.js                  # api.admin.users.list(), api.admin.courses.create(), ...
```

---

## 🧭 Routing

`web/src/App.jsx` ga qo'shiladi:

```jsx
<Route element={<AdminProtectedRoute />}>
  <Route element={<AdminShell />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/users/:id" element={<AdminUserDetail />} />
    <Route path="/admin/courses" element={<AdminCourses />} />
    <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
    <Route path="/admin/lessons/:id" element={<AdminLessonEditor />} />
    <Route path="/admin/words" element={<AdminWords />} />
    <Route path="/admin/achievements" element={<AdminAchievements />} />
    <Route path="/admin/stats" element={<AdminStats />} />
  </Route>
</Route>
```

`AdminProtectedRoute`:
```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { isAuthed, getUser } from '../../lib/auth'

export default function AdminProtectedRoute() {
  if (!isAuthed()) return <Navigate to="/login" replace />
  const user = getUser()
  if (!['ADMIN', 'CONTENT_EDITOR'].includes(user?.role)) {
    return <Navigate to="/learn" replace />
  }
  return <Outlet />
}
```

> **Eslatma:** `ADMIN`'ga maxsus sahifalar (Users, Stats) ichkarida qo'shimcha role tekshirish qiladi (CONTENT_EDITOR ko'rsa "Sizga ruxsat yo'q" chiqaradi).

---

## 🎨 Dizayn Tamoyillari

Admin panel **foydalanuvchi UI'dan farq qiladi:**

| Foydalanuvchi UI | Admin Panel |
|------------------|-------------|
| Mobile-first | **Desktop-first** (≥ 1024px) |
| Ko'p emoji, mascot | **Kam emoji**, business style |
| Yumshoq tugmalar (paper-lift, terracotta-lift) | Oddiy flat tugmalar |
| `loft-shadow` (yumshoq) | Aniq border'lar va `border-outline-variant` |
| Markaz alligned, max-w-md | Keng tablitsalar, `max-w-7xl` |
| Animatsiyalar | Minimal animatsiya — tezkorlik birinchi |

Lekin **rang sxemasi va shrift bir xil qoladi** (Loft theme tokenlar):
- Background: `surface-container-low` (#f5f3ee)
- Card fon: `surface-container-lowest` (#ffffff)
- Primary aksent: `secondary` (#a03f2e) — aktiv tab, primary tugmalar
- Border: `outline-variant` (#d6c2bb)
- Text: `on-surface` (#1b1c19)

> Maqsad: brand uzluksizligi (xuddi bitta platforma), lekin "ish quroli" his-tuyg'usi.

---

## 🧱 Asosiy Komponentlar

### `AdminShell.jsx` — sidebar + header

```
┌─────────────────────────────────────────────────────┐
│  🛡️ LingvaUZ Admin           [Search]   👤 Aziz ▾  │
├──────────┬──────────────────────────────────────────┤
│ 📊 Dash  │                                          │
│ 👤 Users │            <Outlet />                    │
│ 📚 Cours │                                          │
│ 📝 Less. │                                          │
│ 💬 Words │                                          │
│ 🏆 Achv. │                                          │
│ 📈 Stats │                                          │
│          │                                          │
│ ─────    │                                          │
│ ↩ Exit   │                                          │
└──────────┴──────────────────────────────────────────┘
```

- Sidebar 240px, fixed
- Header 56px, sticky
- "Exit" — `/learn` ga qaytaradi (admin ham oddiy o'rganishi mumkin)

### `DataTable.jsx`

Props:
```js
{
  columns: [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Rol', render: (row) => <RoleBadge role={row.role} /> },
    ...
  ],
  data: [...],
  loading: bool,
  pagination: { page, total, limit },
  onPageChange,
  onSortChange,
  onRowClick: (row) => navigate(`/admin/users/${row.id}`)
}
```

Belgilar:
- Sticky header
- Hover row — `bg-surface-container-low`
- Cursor-pointer agar `onRowClick` bo'lsa
- Pastida: `Showing 1–20 of 132 • [<] 1 2 3 [>]`
- Bo'sh: "Hech nima topilmadi" + filterni tozalash tugmasi

### `Modal.jsx`

```jsx
<Modal isOpen={open} onClose={close} title="Rolni o'zgartirish">
  <p>Foydalanuvchini <b>CONTENT_EDITOR</b> qilmoqchimisiz?</p>
  <div className="flex gap-2 justify-end mt-4">
    <button onClick={close}>Bekor</button>
    <button onClick={confirm} className="bg-secondary text-white">Tasdiqlash</button>
  </div>
</Modal>
```

- Center-aligned, max-w-md
- Backdrop blur + click-to-close
- Esc bilan yopilish

---

## 📄 Sahifa Tafsilotlari

### 1. AdminDashboard (`/admin`)

```
[Users: 1320]    [DAU: 458]    [Premium: 42]    [New today: 18]
                                                              
Lessons completed today: 1 843                                
Avg session: 8.2 min                                          
Completion rate: 71%                                          

[Eng faol kurslar table]
[Eng ko'p xato qilingan mashqlar table]
```

- 4 ta KPI kartochkasi yuqorida (`StatCard`)
- 2 ta engagement satr
- 2 ta jadval pastda (yengil — TOP 5 ko'rsatish)
- Refresh tugmasi (cron yo'q — admin ko'rib turib bossa kifoya)

### 2. AdminUsers (`/admin/users`)

```
Filters: [Rol▾] [Premium▾] [Status▾] [Search: ____________]

┌─────────────────────────────────────────────────────────┐
│ # │ Email          │ Username  │ Rol      │ XP   │ ...  │
├─────────────────────────────────────────────────────────┤
│ 1 │ aziz@e.uz      │ aziz_99   │ STUDENT  │ 1540 │      │
│ 2 │ admin@e.uz     │ admin     │ ADMIN    │ 0    │      │
└─────────────────────────────────────────────────────────┘
```

- DataTable + filters
- Row click → `/admin/users/:id`
- "Yangi foydalanuvchi" tugmasi yo'q (faqat real ro'yxatdan o'tish orqali yaratiladi)

### 3. AdminUserDetail (`/admin/users/:id`)

3 ta tab:
- **Overview** — asosiy ma'lumot, statistika kartalari (XP, streak, lives, premium)
- **Actions** — rolni o'zgartirish, suspend/unsuspend, reset password (kelajak), o'chirish
- **Activity** — oxirgi darslar, audit log (kelajak)

Suspend tugmasi modali:
- "Sababni kiriting" textarea
- Confirm → backend POST → audit log → toast

### 4. AdminCourses + AdminCourseDetail

- Courses sahifasida grid (har kart bitta kurs: flag emoji, til nomi, dars soni, faollik toggle)
- "Yangi kurs" → modal (fromLanguage, toLanguage select)
- Detail → unitlar ro'yxati + drag-to-reorder + "+ Unit"

### 5. AdminLessonEditor (`/admin/lessons/:id`)

Eng murakkab sahifa:

```
[Dars sozlamalari: order, type, xpReward]

Mashqlar:
├─ #1 TRANSLATE_TEXT — "Salom"  →  "Hello"  [✏ ✕]
├─ #2 MULTIPLE_CHOICE — ...                    [✏ ✕]
└─ [+ Mashq qo'shish ▾]   (turini tanlash)

```

Har mashq turining alohida editor komponenti:
- `TranslateEditor`: question + correctAnswer + 3 ta wrongAnswer + words[]
- `BuildSentenceEditor`: question + correctAnswer (so'zlar avtomatik bo'linadi) + qo'shimcha so'zlar
- `MultipleChoiceEditor`: 4 ta variant, to'g'risini tanlash
- `ListenAndTypeEditor`: audio URL + correctAnswer
- ... (har 7 turi)

### 6. AdminWords (`/admin/words`)

- DataTable: text, translation, category, level, language
- Filter: language, category, level
- Inline edit (cell click qilib o'zgartirish) yoki Modal
- "Yangi so'z" → Modal

### 7. AdminAchievements

- Ro'yxat: key, title, gem reward, xp reward
- Edit modal

### 8. AdminStats (`/admin/stats`)

Dashboard'dan ko'proq detal:
- Foydalanuvchi grafigi (sanasi/ro'yxat soni) — sodda chart kutubxonasi (`recharts` yoki `chart.js`)
- Eng troubled mashqlar — DataTable, har qator tugma "Edit" → AdminLessonEditor

---

## 🔌 API Klient

`web/src/lib/adminApi.js` (yangi fayl):

```js
import { api } from './api'

export const adminApi = {
  users: {
    list:      (params)        => api.get('/admin/users', { params }),
    get:       (id)            => api.get(`/admin/users/${id}`),
    changeRole:(id, role)      => api.patch(`/admin/users/${id}/role`, { role }),
    suspend:   (id, reason)    => api.post(`/admin/users/${id}/suspend`, { reason }),
    unsuspend: (id)            => api.post(`/admin/users/${id}/unsuspend`),
    delete:    (id)            => api.delete(`/admin/users/${id}`),
  },
  courses: {
    list:    ()            => api.get('/admin/courses'),
    create:  (data)        => api.post('/admin/courses', data),
    update:  (id, data)    => api.patch(`/admin/courses/${id}`, data),
    delete:  (id)          => api.delete(`/admin/courses/${id}`),
  },
  // ... lessons, exercises, words, stats
}
```

> **Eslatma:** mavjud `web/src/lib/api.js` `fetch` ishlatadi (no axios). `adminApi.js` shu pattern'ni davom ettiradi.

---

## 🔐 Frontend Auth Sinxronlashtirish

- Login/Register javobida `user.role` qaytadi
- `web/src/lib/auth.js` da `saveSession` allaqachon to'liq user object'ni saqlaydi → role avtomatik
- Logout'da `clearSession` ishlatiladi
- `AdminShell` da: agar role o'zgargan bo'lsa (boshqa admin tomonidan) → `api.me()` qaytadan chaqiriladi → eski rol mos kelmasa logout

---

## 🧪 Sinov Strategiyasi

### Manual smoke test (har sahifa uchun):
1. Browser'da admin akkaunti bilan login
2. Sidebar'dan har bir bo'limga kirish
3. Bitta CRUD oqimini sinash (yangi unit yarat → tahrirlash → o'chirish)
4. Foydalanuvchi rolini STUDENT'ga qaytarib, `/admin/*` ga kirib bo'lmasligini tekshirish

### Komponent testlari (kelajakda):
- `DataTable` sort/filter/pagination
- `Modal` Esc + backdrop click
- `RoleBadge` har 3 rol uchun to'g'ri rang

---

## ♿ Foydalanuvchanlik (a11y)

- Klaviatura navigatsiyasi (Tab, Enter, Esc)
- Modal ochilganda focus trap, yopilganda focus tugmaga qaytadi
- Form input'larda `aria-label` yoki ko'rinadigan `<label>`
- Tablitsalarda `<th scope="col">`
- Statuslar uchun rang yolg'iz emas (icon + matn ham)

---

## 🚀 Yo'l xaritasi (web uchun)

```
1   → AdminProtectedRoute + AdminShell layout (sidebar nav)
2   → AdminDashboard (mock data bilan, keyin real API)
3   → DataTable + Modal universal komponentlari
4   → AdminUsers (list + filters + role change modal)
5   → AdminUserDetail (3 tab)
6   → AdminCourses + AdminCourseDetail
7   → AdminLessonEditor (eng murakkab — bir necha kun)
8   → AdminWords + AdminAchievements
9   → AdminStats (asosiy charts)
10  → Manual sinovlar
```

---

## 🎁 Keyingi versiyalarga qoldiriladi

- **Cell inline editing** (Excel kabi)
- **Bulk import** (CSV/JSON)
- **Audio/rasm yuklash** (hozir URL kiritish)
- **Drag-and-drop reorder** (units, lessons, exercises)
- **Audit log UI** (hozir DB'dan ko'riladi)
- **Reports/Flagged exercises**
- **Two-factor admin login**
- **Mobile responsive admin** (hozir desktop-only)
