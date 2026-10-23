import { ApiError, errorMessage } from '@/lib/errors';

import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

export function applyFormError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): void {
  const fields = error instanceof ApiError && error.fields ? Object.entries(error.fields) : [];
  if (fields.length) {
    fields.forEach(([name, message], index) => {
      setError(name as FieldPath<T>, { message }, { shouldFocus: index === 0 });
    });
    return;
  }
  setError('root', { message: errorMessage(error) });
}
