const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // Try to connect and query
    await prisma.$connect();
    console.log('Connected to database');

    // Try to count users
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);

    // List tables
    const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
    console.log('Tables:', tables);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Database error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

test();