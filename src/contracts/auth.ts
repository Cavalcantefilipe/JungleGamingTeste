import { z } from 'zod';

import { idSchema, isoDateSchema } from './common';

export const emailSchema = z.email('Informe um e-mail válido').max(254);

export const passwordSchema = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres')
  .regex(/[A-Za-z]/, 'A senha precisa ter pelo menos uma letra')
  .regex(/\d/, 'A senha precisa ter pelo menos um número');

export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Use pelo menos 3 caracteres')
  .max(24, 'Use no máximo 24 caracteres')
  .regex(/^[a-z0-9_]+$/i, 'Use apenas letras, números e _');

export const registerInputSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha'),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const userSchema = z.object({
  id: idSchema,
  username: z.string().min(1),
  email: emailSchema,
  displayName: z.string().min(1),
  avatarUrl: z.string().nullable(),
});
export type User = z.infer<typeof userSchema>;

export const sessionSchema = z.object({
  token: z.string().min(1),
  expiresAt: isoDateSchema,
  user: userSchema,
});
export type Session = z.infer<typeof sessionSchema>;

export const sessionInfoSchema = z.object({ user: userSchema, expiresAt: isoDateSchema });
export type SessionInfo = z.infer<typeof sessionInfoSchema>;
