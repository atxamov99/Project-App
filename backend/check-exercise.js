const { PrismaClient } = require('./node_modules/.prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
require('dotenv').config();

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL }),
});

async function check() {
  await prisma.$connect();

  // Get first exercise
  const exercise = await prisma.exercise.findFirst({
    select: {
      id: true,
      type: true,
      question: true,
      correctAnswer: true,
      wrongAnswers: true,
      explanation: true,
    }
  });

  console.log('First exercise:', exercise);

  // Check if wrongAnswers is an array
  if (exercise && exercise.wrongAnswers !== null) {
    console.log('Wrong answers type:', typeof exercise.wrongAnswers);
    console.log('Is array:', Array.isArray(exercise.wrongAnswers));
    if (Array.isArray(exercise.wrongAnswers)) {
      console.log('Wrong answers:', exercise.wrongAnswers);
    }
  }

  await prisma.$disconnect();
}

check();