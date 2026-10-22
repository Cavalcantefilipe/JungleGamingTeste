import { ApiError, errorMessage } from '@/lib/errors';

export function cartErrorMessage(error: unknown): string {
  return error instanceof ApiError && error.fields?.quantity
    ? `${errorMessage(error)} ${error.fields.quantity}`
    : errorMessage(error);
}
