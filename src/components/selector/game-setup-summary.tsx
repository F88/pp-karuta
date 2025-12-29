import type { DeckRecipe, StackRecipe, Deck } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';

export type GameSetupSummaryProps = {
  selectedPlayMode: PlayMode | null;
  selectedDeckRecipe: DeckRecipe | null;
  generatedDeck: Deck | null;
  selectedStackRecipe: StackRecipe | null;
  stackSize: number | null;
  selectedPlayerCount: number;
};

export function GameSetupSummary({
  selectedPlayMode,
  selectedDeckRecipe,
  generatedDeck,
  selectedStackRecipe,
  stackSize,
  selectedPlayerCount,
}: GameSetupSummaryProps) {
  return (
    <div className="mt-8 rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-700 dark:bg-indigo-950">
      <h3 className="mb-4 text-lg font-bold text-indigo-900 dark:text-indigo-100">
        📋 選択内容
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            入力方式:
          </span>
          <span className="text-sm text-indigo-900 dark:text-indigo-100">
            {selectedPlayMode === 'keyboard'
              ? '⌨️ Keyboard'
              : selectedPlayMode === 'touch'
                ? '📱 Touch'
                : '未選択'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            Deck Recipe:
          </span>
          <span className="text-sm text-indigo-900 dark:text-indigo-100">
            {selectedDeckRecipe ? (
              <>
                {selectedDeckRecipe.title}
                {generatedDeck && (
                  <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">
                    ({generatedDeck.size}枚)
                  </span>
                )}
              </>
            ) : (
              '未選択'
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            Stack Recipe:
          </span>
          <span className="text-sm text-indigo-900 dark:text-indigo-100">
            {selectedStackRecipe ? (
              <>
                {selectedStackRecipe.title}
                {stackSize !== null && (
                  <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">
                    ({stackSize}枚)
                  </span>
                )}
              </>
            ) : (
              '未選択'
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
            プレイヤー:
          </span>
          <span className="text-sm text-indigo-900 dark:text-indigo-100">
            {selectedPlayerCount > 0 ? `${selectedPlayerCount}人` : '未選択'}
          </span>
        </div>
      </div>
    </div>
  );
}
