import { createApp } from './app'
import { env } from './config/env'
import { prisma } from './config/db'

const app = createApp()

const server = app.listen(env.PORT, () => {
  console.log(`🚀 LingvaUZ backend running on http://localhost:${env.PORT}`)
  console.log(`   env: ${env.NODE_ENV}`)
})

async function shutdown(signal: string) {
  console.log(`\n${signal} qabul qilindi, yopilmoqda...`)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
