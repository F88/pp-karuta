import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { PlayMode } from '@/lib/karuta';
import type { Player } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { User } from 'lucide-react';
import { PlayerTatami } from './player-tatami';

type PlayerInfoProps = {
  player: Player;
  mochiFudaCount: number;
  score: number;
  playMode: PlayMode;
  screenSize?: ScreenSize;
};

function PlayerInfo({
  player,
  mochiFudaCount,
  score,
  playMode,
  screenSize = 'pc',
}: PlayerInfoProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      icon: 'h-6 w-6',
      title: 'text-base',
      badgeText: 'text-base',
    },
    tablet: {
      icon: 'h-6 w-6',
      title: 'text-xl',
      badgeText: 'text-xl',
    },
    pc: {
      icon: 'h-6 w-6',
      title: 'text-2xl',
      badgeText: 'text-2xl',
    },
    responsive: {
      icon: 'h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6',
      title: 'text-sm md:text-base lg:text-lg',
      badgeText: 'text-xs md:text-sm lg:text-base',
    },
  });

  const isKeyboardMode = playMode === 'keyboard';
  const containerClass = isKeyboardMode
    ? 'flex flex-col gap-1'
    : 'flex flex-row justify-between gap-2';
  const nameClass = isKeyboardMode
    ? `text-foreground flex min-w-0 items-center justify-center gap-2 font-bold ${styles.title}`
    : `text-foreground flex min-w-0 flex-1 items-center gap-2 font-bold ${styles.title}`;
  const badgeContainerClass = isKeyboardMode
    ? 'flex flex-wrap justify-center gap-1'
    : 'flex flex-nowrap gap-2';

  return (
    <div className={containerClass}>
      {/* Player's Name */}
      <h3 className={nameClass}>
        <User className={`shrink-0 ${styles.icon}`} />
        <span className="min-w-0 truncate">{player.name}</span>
      </h3>

      {/* Score and MochiFuda Count */}
      <div className={badgeContainerClass}>
        <Badge
          variant="outline"
          className={`shrink-0 bg-yellow-100 text-yellow-700 ${styles.badgeText}`}
        >
          {score.toLocaleString()} pts
        </Badge>
        <Badge
          variant="outline"
          className={`shrink-0 bg-green-100 text-green-700 ${styles.badgeText}`}
        >
          {mochiFudaCount.toLocaleString()} 枚
        </Badge>
      </div>
    </div>
  );
}

export type PlayerAreaProps = {
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

export function PlayerArea({
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
}: PlayerAreaProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      card: {
        borderWidth: 'border-4',
        borderColor: 'border-transparent',
        background: 'bg-transparent',
        shadow: 'shadow-none',
        transition: 'transition-all duration-300',
      },
      header: {
        padding: 'px-2 pt-2 pb-0',
      },
      content: {
        padding: 'p-2',
      },
    },
    tablet: {
      card: {
        borderWidth: 'border-4',
        borderColor: 'border-transparent',
        // background: 'bg-card',
        background: 'bg-transparent',
        shadow: 'shadow-none',
        transition: 'transition-all duration-300',
      },
      header: {
        padding: 'px-4 pt-4 pb-0',
      },
      content: {
        padding: 'p-4',
      },
    },
    pc: {
      card: {
        borderWidth: 'border-4',
        borderColor: 'border-transparent',
        // background: 'bg-card',
        background: 'bg-transparent',
        shadow: 'shadow-none',
        transition: 'transition-all duration-300',
      },
      header: {
        padding: 'px-6 pt-6 pb-0',
      },
      content: {
        padding: 'p-6',
      },
    },
    responsive: {
      card: {
        borderWidth: 'border-2',
        borderColor: 'border-transparent',
        background: 'bg-card',
        shadow: 'shadow-none',
        transition: 'transition-all duration-300',
      },
      header: {
        padding: 'p-2 md:p-3 lg:p-4',
      },
      content: {
        padding: 'p-2 md:p-4 lg:p-6',
      },
    },
  });

  // Border style based on feedback state
  const cardBorder = feedbackState
    ? feedbackState === 'correct'
      ? `${styles.card.borderWidth} border-green-500`
      : `${styles.card.borderWidth} border-red-500`
    : `${styles.card.borderWidth} ${styles.card.borderColor}`;

  const cardShadow = feedbackState
    ? feedbackState === 'correct'
      ? 'shadow-2xl shadow-green-500/70'
      : 'shadow-2xl shadow-red-500/70'
    : styles.card.shadow;

  const cardAnimationClass = feedbackState
    ? feedbackState === 'correct'
      ? 'animate-[flash_0.6s_ease-in-out]'
      : 'animate-[shake_0.5s_ease-in-out]'
    : '';
  // const cardAnimationClass = '';

  return (
    <Card
      className={`${cardBorder} ${cardShadow} ${cardAnimationClass} ${styles.card.background} $ ${styles.card.transition}`}
    >
      <CardHeader className={styles.header.padding}>
        <PlayerInfo
          player={player}
          mochiFudaCount={mochiFudaCount}
          score={score}
          playMode={playMode}
          screenSize={screenSize}
        />
      </CardHeader>
      <CardContent className={styles.content.padding}>
        <PlayerTatami
          tatamiCards={tatamiCards}
          onCardClick={onCardClick}
          playMode={playMode}
          playerIndex={playerIndex}
          playerCount={playerCount}
          screenSize={screenSize}
        />
      </CardContent>
    </Card>
  );
}
