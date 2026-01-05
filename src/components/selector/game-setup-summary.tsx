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
  const padding = (() => {
    switch (screenSize) {
      case 'smartphone':
        return 'p-3';
      case 'tablet':
        return 'p-4';
      case 'pc':
        return 'p-6';
    }
  })();

  const titleSize = (() => {
    switch (screenSize) {
      case 'smartphone':
        return 'text-base';
      case 'tablet':
        return 'text-lg';
      case 'pc':
        return 'text-xl';
    }
  })();

  const marginBottom = (() => {
    switch (screenSize) {
      case 'smartphone':
        return 'mb-3';
      case 'tablet':
      case 'pc':
        return 'mb-4';
    }
  })();

  const gap = (() => {
    switch (screenSize) {
      case 'smartphone':
        return 'gap-2';
      case 'tablet':
      case 'pc':
        return 'gap-3';
    }
  })();

  const textSize = (() => {
    switch (screenSize) {
      case 'smartphone':
        return 'text-sm';
      case 'tablet':
        return 'text-base';
      case 'pc':
        return 'text-xl';
    }
  })();

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
              ? '⌨️ キーボード'
              : selectedPlayMode === 'touch'
                ? '📱 タッチ'
                : '未選択'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`${textSize} font-semibold text-gray-700 dark:text-gray-300`}
          >
            参加者:
          </span>
          <span className={`${textSize} text-gray-900 dark:text-gray-100`}>
            {selectedPlayerCount > 0 ? `${selectedPlayerCount} 人` : '未選択'}
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
                    ({generatedDeck.size.toLocaleString()} 組)
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
                    ({stackSize.toLocaleString()} 組)
                  </span>
                )}
              </>
            ) : (
              '未選択'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
