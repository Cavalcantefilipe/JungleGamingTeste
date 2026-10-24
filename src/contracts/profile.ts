import { z } from 'zod';

import { emailSchema, passwordSchema, usernameSchema } from '@/contracts/auth';
import { idSchema } from '@/contracts/common';

export const ensLabelSchema = z
  .string()
  .trim()
  .max(63, 'Nome ENS muito longo')
  .regex(/^([a-z0-9-]{3,63})?$/, 'Use letras minúsculas, números e hífen');

export const profileSchema = z.object({
  id: idSchema,
  displayName: z.string().min(1),
  username: z.string().min(1),
  email: emailSchema,
  ensName: z.string(),
  walletNickname: z.string(),
  avatarUrl: z.string().nullable(),
});
export type Profile = z.infer<typeof profileSchema>;

export const updateProfileInputSchema = z.object({
  displayName: z.string().trim().min(2, 'Use pelo menos 2 caracteres').max(60, 'Máximo de 60'),
  username: usernameSchema,
  email: emailSchema,
  ensName: ensLabelSchema,
  walletNickname: z.string().trim().max(40, 'Máximo de 40 caracteres'),
});
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

export const avatarInputSchema = z.object({
  dataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, 'Imagem inválida')
    .max(Math.ceil(AVATAR_MAX_BYTES * 1.37) + 64, 'A imagem deve ter no máximo 2 MB'),
});
export type AvatarInput = z.infer<typeof avatarInputSchema>;

export const changePasswordInputSchema = z.object({
  currentPassword: z.string().min(1, 'Informe a senha atual'),
  newPassword: passwordSchema,
});
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;
