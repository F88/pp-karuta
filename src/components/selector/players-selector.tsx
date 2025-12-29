import type { Player } from '@/models/karuta';
import { GameManager } from '@/lib/karuta';
import { PlayerSelectionCard } from '@/components/player/player-selection-card';
import { Button } from '@/components/ui/button';

export type PlayersSelectorProps = {
  availablePlayers: Player[];
  selectedPlayerIds: string[];
  onTogglePlayer: (playerId: string) => void;
  onAddPlayer: () => void;
  isLoading: boolean;
};

export function PlayersSelector({
  availablePlayers,
  selectedPlayerIds,
  onTogglePlayer,
  onAddPlayer,
  isLoading,
}: PlayersSelectorProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {availablePlayers.map((player) => {
          const isSelected = selectedPlayerIds.includes(player.id);
          const maxPlayersReached =
            selectedPlayerIds.length >= GameManager.MAX_GAME_PLAYERS;
          return (
            <PlayerSelectionCard
              key={player.id}
              player={player}
              isSelected={isSelected}
              onToggle={onTogglePlayer}
              isDisabled={isLoading || (!isSelected && maxPlayersReached)}
            />
          );
        })}

        {/* Add Player Button */}
        <Button
          onClick={onAddPlayer}
          disabled={isLoading}
          variant="outline"
          className="group relative h-auto overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-400 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-700 dark:text-gray-500">
              +
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              プレイヤー追加
            </span>
          </div>
        </Button>
      </div>
      {selectedPlayerIds.length >= GameManager.MAX_GAME_PLAYERS && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          ゲームに参加できるのは最大{GameManager.MAX_GAME_PLAYERS}人までです
        </p>
      )}
    </>
  );
}
