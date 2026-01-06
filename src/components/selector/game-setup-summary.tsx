import type { DeckRecipe, StackRecipe, Deck } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { getResponsiveStyles } from '@/lib/ui-utils';

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
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      gridCols: 'grid-cols-2',
      gap: 'gap-2',
      padding: 'p-2',
      title: {
        size: 'text-base',
        margin: 'mb-2',
      },
      text: {
        size: 'text-sm',
      },
    },
    tablet: {
      gridCols: 'grid-cols-4',
      gap: 'gap-3',
      padding: 'p-3',
      title: {
        size: 'text-lg',
        margin: 'mb-2',
      },
      text: {
        size: 'text-base',
      },
    },
    pc: {
      gridCols: 'grid-cols-4',
      gap: 'gap-4',
      padding: 'p-4',
      title: {
        size: 'text-xl',
        margin: 'mb-2',
      },
      text: {
        size: 'text-xl',
      },
    },
    responsive: {
      gridCols: 'grid-cols-2 md:grid-cols-4',
      gap: 'gap-2 md:gap-3 lg:gap-4',
      padding: 'p-3 md:p-4 lg:p-6',
      title: {
        size: 'text-base md:text-lg lg:text-xl',
        margin: 'mb-3 md:mb-4',
      },
      text: {
        size: 'text-sm md:text-base lg:text-xl',
      },
    },
  });

  return (
    <div
      className={`rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 ${styles.padding}`}
    >
      <h3
        className={`${styles.title.margin} ${styles.title.size} font-bold text-gray-900 dark:text-gray-100`}
      >
        📋 設定
      </h3>
      <div className={`grid ${styles.gap} ${styles.gridCols}`}>
        <div className="flex items-center gap-2">
          <span
            className={`${styles.text.size} font-semibold text-gray-700 dark:text-gray-300`}
          >
            入力方式:
          </span>
          <span
            className={`${styles.text.size} text-gray-900 dark:text-gray-100`}
          >
            {selectedPlayMode === 'keyboard' ? (
              '⌨️ キーボード'
            ) : selectedPlayMode === 'touch' ? (
              '📱 タッチ'
            ) : (
              <span className="text-destructive">未選択</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`${styles.text.size} font-semibold text-gray-700 dark:text-gray-300`}
          >
            参加者:
          </span>
          <span
            className={`${styles.text.size} text-gray-900 dark:text-gray-100`}
          >
            {selectedPlayerCount > 0 ? (
              `${selectedPlayerCount} 人`
            ) : (
              <span className="text-destructive">未選択</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`${styles.text.size} font-semibold text-gray-700 dark:text-gray-300`}
          >
            デッキ:
          </span>
          <span
            className={`${styles.text.size} text-gray-900 dark:text-gray-100`}
          >
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
              <span className="text-destructive">未選択</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`${styles.text.size} font-semibold text-gray-700 dark:text-gray-300`}
          >
            枚数:
          </span>
          <span
            className={`${styles.text.size} text-gray-900 dark:text-gray-100`}
          >
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
              <span className="text-destructive">未選択</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
