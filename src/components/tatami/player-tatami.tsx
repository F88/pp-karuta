import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { PlayMode } from '@/lib/karuta';
import { getKeyForCard } from '@/lib/karuta/keyboard-bindings';
import type { Player } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { ToriFudaCard } from './tori-fuda-card';

export type PlayerTatamiProps = {
  player: Player;
  playerIndex: number;
  playerCount: number;
  tatamiCards: NormalizedPrototype[];
  onCardClick: (card: NormalizedPrototype) => void;
  mochiFudaCount: number;
  score: number;
  playMode: PlayMode;
  feedbackState?: 'correct' | 'incorrect' | null;
  screenSize?: ScreenSize;
};

export function PlayerTatami({
  player,
  playerIndex,
  playerCount,
  tatamiCards,
  onCardClick,
  mochiFudaCount,
  score,
  playMode,
  feedbackState = null,
  screenSize = 'pc',
}: PlayerTatamiProps) {
  const showImage = playMode === 'touch';

  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      title: 'text-sm',
      padding: 'p-3',
      gap: 'gap-2',
    },
    tablet: {
      title: 'text-base',
      padding: 'p-4',
      gap: 'gap-3',
    },
    pc: {
      title: 'text-lg',
      padding: 'p-6',
      gap: 'gap-4',
    },
    responsive: {
      title: 'text-sm md:text-base lg:text-lg',
      padding: 'p-3 md:p-4 lg:p-6',
      gap: 'gap-2 md:gap-3 lg:gap-4',
    },
  });

  const gridColsClass =
    playMode === 'keyboard'
      ? 'grid-cols-4'
      : getResponsiveStyles(screenSize, {
          smartphone: 'grid-cols-2',
          tablet: 'grid-cols-2',
          pc: 'grid-cols-2',
          responsive: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        });

  // Border style based on feedback state
  const borderClass = feedbackState
    ? feedbackState === 'correct'
      ? 'border-green-500'
      : 'border-red-500'
    : 'border-indigo-300';

  const shadowClass = feedbackState
    ? feedbackState === 'correct'
      ? 'shadow-2xl shadow-green-500/70'
      : 'shadow-2xl shadow-red-500/70'
    : 'shadow-lg';

  const animationClass = feedbackState
    ? feedbackState === 'correct'
      ? 'animate-[flash_0.6s_ease-in-out]'
      : 'animate-[shake_0.5s_ease-in-out]'
    : '';

  return (
    <Card
      className={`border-2 ${borderClass} ${shadowClass} ${animationClass} transition-all duration-300`}
    >
      <CardHeader className={styles.padding}>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3
            className={`flex items-center gap-2 font-bold text-indigo-700 ${styles.title}`}
          >
            <span>👤</span>
            {player.name}
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
              {score.toLocaleString()} pts
            </Badge>
            <Badge variant="outline" className="bg-pink-100 text-pink-700">
              {mochiFudaCount.toLocaleString()} 枚
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className={styles.padding}>
        {/* <ScrollArea className="h-[60vh]"> */}
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
        {/* </ScrollArea> */}
      </CardContent>
    </Card>
  );
}
