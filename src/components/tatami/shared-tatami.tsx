import type { NormalizedPrototype } from '@f88/promidas/types';
import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { ToriFudaCardTouch } from './tori-fuda-card-touch';

export type SharedTatamiProps = {
  tatamiCards: NormalizedPrototype[];
  playMode?: PlayMode;
  screenSize?: ScreenSize;
};

export function SharedTatami({
  tatamiCards,
  screenSize = 'pc',
}: SharedTatamiProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      title: 'text-base',
      padding: 'p-2',
      border: 'border-x-0 border-y-6',
    },
    tablet: {
      title: 'text-lg',
      padding: 'p-3',
      border: 'border-x-0 border-y-10',
    },
    pc: {
      title: 'text-xl',
      padding: 'p-4',
      border: 'border-x-0 border-y-14',
    },
    responsive: {
      title: 'text-base md:text-lg lg:text-xl',
      padding: 'p-2 md:p-3 lg:p-4',
      border: 'border-x-0 border-y-12 md:border-y-4',
    },
  });

  // Always use 4 columns for shared tatami
  const gridColsClass = 'grid-cols-4';

  return (
    <div
      className={`${styles.border} border-green-500 shadow-lg ${styles.padding}`}
    >
      {/* <h2
        className={`text-foreground mb-4 text-center font-bold ${styles.title}`}
      >
        🎴 Shared Tatami (Reference Only)
      </h2> */}
      <div className={`grid gap-4 ${gridColsClass}`}>
        {tatamiCards.map((card, index) => (
          <ToriFudaCardTouch
            key={card.id}
            normalizedPrototype={card}
            index={index}
            isClickable={false}
            showImage={true}
            screenSize={screenSize}
          />
        ))}
      </div>
    </div>
  );
}
