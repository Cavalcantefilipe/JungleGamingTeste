import { cn } from '@/lib/cn';

import type { SVGProps } from 'react';

export type FigmaIconName =
  | 'home'
  | 'user-solid'
  | 'cart-solid'
  | 'heart-solid'
  | 'market'
  | 'search'
  | 'cart'
  | 'logout'
  | 'chevron-down'
  | 'chevron-right'
  | 'arrow-right'
  | 'filter'
  | 'search-curved'
  | 'chevron-left'
  | 'heart'
  | 'star'
  | 'star-desktop'
  | 'heart-detail'
  | 'linkedin'
  | 'mail'
  | 'twitter'
  | 'user'
  | 'location'
  | 'activity'
  | 'download'
  | 'warning'
  | 'image'
  | 'hide'
  | 'delete';

const iconSizes = {
  12: 'size-3',
  15: 'size-[15px]',
  14: 'size-3.5',
  16: 'size-4',
  18: 'size-4.5',
  20: 'size-5',
  24: 'size-6',
  28: 'size-7',
} as const;

export function FigmaIcon({
  name,
  size = 16,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { name: FigmaIconName; size?: keyof typeof iconSizes }) {
  return (
    <svg
      width={size}
      height={size}
      className={cn(iconSizes[size], className)}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <use href={`/images/ui/figma-icons.svg#${name}`} width="100%" height="100%" />
    </svg>
  );
}
