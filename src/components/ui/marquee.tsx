import { cn } from '@/lib/utils';
import Marquee from 'react-fast-marquee';

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  speed?: number;
}

export function MarqueeComponent({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  repeat = 4,
  speed = 50,
  ...props
}: MarqueeProps) {
  return (
    <Marquee
      className={cn('overflow-hidden', className)}
      pauseOnHover={pauseOnHover}
      direction={reverse ? 'right' : 'left'}
      speed={speed}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div key={i} className="mx-4">
          {children}
        </div>
      ))}
    </Marquee>
  );
}
