import type { NormalizedPrototype } from '@f88/promidas/types';
import type { Player } from '@/models/karuta';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToriFudaCard } from './tori-fuda-card';

export type PlayerTatamiProps = {
  player: Player;
  tatamiCards: NormalizedPrototype[];
  onCardClick: (card: NormalizedPrototype) => void;
  mochiFudaCount: number;
  score: number;
};

export function PlayerTatami({
  player,
  tatamiCards,
  onCardClick,
  mochiFudaCount,
  score,
}: PlayerTatamiProps) {
  return (
    <Card className="border-2 border-indigo-300 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-700">
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {tatamiCards.map((card, index) => (
            <ToriFudaCard
              key={card.id}
              normalizedPrototype={card}
              index={index}
              isClickable={true}
              onClick={onCardClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
