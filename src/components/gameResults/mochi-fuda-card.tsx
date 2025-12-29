import type { NormalizedPrototype } from '@f88/promidas/types';
import { buildPrototypeLink } from '@/lib/prototype-utils';
import { Card, CardContent } from '@/components/ui/card';

export type MochiFudaCardProps = {
  card: NormalizedPrototype;
};

export function MochiFudaCard({ card }: MochiFudaCardProps) {
  const handleClick = () => {
    window.open(buildPrototypeLink(card.id), '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer transition-all hover:shadow-lg"
    >
      <CardContent className="p-4">
        {card.mainUrl && (
          <img
            src={card.mainUrl}
            alt={card.prototypeNm}
            className="mb-2 h-32 w-full rounded object-cover"
          />
        )}
        <h3 className="mb-1 text-sm font-semibold text-gray-800">
          {card.prototypeNm}
        </h3>
        <p className="line-clamp-2 text-xs text-gray-600">{card.summary}</p>
      </CardContent>
    </Card>
  );
}
