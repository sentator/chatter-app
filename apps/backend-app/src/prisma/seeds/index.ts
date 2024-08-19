import { PrismaClient } from '@prisma/client';
import { seedUsers } from './users.seed';

const runSeeds = async () => {
  const prisma = new PrismaClient();

  try {
    await seedUsers(prisma);
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

runSeeds();
