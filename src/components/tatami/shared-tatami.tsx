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
    },
    tablet: {
      title: 'text-lg',
    },
    pc: {
      title: 'text-xl',
    },
    responsive: {
      title: 'text-base md:text-lg lg:text-xl',
    },
  });

  // Always use 4 columns for shared tatami
  const gridColsClass = 'grid-cols-4';

  return (
    <div className="mb-6">
      <h2
        className={`mb-4 text-center font-bold text-gray-700 dark:text-gray-300 ${styles.title}`}
      >
        🎴 Shared Tatami (Reference Only)
      </h2>
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
