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
      padding: 'p-3',
      edgeBorder: 'h-2',
      sideBorder: 'border-x',
      background: 'tatami-bg-smartphone',
    },
    tablet: {
      title: 'text-lg',
      padding: 'p-4',
      edgeBorder: 'h-[10px]',
      sideBorder: 'border-x',
      background: 'tatami-bg-tablet',
    },
    pc: {
      title: 'text-xl',
      padding: 'p-6',
      edgeBorder: 'h-3',
      sideBorder: 'border-x',
      background: 'tatami-bg-pc',
    },
    responsive: {
      title: 'text-base md:text-lg lg:text-xl',
      padding: 'p-3 md:p-4 lg:p-6',
      edgeBorder: 'h-2 md:h-[10px] lg:h-3',
      sideBorder: 'border-x',
      background: 'tatami-bg-smartphone md:tatami-bg-tablet lg:tatami-bg-pc',
    },
  });

  // Always use 4 columns for shared tatami
  const gridColsClass = 'grid-cols-4';

  // Common edge border styling
  const edgeBorderClass = `${styles.edgeBorder} bg-indigo-950 dark:bg-indigo-900`;

  return (
    <div className="flex flex-col">
      {/* Top edge (border) */}
      <div className={edgeBorderClass} />

      {/* Main tatami body */}
      <div
        className={`${styles.sideBorder} ${styles.background} border-gray-300 dark:border-gray-600 ${styles.padding}`}
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

      {/* Bottom edge (border) */}
      <div className={edgeBorderClass} />
    </div>
  );
}
