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
        social:
          'relative border-0 border-border text-text-secondary before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:h-10 before:-translate-y-1/2 before:rounded-social before:border before:border-border hover:bg-surface-raised active:bg-border',
        pagination:
          'border border-border bg-transparent text-foreground hover:bg-surface-raised active:bg-border aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:font-bold aria-[current=page]:text-ink',
        filter: 'bg-filter-gradient text-ink hover:brightness-110 active:brightness-95',
        favorite:
          'relative rounded-full bg-transparent text-primary before:pointer-events-none before:absolute before:size-7 before:rounded-full before:border before:border-border before:bg-surface-raised hover:before:bg-border-soft active:before:bg-border [&_svg]:relative [&_svg]:size-3.5',
        'detail-round':
          'relative rounded-full bg-transparent text-text-accent before:pointer-events-none before:absolute before:size-[35px] before:rounded-full before:border before:border-border before:bg-surface-raised hover:before:bg-border-soft active:before:bg-border [&_svg]:relative',
        'favorite-label':
          'rounded-control border border-primary bg-transparent text-text-accent hover:bg-surface-raised active:bg-border aria-pressed:bg-surface-raised',
        zoom: 'relative rounded-full text-foreground before:pointer-events-none before:absolute before:size-[30px] before:rounded-full before:border before:border-border before:bg-surface-raised hover:before:bg-border-soft active:before:bg-border [&_svg]:relative',
        quantity:
          'relative rounded-full text-ink before:pointer-events-none before:absolute before:h-[30px] before:w-5 before:rounded-full before:border before:border-ink before:bg-primary lg:before:h-[50px] lg:before:w-[33px] hover:before:bg-primary-light active:before:bg-primary-dark',
        'quantity-cart':
          'relative rounded-full text-foreground before:pointer-events-none before:absolute before:size-6 before:rounded-full before:border before:border-border before:bg-surface-raised hover:before:bg-border-soft active:before:bg-border md:text-ink md:before:h-[30px] md:before:w-5 md:before:border-ink md:before:bg-primary md:hover:before:bg-primary-light md:active:before:bg-primary-dark',
        remove:
          'rounded-full text-primary md:text-secondary hover:bg-surface-raised hover:text-primary-light active:bg-border active:text-primary-dark',
        edition:
          'relative rounded-full bg-transparent font-normal text-text-secondary before:pointer-events-none before:absolute before:inset-x-1 before:h-7 before:rounded-[50%] before:border before:border-border hover:before:border-primary-light active:before:bg-surface-raised aria-pressed:font-medium aria-pressed:text-text-accent aria-pressed:before:border-primary md:before:inset-x-0',
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
        pagination: 'size-11 rounded-[4px] p-0 text-lg font-normal md:size-[35px]',
        filter: 'h-11 rounded-control px-3 text-base font-bold md:h-9',
        promotion: 'h-11 w-[140px] rounded-control text-sm font-medium md:h-10',
        quantity: 'size-11 p-0',
        'quantity-purchase': 'size-11 p-0 lg:h-[50px]',
        'favorite-label': 'h-10 w-[130px] gap-2 px-3 text-sm font-medium',
        header: 'h-11 gap-1 rounded-control px-2 text-base font-medium md:h-[35px] md:w-[100px]',
        form: 'min-h-11 rounded-field px-6 text-sm font-bold md:min-h-10',
        'footer-social': 'size-11 rounded-control p-0 text-primary md:size-8',
        edition: 'min-h-11 min-w-11 rounded-full px-2 text-sm md:min-h-7 md:min-w-0 md:px-1',
        auth: 'h-[60px] rounded-auth px-6 text-base font-bold md:h-[45px] md:rounded-social',
        social:
          'relative -my-0.5 h-11 rounded-social px-4 text-caption text-text-secondary md:my-0 md:h-10',
        checkout: 'h-[60px] rounded-[40px] px-6 font-bold md:h-10 md:rounded-control',
        coupon: 'h-12 rounded-full px-5 font-bold md:h-10 md:rounded-none',
        purchase: 'h-[60px] rounded-full px-6 text-base font-bold lg:h-10 lg:rounded-md lg:text-sm',
        'purchase-icon': 'size-[60px] rounded-full lg:size-10 lg:rounded-md',
        default: 'min-h-11 px-6 py-2 text-base font-bold sm:min-h-10 has-[>svg]:px-4',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        'header-icon': 'size-11 md:h-[35px] md:w-10',
        confirmation:
          'h-[60px] rounded-[40px] px-6 text-body-sm font-bold lg:h-[45px] lg:rounded-lg',
        receipt: 'min-h-12 rounded-social px-4 text-base font-bold',
        icon: 'size-11 sm:size-10',
        'detail-icon': 'size-11',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    compoundVariants: [
      {
        variant: ['default', 'primary'],
        size: ['coupon', 'checkout'],
        className: 'md:bg-primary md:bg-none md:hover:bg-primary-light md:active:bg-primary-dark',
      },
      {
        variant: ['default', 'primary'],
        size: ['purchase', 'purchase-icon', 'confirmation'],
        className: 'lg:bg-primary lg:bg-none lg:hover:bg-primary-light lg:active:bg-primary-dark',
      },
      {
        variant: ['default', 'primary'],
        size: ['purchase', 'purchase-icon', 'coupon', 'checkout', 'confirmation'],
        className:
          'bg-transparent bg-primary-gradient hover:bg-transparent hover:brightness-105 active:bg-transparent active:brightness-95',
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
