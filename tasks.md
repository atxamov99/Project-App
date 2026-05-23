# 📋 LingvaUZ — Qolgan Vazifalar

## 📱 Mobile (React Native + Expo SDK 55) — JORIY

### ✅ Bajarildi
- [x] `mobile/` papkasi yaratildi (Expo SDK 55 + expo-router v5)
- [x] `package.json`, `app.json`, `tsconfig.json`, `babel.config.js`
- [x] `constants/colors.ts` — brand ranglar
- [x] `types/index.ts` — barcha TypeScript turlari
- [x] `lib/api.ts` — Axios instance (token interceptor bilan)
- [x] `lib/queryClient.ts` — TanStack Query klient
- [x] `store/authStore.ts` — Zustand + AsyncStorage persistence
- [x] `store/lessonStore.ts` — Dars holati store
- [x] `app/_layout.tsx` — Root layout (auth guard + QueryClient)
- [x] `app/(auth)/_layout.tsx` + `login.tsx` + `register.tsx`
- [x] `app/(tabs)/_layout.tsx` — Tab bar (streak + lives header)
- [x] `app/(tabs)/index.tsx` — Kurs haritasi
- [x] `app/(tabs)/practice.tsx` — So'z takrorlash
- [x] `app/(tabs)/leaderboard.tsx` — Liga
- [x] `app/(tabs)/profile.tsx` — Profil
- [x] `app/lesson/[id].tsx` — Dars ekrani (state machine)
- [x] `hooks/useLesson.ts` — Dars logikasi hook
- [x] `hooks/useNotifications.ts` — Streak eslatmalar
- [x] `components/lesson/ProgressBar.tsx`
- [x] `components/lesson/LivesBar.tsx`
- [x] `components/lesson/AnswerFooter.tsx`
- [x] `components/lesson/CompleteScreen.tsx`
- [x] `components/lesson/ExerciseRenderer.tsx`
- [x] `components/lesson/exercises/TranslateText.tsx`
- [x] `components/lesson/exercises/BuildSentence.tsx`
- [x] `components/lesson/exercises/ListenType.tsx`
- [x] `components/lesson/exercises/SpeakCheck.tsx`
- [x] `components/lesson/exercises/MatchPairs.tsx`
- [x] `components/lesson/exercises/SelectImage.tsx`
- [x] `components/lesson/exercises/FillInBlank.tsx`
- [x] `components/lesson/exercises/MultipleChoice.tsx`
- [x] `components/home/UnitHeader.tsx`
- [x] `components/home/LessonBubble.tsx`
- [x] `components/shared/StreakFlame.tsx`
- [x] `components/shared/GemsCounter.tsx`
- [x] `components/shared/Mascot.tsx`
- [x] `utils/audio.ts`

### 🔜 Keyingi qadamlar
- [ ] `npm install` ishga tushirish va bog'liqliklarni tekshirish
- [ ] Expo Go SDK 55 da sinovdan o'tkazish
- [ ] Backend bilan ulash (real API URL)
- [ ] Assets qo'shish (icon.png, splash-icon.png, adaptive-icon.png)

---

## ⚙️ Backend — Qolgan modullar

- [ ] `src/modules/users/` — profil CRUD
- [ ] `src/modules/courses/` — kurslar ro'yxati, unitlar
- [ ] `src/modules/lessons/` — darslar, mashqlar
- [ ] `src/modules/streak/` — streak tizimi (cron job bilan)
- [ ] `src/modules/lives/` — hayot tizimi (refill cron)
- [ ] `src/modules/league/` — liga haftalik reset
- [ ] `src/modules/words/` — spaced repetition
- [ ] `src/modules/achievements/` — yutuqlar
- [ ] `src/modules/shop/` — gem do'koni
- [ ] `src/config/redis.ts` — Redis ulash
- [ ] `src/jobs/streak-check.job.ts`
- [ ] `src/jobs/lives-refill.job.ts`
- [ ] Prisma seed data (1 kurs, 3 unit, 20 dars)

## 🌐 Web (my-app) — Qolgan

- [ ] React Router + sahifalar (`Home`, `Login`, `Register`, `Learn`, `Lesson`)
- [ ] TanStack Query + Axios setup
- [ ] Zustand stores (auth, lesson)
- [ ] Barcha komponentlar (LessonNode, ExerciseWrapper, AnswerBar, va h.k.)
- [ ] Tailwind CSS qo'shish
- [ ] Framer Motion animatsiyalar

## 🚀 Deploy

- [ ] Backend → Railway yoki Render
- [ ] Web → Vercel
- [ ] Mobile → EAS Build (TestFlight + Google Play Internal)
- [ ] PostgreSQL va Redis production sozlamalari
