import type { NormalizedPrototype } from '@f88/promidas/types';
import { MarqueeComponent } from '@/components/ui/marquee';

export type YomiFudaMarqueeProps = {
  normalizedPrototype: NormalizedPrototype;
};

export function YomiFudaMarquee({ normalizedPrototype }: YomiFudaMarqueeProps) {
  const displayText = `${normalizedPrototype.prototypeNm ?? 'NO NAME'} - ${normalizedPrototype.summary || 'No description'}`;

  return (
    <div className="overflow-hidden rounded-lg bg-indigo-600 py-3 shadow-lg">
      <MarqueeComponent speed={40} pauseOnHover>
        <span className="text-2xl font-semibold text-white">{displayText}</span>
      </MarqueeComponent>
    </div>
  );
}
