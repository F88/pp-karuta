import { Button } from '@/components/ui/button';
import type { Player } from '@/models/karuta';

export type PlayerSelectionCardProps = {
  player: Player;
  isSelected: boolean;
  onToggle: (playerId: string) => void;
  isDisabled?: boolean;
};

export function PlayerSelectionCard({
  player,
  isSelected,
  onToggle,
  isDisabled = false,
}: PlayerSelectionCardProps) {
  return (
    <Button
      onClick={() => onToggle(player.id)}
      disabled={isDisabled}
      variant={isSelected ? 'default' : 'outline'}
      className={`group relative h-auto w-full justify-start overflow-hidden rounded-xl p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
        isSelected
          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10 ${
          isSelected ? 'opacity-20' : ''
        }`}
      />
      <div className="relative flex items-center justify-start gap-3">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-2xl ${
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-indigo-100 dark:bg-indigo-900'
          }`}
        >
          {isSelected ? '✓' : '👤'}
        </div>
        <div className="flex-1 text-left">
          <h3
            className={`font-semibold ${
              isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {player.name}
          </h3>
          {/* <p
            className={`text-xs ${
              isSelected
                ? 'text-indigo-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            ID: {player.id}
          </p> */}
        </div>
      </div>
    </Button>
  );
}
