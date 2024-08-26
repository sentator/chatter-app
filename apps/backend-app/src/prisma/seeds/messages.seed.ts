import { PrismaClient } from '@prisma/client';
import { createPairOfUsers } from '../../users/utils/user.utils';
import { Logger } from '@nestjs/common';

export async function seedMessages(prisma: PrismaClient) {
  const logger = new Logger();
  logger.log('Started seeding messages...');

  const [userId1, userId2] = await createPairOfUsers(prisma);

  await prisma.message.create({
    data: { sender_id: userId1, recipient_id: userId2, value: 'hello!' },
  });
  await prisma.message.create({
    data: { sender_id: userId1, recipient_id: userId2, value: 'how are you?' },
  });
  await prisma.message.create({
    data: {
      sender_id: userId2,
      recipient_id: userId1,
      value: 'nothing special. And u?',
    },
  });
  await prisma.message.create({
    data: { sender_id: userId1, recipient_id: userId2, value: 'likewise =)' },
  });
  await prisma.message.create({
    data: {
      sender_id: userId1,
      recipient_id: userId2,
      value: 'are we still on for today?',
    },
  });
  await prisma.message.create({
    data: { sender_id: userId2, recipient_id: userId1, value: 'sure' },
  });
  await prisma.message.create({
    data: { sender_id: userId1, recipient_id: userId2, value: 'ok, see ya' },
  });

  logger.log('Seeding of messages successfully completed!');
}
