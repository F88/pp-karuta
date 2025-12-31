import type { NormalizedPrototype } from '@f88/promidas/types';
import type { Player } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToriFudaCard } from './tori-fuda-card';

export type PlayerTatamiProps = {
  player: Player;
  tatamiCards: NormalizedPrototype[];
  onCardClick: (card: NormalizedPrototype) => void;
  mochiFudaCount: number;
  score: number;
  playMode: PlayMode;
  screenSize?: ScreenSize;
};

export function PlayerTatami({
  player,
  tatamiCards,
  onCardClick,
  mochiFudaCount,
  score,
  playMode,
  screenSize,
}: PlayerTatamiProps) {
  const titleSizeClass = screenSize
    ? {
        smartphone: 'text-sm',
        tablet: 'text-base',
        pc: 'text-lg',
      }[screenSize]
    : 'text-sm md:text-base lg:text-lg';

  const gridColsClass =
    playMode === 'keyboard'
      ? 'grid-cols-4'
      : screenSize
        ? {
            smartphone: 'grid-cols-2',
            tablet: 'grid-cols-3',
            pc: 'grid-cols-4',
          }[screenSize]
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <Card className="border-2 border-indigo-300 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3
            className={`flex items-center gap-2 font-bold text-indigo-700 ${titleSizeClass}`}
          >
            <span>👤</span>
            {player.name}
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
              {score} pts
            </Badge>
            <Badge variant="outline" className="bg-pink-100 text-pink-700">
              {mochiFudaCount} cards
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-3 ${gridColsClass}`}>
          {tatamiCards.map((card, index) => (
            <ToriFudaCard
              key={card.id}
              normalizedPrototype={card}
              index={index}
              isClickable={true}
              playMode={playMode}
              onClick={onCardClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
