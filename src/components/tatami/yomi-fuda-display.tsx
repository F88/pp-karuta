import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import type { NormalizedPrototype } from 'promidas/types';

export type YomiFudaDisplayProps = {
  normalizedPrototype: NormalizedPrototype;
};

export function YomiFudaDisplay({ normalizedPrototype }: YomiFudaDisplayProps) {
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
