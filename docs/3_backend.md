# ⚙️ LingvaUZ — Backend Arxitekturasi

## Tech Stack

| Texnologiya | Versiya | Maqsad |
|------------|---------|--------|
| **Node.js** | 20 LTS | Runtime |
| **Express.js** | 4.x | HTTP framework |
| **TypeScript** | 5.x | Type safety |
| **Prisma** | 5.x | ORM |
| **Redis** | 7.x | Cache, streak, lives |
| **Bull** | 4.x | Background jobs |
| **JWT** | — | Auth |
| **Zod** | 3.x | Validation |
| **Cloudinary** | — | Audio/rasm |

---

## 📁 Struktura

```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── courses/
│   │   ├── lessons/
│   │   ├── exercises/
│   │   ├── progress/
│   │   ├── streak/
│   │   ├── lives/
│   │   ├── league/
│   │   ├── achievements/
│   │   └── words/
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validate.ts
│   │   └── rateLimit.ts
│   │
│   ├── jobs/
│   │   ├── streak-check.job.ts
│   │   └── lives-refill.job.ts
│   │
│   └── utils/
│       ├── spacedRepetition.ts
│       ├── xpCalculator.ts
│       └── leaguePromotion.ts
│
├── prisma/
└── package.json
```

---

## 🔌 API Endpointlar

### Auth
```
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout
POST  /api/auth/refresh
```

### Kurslar
```
GET   /api/courses                    # Mavjud barcha kurslar (uz→en, uz→ru...)
GET   /api/courses/:id                # Kurs tafsilotlari + unitlar
POST  /api/courses/:id/enroll         # Kursga yozilish
```

### Darslar
```
GET   /api/lessons/:id                # Dars + barcha mashqlar
POST  /api/lessons/:id/complete       # Darsni yakunlash (XP, streak, hayot)
GET   /api/units/:id/lessons          # Unitdagi darslar
```

### Mashq Natijasi
```
POST  /api/exercises/:id/check        # Javobni tekshirish
```

### Progress
```
GET   /api/progress                   # Mening barcha kurs proglarsim
GET   /api/progress/stats             # Statistika (grafik uchun)
GET   /api/progress/words             # So'z holati (spaced repetition)
```

### Streak va Hayot
```
GET   /api/streak                     # Hozirgi streak
GET   /api/lives                      # Hayot soni
POST  /api/lives/buy                  # Gem bilan sotib olish
POST  /api/streak/freeze              # Streak freeze ishlatish
```

### Liga
```
GET   /api/league                     # Mening liga + haftalik guruh
GET   /api/league/leaderboard         # TOP 30 shu haftada
```

### So'zlar
```
GET   /api/words/review               # Takrorlash kerak so'zlar
POST  /api/words/:id/reviewed         # Takrorlash natijasi
```

### Do'kon
```
GET   /api/shop                       # Sotib olish mumkin narsalar
POST  /api/shop/buy                   # Gem bilan sotib olish
```

---

## 💻 Asosiy Kod Namunalar

