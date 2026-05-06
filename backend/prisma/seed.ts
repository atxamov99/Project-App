import { PrismaClient } from '@prisma/client'

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

  console.log('✅ Tugadi:', { languages: [uz.code, en.code, ru.code], leagues: leagues.length, achievements: achievements.length })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
