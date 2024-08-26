import { PrismaClient } from '@prisma/client';
import { UserEntity, UserResponseDto } from '../dto/user.dto';
import { getHashedValue } from '../../utils';

export const createResponseDtoFromUserEntity = (
  user: UserEntity
): UserResponseDto => {
  const { user_id, email, first_name, last_name } = user;
  return { user_id, email, first_name, last_name };
};

export const isEqualUserIds = (id1: number, id2: number) => {
  return id1 === id2;
};

export const createPairOfUsers = async (prisma: PrismaClient) => {
  const password1 = await getHashedValue('12345678');
  const user1 = await prisma.user.upsert({
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
  const user2 = await prisma.user.upsert({
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

  return [user1.user_id, user2.user_id];
};
