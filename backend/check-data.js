const { PrismaClient } = require('./node_modules/.prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
require('dotenv').config();

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL }),
});

async function check() {
  await prisma.$connect();
  const langCount = await prisma.language.count();
  const lessonCount = await prisma.lesson.count();
  const courseCount = await prisma.course.count();
  console.log(`Languages: ${langCount}, Lessons: ${lessonCount}, Courses: ${courseCount}`);

  const userCount = await prisma.user.count();
  console.log(`Total users: ${userCount}`);

  await prisma.$disconnect();
}

check();