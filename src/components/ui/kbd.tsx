import * as React from 'react';

import { cn } from '@/lib/utils';

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <kbd
        className={cn(
          'bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Kbd.displayName = 'Kbd';

export { Kbd };
