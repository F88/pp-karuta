import type { NormalizedPrototype } from '@f88/promidas/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type YomiFudaCardProps = {
  normalizedPrototype: NormalizedPrototype;
};

export function YomiFudaCard({ normalizedPrototype }: YomiFudaCardProps) {
  return (
    <Card className="mb-8 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-indigo-600">
            📜 {normalizedPrototype.prototypeNm ?? 'NO NAME'}
          </h2>
          <Badge variant="secondary">{normalizedPrototype.id}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg leading-relaxed text-gray-700">
          {normalizedPrototype.summary || 'No description'}
        </p>
      </CardContent>
    </Card>
  );
}