### `src/modules/lessons/lessons.service.ts`
```typescript
import { prisma } from '../../config/db'
import { redis } from '../../config/redis'
import { calculateXP } from '../../utils/xpCalculator'
import { updateStreak } from '../streak/streak.service'
import { deductLife } from '../lives/lives.service'

export class LessonsService {

  // Darsni yakunlash — eng muhim logika
  async completeLesson(userId: string, lessonId: string, data: {
    mistakes: number
    timeTaken: number
    answers: { exerciseId: string; correct: boolean }[]
  }) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { unit: { include: { course: true } } }
    })
    if (!lesson) throw new Error('Dars topilmadi')

    // XP hisoblash (xato ko'p bo'lsa kamroq XP)
    const xpEarned = calculateXP(lesson.xpReward, data.mistakes)

    // Natijani saqlash
    const result = await prisma.lessonResult.create({
      data: {
        userId,
        lessonId,
        xpEarned,
        mistakes: data.mistakes,
        timeTaken: data.timeTaken,
      }
    })

    // User XP va totalXP yangilash
    await prisma.user.update({
      where: { id: userId },
      data: { totalXP: { increment: xpEarned } }
    })

    // Kurs XP yangilash
    await prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId: lesson.unit.courseId } },
      update: {
        totalXP: { increment: xpEarned },
        currentLessonId: lessonId,
        lastStudiedAt: new Date(),
      },
      create: {
        userId,
        courseId: lesson.unit.courseId,
        totalXP: xpEarned,
        currentLessonId: lessonId,
      }
    })

    // Streak yangilash
    const streakResult = await updateStreak(userId)

    // Liga XP yangilash
    await this.updateLeagueXP(userId, xpEarned)

    // Achievement tekshirish
    await this.checkAchievements(userId, streakResult.streak)

    return { xpEarned, streak: streakResult.streak, result }
  }

  // Javobni tekshirish (har bir mashq uchun)
  async checkAnswer(userId: string, exerciseId: string, answer: string) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { wordLinks: { include: { word: true } } }
    })
    if (!exercise) throw new Error('Mashq topilmadi')

    const isCorrect = exercise.correctAnswer.toLowerCase().trim() ===
                      answer.toLowerCase().trim()

    // Xato bo'lsa hayot kamaytirish
    if (!isCorrect) {
      await deductLife(userId)
    }

    // So'z progressini yangilash (spaced repetition)
    for (const { word } of exercise.wordLinks) {
      await this.updateWordProgress(userId, word.id, isCorrect)
    }

    return {
      isCorrect,
      correctAnswer: isCorrect ? null : exercise.correctAnswer,
      explanation: isCorrect ? null : exercise.explanation,
    }
  }

  private async updateLeagueXP(userId: string, xp: number) {
    const entry = await prisma.leagueEntry.findUnique({ where: { userId } })
    if (!entry) return
    await prisma.leagueEntry.update({
      where: { userId },
      data: { weeklyXP: { increment: xp } }
    })
    // Redis sorted set ham yangilaymiz (real-time leaderboard uchun)
    const key = `league:week:${entry.groupId}`
    await redis.zincrby(key, xp, userId)
  }

  private async updateWordProgress(userId: string, wordId: string, correct: boolean) {
    const progress = await prisma.wordProgress.findUnique({
      where: { userId_wordId: { userId, wordId } }
    })

    // SM-2 Spaced Repetition algoritmi
    const currentStrength = progress?.strength ?? 0
    const newStrength = correct
      ? Math.min(currentStrength + 1, 5)
      : Math.max(currentStrength - 1, 0)

    // Keyingi takrorlash vaqti (kun)
    const intervals = [1, 2, 4, 8, 16, 32]
    const nextReviewAt = new Date()
    nextReviewAt.setDate(nextReviewAt.getDate() + intervals[newStrength])

    await prisma.wordProgress.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { strength: newStrength, nextReviewAt, lastCorrect: correct,
                reviewCount: { increment: 1 } },
      create: { userId, wordId, strength: newStrength, nextReviewAt,
                lastCorrect: correct, reviewCount: 1 }
    })
  }

  private async checkAchievements(userId: string, streak: number) {
    const milestones: Record<number, string> = {
      7: 'STREAK_7', 30: 'STREAK_30', 100: 'STREAK_100'
    }
    const key = milestones[streak]
    if (!key) return

    const exists = await prisma.userAchievement.findFirst({
      where: { userId, achievement: { key } }
    })
    if (exists) return

    const achievement = await prisma.achievement.findUnique({ where: { key } })
    if (!achievement) return

    await prisma.userAchievement.create({
      data: { userId, achievementId: achievement.id }
    })
    await prisma.user.update({
      where: { id: userId },
      data: {
        gems: { increment: achievement.gemReward },
        totalXP: { increment: achievement.xpReward }
      }
    })
  }
}
```

### `src/modules/streak/streak.service.ts`
```typescript
import { prisma } from '../../config/db'
import { redis } from '../../config/redis'

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('Foydalanuvchi topilmadi')

  const today = new Date().toDateString()
  const lastActive = user.lastActiveAt?.toDateString()

  let newStreak = user.streak

  if (lastActive === today) {
    // Bugun allaqachon o'rganilgan
    return { streak: user.streak }
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  if (lastActive === yesterday.toDateString()) {
    // Kecha o'rganilgan → streak davom etadi
    newStreak += 1
  } else if (user.streakFreezes > 0 && lastActive) {
    // 1 kun o'tkazib yuborganda freeze ishlatish
    newStreak = user.streak
    await prisma.user.update({
      where: { id: userId },
      data: { streakFreezes: { decrement: 1 } }
    })
  } else {
    // Streak uzildi 😢
    newStreak = 1
  }

  const longestStreak = Math.max(newStreak, user.longestStreak)

  await prisma.user.update({
    where: { id: userId },
    data: { streak: newStreak, longestStreak, lastActiveAt: new Date() }
  })

  // Redis cache
  await redis.set(`streak:${userId}`, newStreak, 'EX', 172800)

  return { streak: newStreak, isNew: newStreak > user.streak }
}
```

### `src/modules/lives/lives.service.ts`
```typescript
import { prisma } from '../../config/db'

const MAX_LIVES = 5
const REFILL_MINUTES = 30 // har 30 daqiqada 1 hayot

export async function deductLife(userId: string) {
  const lives = await prisma.userLives.findUnique({ where: { userId } })

  if (!lives || lives.current <= 0) {
    throw new Error('Hayot yo\'q! Premium xarid qiling yoki kuting.')
  }

  const newCount = lives.current - 1
  const refillAt = newCount < MAX_LIVES
    ? new Date(Date.now() + REFILL_MINUTES * 60 * 1000)
    : null

  await prisma.userLives.update({
    where: { userId },
    data: { current: newCount, refillAt }
  })

  return { lives: newCount, refillAt }
}

// Har 30 daqiqada ishlaydigan cron job
export async function refillLives() {
  const now = new Date()
  const needsRefill = await prisma.userLives.findMany({
    where: {
      current: { lt: MAX_LIVES },
      refillAt: { lte: now }
    }
  })

  for (const lives of needsRefill) {
    const newCount = Math.min(lives.current + 1, MAX_LIVES)
    const refillAt = newCount < MAX_LIVES
      ? new Date(now.getTime() + REFILL_MINUTES * 60 * 1000)
      : null

    await prisma.userLives.update({
      where: { id: lives.id },
      data: { current: newCount, refillAt }
    })
  }
}
```

---

## 🚀 Ishga Tushirish

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/lingvauz"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="..."
CLOUDINARY_URL="cloudinary://..."
PORT=3001
```
