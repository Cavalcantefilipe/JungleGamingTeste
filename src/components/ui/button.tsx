import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-ink hover:bg-primary-light active:bg-primary-dark',
        primary: 'bg-primary text-ink hover:bg-primary-light active:bg-primary-dark',
        favorite:
          'relative rounded-full bg-transparent text-primary before:pointer-events-none before:absolute before:size-7 before:rounded-full before:bg-surface-dark hover:before:bg-surface-raised active:before:bg-border [&_svg]:relative [&_svg]:size-3.5',
        quantity:
          'relative rounded-full text-ink before:pointer-events-none before:absolute before:size-6 before:rounded-full before:bg-primary hover:before:bg-primary-light active:before:bg-primary-dark',
        'quantity-cart':
          'relative rounded-full text-foreground before:pointer-events-none before:absolute before:size-6 before:rounded-full before:border before:border-border before:bg-surface-raised hover:before:bg-border-soft active:before:bg-border',
        remove:
          'rounded-full text-primary hover:bg-surface-raised hover:text-primary-light active:bg-border active:text-primary-dark',
        edition:
          'rounded-full border border-border bg-transparent text-text-secondary hover:border-primary-light active:bg-surface-raised aria-pressed:border-primary aria-pressed:text-text-accent',
        basket:
          'rounded-full border border-border bg-surface-raised text-text-secondary hover:bg-border-soft active:bg-border',
        danger: 'bg-error text-white hover:bg-error/80 active:bg-error/70',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'border border-border-soft bg-transparent text-foreground hover:bg-surface-raised active:bg-surface-card',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        quantity: 'size-11 p-0',
        form: 'min-h-11 px-6 text-xs font-bold md:min-h-10',
        'footer-social': 'size-11 rounded-control p-0 text-primary md:size-8',
        edition: 'min-h-11 rounded-full px-3 text-xs md:min-h-7 md:px-2',
        auth: 'h-[60px] rounded-xl px-6 text-base font-bold md:h-[45px] md:rounded-control',
        social: 'h-11 rounded-control px-4 text-xs text-text-secondary md:h-10',
        checkout: 'h-[60px] rounded-[40px] px-6 font-bold md:h-10 md:rounded-control',
        coupon: 'h-12 rounded-full px-5 font-bold md:h-10 md:rounded-control',
        purchase: 'h-[60px] rounded-full px-6 text-base font-bold lg:h-10 lg:rounded-md lg:text-sm',
        'purchase-icon': 'size-[60px] rounded-full lg:size-10 lg:rounded-md',
        default: 'min-h-11 px-6 py-2 text-base font-bold sm:min-h-10 has-[>svg]:px-4',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-11 sm:size-10',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    compoundVariants: [
      {
        variant: ['default', 'primary'],
        size: ['purchase', 'purchase-icon', 'coupon', 'checkout'],
        className:
          'bg-transparent [background-image:var(--background-image-primary-gradient)] bg-[length:100%_100%] hover:bg-transparent hover:brightness-105 active:bg-transparent active:brightness-95',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
