import { z } from 'zod';

import { registerInputSchema } from '@/contracts/auth';

export const registerFormSchema = registerInputSchema
  .extend({ confirmPassword: z.string().min(1, 'Confirme a senha') })
  .refine((input) => input.password === input.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas precisam ser iguais',
  });

export type RegisterFormInput = z.infer<typeof registerFormSchema>;
