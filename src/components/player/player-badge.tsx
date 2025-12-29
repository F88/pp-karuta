import type { Player } from '@/models/karuta';

interface PlayerBadgeProps {
  player: Player;
  variant?: 'default' | 'compact';
}

export function PlayerBadge({ player, variant = 'default' }: PlayerBadgeProps) {
  if (variant === 'compact') {
    return (
      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
        {player.name}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
      <span className="text-base">👤</span>
      {player.name}
    </span>
  );
}
