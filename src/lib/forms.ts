import { errorMessage, toApiError } from './errors';

import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export function applyApiError<TFields extends FieldValues>(
  form: UseFormReturn<TFields>,
  error: unknown,
): void {
  const apiError = toApiError(error);
  const fields = apiError.fields ?? {};
  const known = Object.entries(fields).filter(([name]) => name in form.getValues());
  known.forEach(([name, message]) => {
    form.setError(name as Path<TFields>, { type: 'server', message });
  });
  if (known.length === 0) {
    form.setError('root', { type: 'server', message: errorMessage(apiError) });
  }
}
