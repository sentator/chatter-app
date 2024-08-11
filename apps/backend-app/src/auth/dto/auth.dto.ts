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

export type SignupBodyDto = z.infer<typeof signupBodySchema>;
export type SigninBodyDto = z.infer<typeof signinBodySchema>;
