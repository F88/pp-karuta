import type { NormalizedPrototype } from '@f88/promidas/types';
import { ToriFudaCard } from './tori-fuda-card';

export type SharedTatamiProps = {
  tatamiCards: NormalizedPrototype[];
};

export function SharedTatami({ tatamiCards }: SharedTatamiProps) {
  return (
    <div className="mb-6">
      <h2 className="mb-4 text-center text-xl font-bold text-gray-700">
        🎴 Shared Tatami (Reference Only)
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {tatamiCards.map((card, index) => (
          <ToriFudaCard
            key={card.id}
            normalizedPrototype={card}
            index={index}
            isClickable={false}
          />
        ))}
      </div>
    </div>
  );
}
