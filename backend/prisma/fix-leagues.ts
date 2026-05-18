// Eski/o'zgartirilgan league nomlarini Bronze, Silver, Gold... ga qaytaradi
// Foydalanish: npx tsx prisma/fix-leagues.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LEAGUES = [
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

async function main() {
  const all = await prisma.league.findMany({ orderBy: { order: 'asc' } })
  console.log(`\n📊 Hozir DB'da ${all.length} ta league bor:`)
  for (const l of all) {
    console.log(`  - order=${l.order}  name="${l.name}"  icon=${l.icon}  id=${l.id}`)
  }

  console.log('\n🔧 Yangilanmoqda...')

  for (const target of LEAGUES) {
    // Order bo'yicha barcha mavjud yozuvlarni yangilash
    const existing = await prisma.league.findMany({ where: { order: target.order } })

    if (existing.length === 0) {
      const created = await prisma.league.create({ data: target })
      console.log(`  ✅ Yaratildi: ${target.name} (id=${created.id})`)
    } else {
      // Birinchi mavjud yozuvni yangilash
      const updated = await prisma.league.update({
        where: { id: existing[0].id },
        data: { name: target.name, color: target.color, icon: target.icon },
      })
      console.log(`  ✅ Yangilandi: ${updated.name} (id=${updated.id})`)

      // Dublikatlar bo'lsa, ularni ham yangilab qo'yish
      for (let i = 1; i < existing.length; i++) {
        await prisma.league.update({
          where: { id: existing[i].id },
          data: { name: target.name, color: target.color, icon: target.icon },
        })
        console.log(`     (dublikat ham yangilandi: id=${existing[i].id})`)
      }
    }
  }

  console.log('\n✨ Tugadi!')
  const after = await prisma.league.findMany({ orderBy: { order: 'asc' } })
  console.log(`\n📊 Endi DB'da:`)
  for (const l of after) {
    console.log(`  - order=${l.order}  name="${l.name}"  icon=${l.icon}`)
  }
}

main()
  .catch((e) => { console.error('❌ Xatolik:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
