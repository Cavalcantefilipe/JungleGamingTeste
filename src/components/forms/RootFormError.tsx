import { useFormContext } from 'react-hook-form';

export function RootFormError() {
  const { formState } = useFormContext();
  const message = formState.errors.root?.message;
  return typeof message === 'string' ? (
    <p role="alert" className="text-sm text-text-coral">
      {message}
    </p>
  ) : null;
}
