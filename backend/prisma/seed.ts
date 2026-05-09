import { PrismaClient } from '@prisma/client'
import { UZ_EN_BASICS } from './content/uz-en-basics'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed boshlandi...')

  // Tillar
  const [uz, en, ru] = await Promise.all([
    prisma.language.upsert({
      where: { code: 'uz' },
      update: {},
      create: { code: 'uz', name: 'O\'zbek tili', nativeName: 'O\'zbek', flag: '🇺🇿' },
    }),
    prisma.language.upsert({
      where: { code: 'en' },
      update: {},
      create: { code: 'en', name: 'Ingliz tili', nativeName: 'English', flag: '🇬🇧' },
    }),
    prisma.language.upsert({
      where: { code: 'ru' },
      update: {},
      create: { code: 'ru', name: 'Rus tili', nativeName: 'Русский', flag: '🇷🇺' },
    }),
  ])

  // Liga'lar
  const leagues = [
    { name: 'Bronze',   order: 1,  color: '#CD7F32', icon: '🥉' },
    { name: 'Silver',   order: 2,  color: '#C0C0C0', icon: '🥈' },
    { name: 'Gold',     order: 3,  color: '#FFD700', icon: '🥇' },
    { name: 'Sapphire', order: 4,  color: '#0F52BA', icon: '💙' },
    { name: 'Ruby',     order: 5,  color: '#E0115F', icon: '❤️' },
    { name: 'Emerald',  order: 6,  color: '#50C878', icon: '💚' },
    { name: 'Amethyst', order: 7,  color: '#9966CC', icon: '💜' },
    { name: 'Pearl',    order: 8,  color: '#EAE0C8', icon: '🤍' },
    { name: 'Obsidian', order: 9,  color: '#3D3635', icon: '🖤' },
    { name: 'Diamond',  order: 10, color: '#B9F2FF', icon: '💎' },
  ]
  for (const l of leagues) {
    await prisma.league.upsert({
      where: { id: `league-${l.order}` },
      update: {},
      create: { id: `league-${l.order}`, ...l },
    })
  }

  // Achievementlar
  const achievements = [
    { key: 'STREAK_7',   title: '7 kun ketma-ket', description: 'Bir hafta o\'qidingiz!', icon: '🔥', gemReward: 50,  xpReward: 100 },
    { key: 'STREAK_30',  title: '30 kun ketma-ket', description: 'Bir oy uzluksiz!',     icon: '🔥', gemReward: 200, xpReward: 500 },
    { key: 'STREAK_100', title: '100 kun ketma-ket', description: 'Aql bovar qilmas!',    icon: '🌟', gemReward: 500, xpReward: 2000 },
    { key: 'WORDS_100',  title: '100 ta so\'z',     description: '100 ta so\'z bilib oldingiz', icon: '📖', gemReward: 50, xpReward: 100 },
  ]
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {},
      create: a,
    })
  }

  // ─── Kurs: O'zbek → Ingliz ─────────────────────
  const uzEn = await prisma.course.upsert({
    where: { fromLanguageId_toLanguageId: { fromLanguageId: uz.id, toLanguageId: en.id } },
    update: {},
    create: { fromLanguageId: uz.id, toLanguageId: en.id },
  })

  // Unit 1: The Basics
  const existingUnit = await prisma.unit.findFirst({
    where: { courseId: uzEn.id, order: 1 },
  })
  const unit = existingUnit ?? await prisma.unit.create({
    data: {
      courseId: uzEn.id,
      order: 1,
      title: UZ_EN_BASICS.unitTitle,
      description: 'Common greetings and introductions',
      color: UZ_EN_BASICS.unitColor,
      icon: UZ_EN_BASICS.unitIcon,
    },
  })

  let lessonsCreated = 0
  let exercisesCreated = 0
  let wordsCreated = 0

  for (const lessonSeed of UZ_EN_BASICS.lessons) {
    const existingLesson = await prisma.lesson.findFirst({
      where: { unitId: unit.id, order: lessonSeed.order },
    })

    const lesson = existingLesson ?? await prisma.lesson.create({
      data: {
        unitId: unit.id,
        order: lessonSeed.order,
        type: 'REGULAR',
        xpReward: 10,
      },
    })
    if (!existingLesson) lessonsCreated++

    // Mavjud lesson'da mashqlar borligini tekshiramiz
    const linkedExisting = await prisma.lessonExercise.count({ where: { lessonId: lesson.id } })
    if (linkedExisting > 0) continue // bu darsda mashqlar bor — qayta qo'ymaymiz

    for (let idx = 0; idx < lessonSeed.exercises.length; idx++) {
      const ex = lessonSeed.exercises[idx]

      const exercise = await prisma.exercise.create({
        data: {
          type: ex.type,
          question: ex.question,
          correctAnswer: ex.correctAnswer,
          wrongAnswers: ex.wrongAnswers,
          explanation: ex.explanation,
          difficulty: ex.difficulty ?? 1,
          targetLangCode: en.code,
        },
      })
      exercisesCreated++

      await prisma.lessonExercise.create({
        data: { lessonId: lesson.id, exerciseId: exercise.id, order: idx + 1 },
      })

      // So'zlar (vocabulary)
      for (const w of ex.words ?? []) {
        const word = await prisma.word.upsert({
          where: { id: `${en.code}-${w.text.toLowerCase()}` },
          update: {},
          create: {
            id: `${en.code}-${w.text.toLowerCase()}`,
            languageId: en.id,
            text: w.text,
            translation: w.translation,
            category: w.category ?? 'General',
            level: w.level ?? 'A1',
          },
        })
        wordsCreated++

        await prisma.exerciseWord.upsert({
          where: { exerciseId_wordId: { exerciseId: exercise.id, wordId: word.id } },
          update: {},
          create: { exerciseId: exercise.id, wordId: word.id },
        })
      }
    }
  }

  console.log('✅ Tugadi:', {
    languages: [uz.code, en.code, ru.code],
    leagues: leagues.length,
    achievements: achievements.length,
    courses: 1,
    lessons: lessonsCreated,
    exercises: exercisesCreated,
    words: wordsCreated,
  })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
