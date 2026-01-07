import type { Deck } from '@/models/karuta';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export type DeckPreviewProps = {
  deck: Deck;
  showDetails?: boolean;
};

export function DeckPreview({ deck, showDetails = false }: DeckPreviewProps) {
  const prototypes = Array.from(deck.values()).slice(0, 30);

  return (
    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
      <AlertDescription className="text-green-800 dark:text-green-200">
        <div className="mb-0 font-semibold">
          ✓ デッキ: {deck.size.toLocaleString()} 組
        </div>
        {showDetails && prototypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {prototypes.map((prototype) => (
              <Badge
                key={prototype.id}
                variant="outline"
                className="bg-white text-xs dark:bg-gray-900"
              >
                <span className="text-muted-foreground font-mono">
                  {prototype.id}
                </span>
                <span className="text-foreground ml-1">
                  {prototype.prototypeNm}
                </span>
              </Badge>
            ))}
          </div>
        )}
        {showDetails && deck.size > 30 && (
          <div className="text-muted-foreground mt-2 text-xs">
            他 {(deck.size - 30).toLocaleString()} 件
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
