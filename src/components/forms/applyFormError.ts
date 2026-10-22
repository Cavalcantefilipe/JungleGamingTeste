import { ApiError, errorMessage } from '@/lib/errors';

import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

export function applyFormError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): void {
  if (error instanceof ApiError && error.fields) {
    for (const [name, message] of Object.entries(error.fields))
      setError(name as FieldPath<T>, { message });
  }
  setError('root', { message: errorMessage(error) });
}
