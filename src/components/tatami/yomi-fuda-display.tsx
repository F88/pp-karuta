import type { NormalizedPrototype } from '@f88/promidas/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type YomiFudaDisplayProps = {
  yomiFuda: NormalizedPrototype;
};

export function YomiFudaDisplay({ yomiFuda }: YomiFudaDisplayProps) {
  return (
    <Card className="mb-8 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-indigo-600">📖 YomiFuda</h2>
          <Badge variant="secondary">{yomiFuda.prototypeNm}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg leading-relaxed text-gray-700">
          {yomiFuda.summary || yomiFuda.freeComment || 'No description'}
        </p>
      </CardContent>
    </Card>
  );
}
