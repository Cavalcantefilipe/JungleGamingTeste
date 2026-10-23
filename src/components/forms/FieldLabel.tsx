import { FormLabel } from '@/components/ui/form';

export function FieldLabel({
  label,
  appearance,
  required = false,
}: {
  label: string;
  appearance: 'default' | 'auth';
  required?: boolean;
}) {
  return (
    <FormLabel className={appearance === 'auth' ? 'sr-only' : undefined}>
      {label}
      {required && (
        <span
          aria-hidden="true"
          className="text-[22px] leading-4 text-text-coral after:content-['*']"
        />
      )}
    </FormLabel>
  );
}
