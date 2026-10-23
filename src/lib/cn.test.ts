import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('classes dos tokens do design', () => {
  it('substitui tamanhos e raios sem remover a cor', () => {
    expect(cn('rounded-field text-sm text-primary', 'rounded-auth text-caption')).toBe(
      'text-primary rounded-auth text-caption',
    );
  });

  it('preserva overrides independentes em cada breakpoint', () => {
    expect(cn('rounded-md md:rounded-control', 'rounded-auth md:rounded-social')).toBe(
      'rounded-auth md:rounded-social',
    );
    expect(cn('text-body-sm text-text-secondary', 'md:text-section')).toBe(
      'text-body-sm text-text-secondary md:text-section',
    );
  });
});
