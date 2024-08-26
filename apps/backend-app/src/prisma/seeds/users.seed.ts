import { PrismaClient } from '@prisma/client';
import { getHashedValue } from '../../utils';
import { Logger } from '@nestjs/common';

export async function seedUsers(prisma: PrismaClient) {
  const logger = new Logger();
  logger.log('Started seeding users...');

  const password1 = await getHashedValue('12345678');
  await prisma.user.upsert({
    where: { email: 'test.user.1@chatter.app' },
    create: {
      email: 'test.user.1@chatter.app',
      first_name: 'Alex',
      last_name: 'Smith',
      password: password1,
    },
    update: {
      first_name: 'Alex',
      last_name: 'Smith',
      password: password1,
    },
  });

  const password2 = await getHashedValue('23456789');
  await prisma.user.upsert({
    where: { email: 'test.user.2@chatter.app' },
    create: {
      email: 'test.user.2@chatter.app',
      first_name: 'Olena',
      last_name: 'Marchenko',
      password: password2,
    },
    update: {
      first_name: 'Olena',
      last_name: 'Marchenko',
      password: password2,
    },
  });

  const password3 = await getHashedValue('qwerty123');
  await prisma.user.upsert({
    where: { email: 'test.user.3@chatter.app' },
    create: {
      email: 'test.user.3@chatter.app',
      first_name: 'Dan',
      last_name: 'Volia',
      password: password3,
    },
    update: {
      first_name: 'Dan',
      last_name: 'Volia',
      password: password3,
    },
  });

  logger.log('Seeding of users successfully completed!');
}
