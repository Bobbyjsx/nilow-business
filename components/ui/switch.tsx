'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'default' | 'sm' | 'lg' | 'xl' | '2xl';
};

function Switch({ className, size = 'default', ...props }: SwitchProps) {
  const switchSizeClasses = {
    sm: 'h-[0.9rem] w-6',
    default: 'h-[1.15rem] w-8',
    lg: 'h-[1.4rem] w-10',
    xl: 'h-[1.7rem] w-12',
    '2xl': 'h-[2rem] w-14',
  };

  const thumbSizeClasses = {
    sm: 'size-3',
    default: 'size-4',
    lg: 'size-5',
    xl: 'size-6',
    '2xl': 'size-8',
  };

  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        switchSizeClasses[size],
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-custom-black-200  data-[state=checked]:bg-custom-black-100 pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
          thumbSizeClasses[size],
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
