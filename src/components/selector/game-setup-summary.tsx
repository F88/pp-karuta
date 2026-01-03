import type { DeckRecipe, StackRecipe, Deck } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';

export type GameSetupSummaryProps = {
  selectedPlayMode: PlayMode | null;
  selectedDeckRecipe: DeckRecipe | null;
  generatedDeck: Deck | null;
  selectedStackRecipe: StackRecipe | null;
  stackSize: number | null;
  selectedPlayerCount: number;
  screenSize: ScreenSize;
};

export function GameSetupSummary({
  selectedPlayMode,
  selectedDeckRecipe,
  generatedDeck,
  selectedStackRecipe,
  stackSize,
  selectedPlayerCount,
  screenSize,
}: GameSetupSummaryProps) {
  const padding =
    screenSize === 'smartphone'
      ? 'p-3'
      : screenSize === 'tablet'
        ? 'p-4'
        : 'p-6';
  const titleSize =
    screenSize === 'smartphone'
      ? 'text-base'
      : screenSize === 'tablet'
        ? 'text-lg'
        : 'text-xl';
  const marginBottom = screenSize === 'smartphone' ? 'mb-3' : 'mb-4';
  const gap = screenSize === 'smartphone' ? 'gap-2' : 'gap-3';
  const textSize = screenSize === 'smartphone' ? 'text-xs' : 'text-sm';

  return (
    <div
      className={`mt-8 rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 ${padding}`}
    >
      <h3
        className={`${marginBottom} ${titleSize} font-bold text-gray-900 dark:text-gray-100`}
      >
        📋 選択内容
      </h3>
      <div className={`grid ${gap} sm:grid-cols-2`}>
        <div className="flex items-center gap-2">
          <span
            className={`${textSize} font-semibold text-gray-700 dark:text-gray-300`}
          >
            入力方式:
          </span>
          <span className={`${textSize} text-gray-900 dark:text-gray-100`}>
            {selectedPlayMode === 'keyboard'
              ? '⌨️ Keyboard'
              : selectedPlayMode === 'touch'
                ? '📱 Touch'
                : '未選択'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`${textSize} font-semibold text-gray-700 dark:text-gray-300`}
          >
            デッキ
          </span>
          <span className={`${textSize} text-gray-900 dark:text-gray-100`}>
            {selectedDeckRecipe ? (
              <>
                {selectedDeckRecipe.title}
                {generatedDeck && (
                  <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                    ({generatedDeck.size.toLocaleString()}枚)
                  </span>
                )}
              </>
            ) : (
              '未選択'
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`${textSize} font-semibold text-gray-700 dark:text-gray-300`}
          >
            枚数:
          </span>
          <span className={`${textSize} text-gray-900 dark:text-gray-100`}>
            {selectedStackRecipe ? (
              <>
                {selectedStackRecipe.title}
                {stackSize !== null && (
                  <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                    ({stackSize.toLocaleString()}枚)
                  </span>
                )}
              </>
            ) : (
              '未選択'
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`${textSize} font-semibold text-gray-700 dark:text-gray-300`}
          >
            プレイヤー:
          </span>
          <span className={`${textSize} text-gray-900 dark:text-gray-100`}>
            {selectedPlayerCount > 0 ? `${selectedPlayerCount}人` : '未選択'}
          </span>
        </div>
      </div>
    </div>
  );
}
