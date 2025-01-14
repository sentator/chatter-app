import { z } from 'zod';

export const signupBodySchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signinBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signoutPayloadSchema = z.object({
  userId: z.number(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

export const refreshPayloadSchema = z.object({
  userId: z.number(),
  refreshToken: z.string(),
});

export type SignupBodyDto = z.infer<typeof signupBodySchema>;
export type SigninBodyDto = z.infer<typeof signinBodySchema>;
export type SignoutPayload = z.infer<typeof signoutPayloadSchema>;
export type RefreshPayload = z.infer<typeof refreshPayloadSchema>;
