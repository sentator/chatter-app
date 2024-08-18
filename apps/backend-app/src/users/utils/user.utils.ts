import { UserEntity, UserResponseDto } from '../dto/user.dto';

export const createResponseDtoFromUserEntity = (
  user: UserEntity
): UserResponseDto => {
  const { user_id, email, first_name, last_name } = user;
  return { user_id, email, first_name, last_name };
};

export const isEqualUserIds = (id1: number, id2: number) => {
  return id1 === id2;
};
