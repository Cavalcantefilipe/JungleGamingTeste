import { useId } from 'react';

import { Input } from '@/components/ui/input';

export function ReadonlyField({ label, value }: { label: string; value: string }) {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm">
        {label}
      </label>
      <Input id={id} value={value} readOnly />
    </div>
  );
}
