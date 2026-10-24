import { useId } from 'react';

import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';

import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string | undefined;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  multiline?: boolean;
}

export function InputField({
  label,
  registration,
  error,
  type = 'text',
  autoComplete,
  multiline,
}: InputFieldProps) {
  const id = useId();
  const common = {
    ...registration,
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  };
  return (
    <div className="grid gap-2 text-body">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          {...common}
          className="min-h-24 w-full rounded-control border border-border bg-surface-card p-3"
        />
      ) : type === 'password' ? (
        <PasswordInput {...common} autoComplete={autoComplete} className="h-11" />
      ) : (
        <Input {...common} type={type} autoComplete={autoComplete} className="h-11" />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-caption text-error">
          {error}
        </p>
      )}
    </div>
  );
}
