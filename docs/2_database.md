# 🗄️ LingvaUZ — Database Arxitekturasi

## Texnologiyalar

| Vazifa | Texnologiya | Sabab |
|--------|------------|-------|
| Asosiy DB | **PostgreSQL 16** | Murakkab bog'liqliklar |
| Cache | **Redis 7** | Streak, session, leaderboard |
| Fayllar | **Cloudinary** | Audio, rasm |
| Search | **Prisma Full-text** | So'z qidirish |
| ORM | **Prisma** | Type-safe |

---

## 📐 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── FOYDALANUVCHI ─────────────────────────────

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  phone         String?  @unique
  passwordHash  String
  username      String   @unique
  displayName   String
  avatar        String?
  gems          Int      @default(0)
  totalXP       Int      @default(0)
  streak        Int      @default(0)
  longestStreak Int      @default(0)
  lastActiveAt  DateTime?
  streakFreezes Int      @default(0)
  isPremium     Boolean  @default(false)
  premiumUntil  DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  lives         UserLives?
  progress      CourseProgress[]
  lessonResults LessonResult[]
  wordProgress  WordProgress[]
  leagueEntry   LeagueEntry?
  achievements  UserAchievement[]
  sessions      Session[]

  @@map("users")
}

model UserLives {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  current     Int      @default(5)
  max         Int      @default(5)
  refillAt    DateTime? // qachon to'liq tiklanadi
  updatedAt   DateTime @updatedAt

  @@map("user_lives")
}

// ─── TIL VA KURS TUZILMASI ─────────────────────

model Language {
  id          String   @id @default(cuid())
  code        String   @unique // "en", "ru", "uz"
  name        String   // "Ingliz tili"
  nativeName  String   // "English"
  flag        String   // emoji yoki URL
  isActive    Boolean  @default(true)

  fromCourses Course[] @relation("fromLang")
  toCourses   Course[] @relation("toLang")
  words       Word[]

  @@map("languages")
}

model Course {
  id             String   @id @default(cuid())
  fromLanguageId String
  fromLanguage   Language @relation("fromLang", fields: [fromLanguageId], references: [id])
  toLanguageId   String
  toLanguage     Language @relation("toLang", fields: [toLanguageId], references: [id])
  // "uz→en", "uz→ru", "en→uz", "ru→uz"
  totalLearners  Int      @default(0)
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())

  units    Unit[]
  progress CourseProgress[]

  @@unique([fromLanguageId, toLanguageId])
  @@map("courses")
}

model Unit {
  id          String  @id @default(cuid())
  courseId    String
  course      Course  @relation(fields: [courseId], references: [id])
  order       Int
  title       String  // "Asoslar 1", "Sayohat"
  description String?
  color       String  // "#58CC02"
  icon        String  // emoji

  lessons Lesson[]

  @@map("units")
}

model Lesson {
  id       String     @id @default(cuid())
  unitId   String
  unit     Unit       @relation(fields: [unitId], references: [id])
  order    Int
  type     LessonType @default(REGULAR)
  xpReward Int        @default(10)

  exercises LessonExercise[]
  results   LessonResult[]

  @@map("lessons")
}

enum LessonType {
  REGULAR
  CHECKPOINT   // 5 darsdan keyin test
  PRACTICE     // takrorlash
  STORY        // hikoya shaklida
}

// ─── MASHQLAR ──────────────────────────────────

model Exercise {
  id             String       @id @default(cuid())
  type           ExerciseType
  question       String       // asosiy matn/gap
  questionAudio  String?      // Cloudinary URL
  questionImage  String?      // Cloudinary URL
  correctAnswer  String       // to'g'ri javob
  wrongAnswers   String[]     // noto'g'ri variantlar (3 ta)
  explanation    String?      // nima uchun shunday
  difficulty     Int          @default(1) // 1-3
  targetLangCode String       // "en", "ru", "uz"
  createdAt      DateTime     @default(now())

  lessonLinks LessonExercise[]
  wordLinks   ExerciseWord[]

  @@map("exercises")
}

enum ExerciseType {
  TRANSLATE_TEXT       // Matnni tarjima qil
  BUILD_SENTENCE       // So'zlardan jumla qur
  LISTEN_AND_TYPE      // Eshit va yoz
  SPEAK_AND_CHECK      // Gapir (talaffuz)
  MATCH_PAIRS          // Juftlashtir
  SELECT_IMAGE         // Rasmni tanla
  FILL_IN_BLANK        // Bo'shliqni to'ldirish
  MULTIPLE_CHOICE      // To'g'ri variantni tanla
}

model LessonExercise {
  id         String   @id @default(cuid())
  lessonId   String
  lesson     Lesson   @relation(fields: [lessonId], references: [id])
  exerciseId String
  exercise   Exercise @relation(fields: [exerciseId], references: [id])
  order      Int

  @@unique([lessonId, exerciseId])
  @@map("lesson_exercises")
}

