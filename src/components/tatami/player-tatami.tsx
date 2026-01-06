import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { PlayMode } from '@/lib/karuta';
import { getKeyForCard } from '@/lib/karuta/keyboard-bindings';
import type { Player } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { User } from 'lucide-react';
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
      icon: 'h-6 w-6',
      title: 'text-base',
      header: {
        padding: 'px-2 pt-2 pb-0',
      },
      content: {
        padding: 'p-2',
      },
      gap: 'gap-2',
      badge: {
        text: 'text-base',
      },
    },
    tablet: {
      icon: 'h-6 w-6',
      title: 'text-xl',
      header: {
        padding: 'px-3 pt-3 pb-0',
      },
      content: {
        padding: 'p-4',
      },
      gap: 'gap-4',
      badge: {
        text: 'text-xl',
      },
    },
    pc: {
      icon: 'h-6 w-6',
      title: 'text-2xl',
      header: {
        padding: 'px-4 pt-4 pb-0',
      },
      content: {
        padding: 'p-6',
      },
      gap: 'gap-6',
      badge: {
        text: 'text-2xl',
      },
    },
    responsive: {
      icon: 'h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6',
      title: 'text-sm md:text-base lg:text-lg',
      header: {
        padding: 'p-2 md:p-3 lg:p-4',
      },
      content: {
        padding: 'p-2 md:p-4 lg:p-6',
      },
      gap: 'gap-2 md:gap-3 lg:gap-4',
      badge: {
        text: 'text-xs md:text-sm lg:text-base',
      },
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
      <CardHeader className={`${styles.header.padding}`}>
        <div className="flex flex-row justify-between gap-2">
          {/* Player's Name */}
          <h3
            className={`text-foreground flex min-w-0 flex-1 items-center gap-2 font-bold ${styles.title}`}
          >
            <User className={`shrink-0 ${styles.icon}`} />
            <span className="min-w-0 truncate">{player.name}</span>
          </h3>

          {/* Score and MochiFuda Count */}
          <div className="flex flex-nowrap gap-2">
            <Badge
              variant="outline"
              className={`shrink-0 bg-yellow-100 text-yellow-700 ${styles.badge.text}`}
            >
              {score.toLocaleString()} pts
            </Badge>
            <Badge
              variant="outline"
              className={`shrink-0 bg-green-100 text-green-700 ${styles.badge.text}`}
            >
              {mochiFudaCount.toLocaleString()} 枚
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className={styles.content.padding}>
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
