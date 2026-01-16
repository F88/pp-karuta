import { Badge } from '@/components/ui/badge';
import type { Player } from '@/models/karuta';

interface PlayerBadgeProps {
  player: Player;
  variant?: 'default' | 'compact';
}

export function PlayerBadge({ player, variant = 'default' }: PlayerBadgeProps) {
  if (variant === 'compact') {
    return <Badge variant="secondary">{player.name}</Badge>;
  }

  return (
    <Badge variant="secondary" className="gap-1.5">
      <span className="text-base">👤</span>
      {player.name}
    </Badge>
  );
}
