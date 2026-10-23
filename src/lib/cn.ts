import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const mergeClasses = extendTailwindMerge({
  extend: {
    theme: {
      radius: ['control', 'field', 'auth', 'social', 'card', 'media'],
      text: [
        'display',
        'display-sm',
        'heading',
        'heading-sm',
        'title',
        'body-lg',
        'body',
        'body-sm',
        'section',
        'caption',
        'caption-sm',
        'tiny',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return mergeClasses(clsx(inputs));
}
