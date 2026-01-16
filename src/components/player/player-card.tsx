import { Card, CardContent } from '@/components/ui/card';
import type { Player } from '@/models/karuta';

interface PlayerCardProps {
  player: Player;
  className?: string;
}

export function PlayerCard({ player, className }: PlayerCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl dark:bg-indigo-900">
          👤
        </div>
        <div className="flex-1">
          <h3 className="text-foreground font-semibold">{player.name}</h3>
          <p className="text-muted-foreground text-xs">ID: {player.id}</p>
        </div>
      </CardContent>
    </Card>
  );
}
