import { z } from 'zod';

export const createUserDtoSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const updateUserDtoSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
});

// equals to prisma schema (User)
export const userEntitySchema = z.object({
  user_id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string(),
  refresh_token: z.string().nullable(),
});

export const userResponseDtoSchema = z.object({
  user_id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export const userListQueryParamsSchema = z.object({
  search: z
    .string()
    .min(3, 'Too short search string. Write 3 characters at least')
    .optional(),
  itemsPerPage: z.preprocess(
    (val?: string) => parseInt(val ?? '', 10),
    z.number().min(1).max(100)
  ),
  page: z.preprocess(
    (val?: string) => parseInt(val ?? '', 10),
    z.number().min(1)
  ),
});

export type CreateUserDto = z.infer<typeof createUserDtoSchema>;
export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;
export type UserEntity = z.infer<typeof userEntitySchema>;
export type UserResponseDto = z.infer<typeof userResponseDtoSchema>;
export type UserListQueryParams = z.infer<typeof userListQueryParamsSchema>;
