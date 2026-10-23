import type { RefObject } from 'react';

interface AvatarFileInputProps {
  input: RefObject<HTMLInputElement | null>;
  invalid: boolean;
  disabled: boolean;
  select: (file: File) => void;
}
export function AvatarFileInput({ input, invalid, disabled, select }: AvatarFileInputProps) {
  return (
    <input
      ref={input}
      type="file"
      tabIndex={-1}
      aria-invalid={invalid}
      accept="image/png,image/jpeg,image/webp"
      aria-label="Alterar avatar"
      aria-describedby="avatar-help avatar-error"
      className="sr-only"
      disabled={disabled}
      onChange={(event) => {
        const file = event.currentTarget.files?.[0];
        event.currentTarget.value = '';
        if (file) select(file);
      }}
    />
  );
}
