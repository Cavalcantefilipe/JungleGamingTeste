import { z } from 'zod';

import {
  sessionInfoSchema,
  sessionSchema,
  type LoginInput,
  type RegisterInput,
} from '@/contracts/auth';
import { cartSchema } from '@/contracts/cart';
import { apiRequest } from '@/lib/http';

export const login = (data: LoginInput) =>
  apiRequest(sessionSchema, { method: 'POST', url: '/auth/login', data });
export const register = (data: RegisterInput) =>
  apiRequest(sessionSchema, { method: 'POST', url: '/auth/register', data });
export const logout = () => apiRequest(z.undefined(), { method: 'POST', url: '/auth/logout' });
export const fetchSession = () => apiRequest(sessionInfoSchema, { url: '/auth/session' });
export const mergeGuestCart = (guestId: string) =>
  apiRequest(cartSchema, { method: 'POST', url: '/cart/merge', data: { guestId } });