// ─── SO'ZLAR (VOCABULARY) ──────────────────────

model Word {
  id           String   @id @default(cuid())
  languageId   String
  language     Language @relation(fields: [languageId], references: [id])
  text         String
  translation  String   // O'zbek tilidagi tarjima
  pronunciation String? // translit
  audioUrl     String?
  imageUrl     String?
  category     String   // "Ovqat", "Hayvonlar", "Ranglar"
  level        String   // "A1", "A2", "B1"

  exerciseLinks ExerciseWord[]
  userProgress  WordProgress[]

  @@map("words")
}

model ExerciseWord {
  exerciseId String
  exercise   Exercise @relation(fields: [exerciseId], references: [id])
  wordId     String
  word       Word     @relation(fields: [wordId], references: [id])

  @@id([exerciseId, wordId])
  @@map("exercise_words")
}

// ─── FOYDALANUVCHI PROGRESSI ───────────────────

model CourseProgress {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  courseId      String
  course        Course    @relation(fields: [courseId], references: [id])
  currentUnitId String?
  currentLessonId String?
  totalXP       Int       @default(0)
  startedAt     DateTime  @default(now())
  lastStudiedAt DateTime?

  @@unique([userId, courseId])
  @@map("course_progress")
}

model LessonResult {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  xpEarned    Int
  mistakes    Int      @default(0)
  timeTaken   Int      // soniyada
  completedAt DateTime @default(now())

  @@map("lesson_results")
}

model WordProgress {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  wordId       String
  word         Word     @relation(fields: [wordId], references: [id])
  strength     Int      @default(0)   // 0-5 (spaced repetition)
  nextReviewAt DateTime @default(now())
  reviewCount  Int      @default(0)
  lastCorrect  Boolean  @default(false)

  @@unique([userId, wordId])
  @@map("word_progress")
}

// ─── LIGA TIZIMI ───────────────────────────────

model League {
  id    String      @id @default(cuid())
  name  String      // "Bronze", "Diamond"
  order Int         // 1 = eng past
  color String
  icon  String

  entries LeagueEntry[]

  @@map("leagues")
}

model LeagueEntry {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  leagueId  String
  league    League   @relation(fields: [leagueId], references: [id])
  groupId   String   // haftalik guruh ID
  weeklyXP  Int      @default(0)
  weekStart DateTime

  @@map("league_entries")
}

// ─── ACHIEVEMENTS (YUTUQLAR) ───────────────────

model Achievement {
  id          String  @id @default(cuid())
  key         String  @unique // "STREAK_7", "WORDS_100"
  title       String
  description String
  icon        String
  gemReward   Int     @default(0)
  xpReward    Int     @default(0)

  userAchievements UserAchievement[]

  @@map("achievements")
}

model UserAchievement {
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  earnedAt      DateTime    @default(now())

  @@id([userId, achievementId])
  @@map("user_achievements")
}

// ─── SESSION ───────────────────────────────────

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  device    String?
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@map("sessions")
}
```

---

## 📊 Redis Strukturasi

```
# Streak
streak:{userId}           → { current, lastDate }  TTL: 2 kun

# Hayot (Lives)
lives:{userId}            → { count, refillAt }

# Liga Leaderboard (haftalik)
league:week:{weekId}:{leagueId}:{groupId}  → Sorted Set (userId → XP)

# Session
session:{token}           → userId  TTL: 30 kun

# Rate limit
ratelimit:{ip}            → counter  TTL: 1 daqiqa

# Kontent Cache
cache:course:{id}         → JSON  TTL: 1 soat
cache:lesson:{id}         → JSON  TTL: 30 daqiqa
```

---

## 🌱 Seed Data — Kontent Misoli

```typescript
// O'zbek → Ingliz | A1 | Dars 1: Salomlashish
const greetingsLesson = {
  exercises: [
    {
      type: 'SELECT_IMAGE',
      question: 'Hello',
      correctAnswer: 'Salom',
      wrongAnswers: ['Xayr', 'Rahmat', 'Kechirasiz'],
    },
    {
      type: 'TRANSLATE_TEXT',
      question: 'Salom, qandaysiz?',
      correctAnswer: 'Hello, how are you?',
      wrongAnswers: ['Goodbye, how are you?', 'Hello, what is your name?'],
    },
    {
      type: 'BUILD_SENTENCE',
      question: 'My name is Jasur',
      correctAnswer: 'Mening ismim Jasur',
      // so'zlar: ["Mening", "ismim", "Jasur", "emas", "bu"]
    },
    {
      type: 'LISTEN_AND_TYPE',
      questionAudio: 'https://cdn.lingvauz.uz/audio/en/goodbye.mp3',
      correctAnswer: 'Goodbye',
    },
  ]
}
```

---

## 🔄 Migrations

```bash
npx prisma migrate dev --name init
npx prisma migrate deploy      # production
npx prisma db seed             # test ma'lumotlar
npx prisma studio              # GUI
```
