import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Migratsiya uchun DIRECT_URL afzal (pooler ba'zi operatsiyalarni qo'llab-quvvatlamaydi)
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgresql://localhost:5432/lingvauz',
  },
})
