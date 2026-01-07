import type { PlayMode } from '@/lib/karuta';
import { getKeyForCard } from '@/lib/karuta/keyboard-bindings';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { ToriFudaCard } from './tori-fuda-card';

export type PlayerTatamiProps = {
  tatamiCards: NormalizedPrototype[];
  onCardClick: (card: NormalizedPrototype) => void;
  playMode: PlayMode;
  playerIndex: number;
  playerCount: number;
  screenSize?: ScreenSize;
};

export function PlayerTatami({
  tatamiCards,
  onCardClick,
  playMode,
  playerIndex,
  playerCount,
  screenSize = 'pc',
}: PlayerTatamiProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      gap: 'gap-2',
      padding: 'p-2',
      edgeBorder: 'h-2',
      sideBorder: 'border-x',
      background: 'tatami-bg-smartphone',
    },
    tablet: {
      gap: 'gap-4',
      padding: 'p-4',
      edgeBorder: 'h-3',
      sideBorder: 'border-x',
      background: 'tatami-bg-tablet',
    },
    pc: {
      gap: 'gap-6',
      padding: 'p-6',
      edgeBorder: 'h-4',
      sideBorder: 'border-x',
      background: 'tatami-bg-pc',
    },
    responsive: {
      gap: 'gap-2 md:gap-3 lg:gap-4',
      padding: 'p-2 md:p-4 lg:p-6',
      edgeBorder: 'h-2 md:h-[10px] lg:h-3',
      sideBorder: 'border-x',
      background: 'tatami-bg-smartphone md:tatami-bg-tablet lg:tatami-bg-pc',
    },
  });

  // Common edge border styling
  const edgeBorderClass = `${styles.edgeBorder} bg-indigo-950 dark:bg-indigo-900`;

  const gridColsClass =
    playMode === 'keyboard'
      ? 'grid-cols-4'
      : getResponsiveStyles(screenSize, {
          smartphone: 'grid-cols-2',
          tablet: 'grid-cols-2',
          pc: 'grid-cols-2',
          responsive: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        });

  const showImage = playMode === 'touch';

  return (
    <div className="flex flex-col">
      {/* Top edge (border) */}
      <div className={edgeBorderClass} />

      {/* Main tatami body */}
      <div
        className={`${styles.padding} ${styles.sideBorder} ${styles.background} border-gray-300 dark:border-gray-600`}
      >
        <div className={`grid ${styles.gap} ${gridColsClass}`}>
          {tatamiCards.map((card, index) => (
            <ToriFudaCard
              key={card.id}
              normalizedPrototype={card}
              index={index}
              isClickable={true}
              playMode={playMode}
              showImage={showImage}
              onClick={onCardClick}
              keyboardKey={getKeyForCard(playerIndex, index, playerCount)}
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
