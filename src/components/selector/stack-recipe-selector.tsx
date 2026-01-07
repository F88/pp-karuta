import type { ScreenSize } from '@/types/screen-size';

import type { Deck, StackRecipe } from '@/models/karuta';

import { StackRecipeCard } from '@/components/recipe/stack-recipe-card';
import { getResponsiveStyles } from '@/lib/ui-utils';

export type StackRecipeSelectorProps = {
  stackRecipes: StackRecipe[];
  selectedStackRecipe: StackRecipe | null;
  onSelectStackRecipe: (recipe: StackRecipe) => void;
  isLoading: boolean;
  generatedStack: number[] | null;
  generatedDeck: Deck | null;
  screenSize?: ScreenSize;
};

export function StackRecipeSelector({
  stackRecipes,
  selectedStackRecipe,
  onSelectStackRecipe,
  isLoading,
  // generatedStack,
  generatedDeck,
  screenSize,
}: StackRecipeSelectorProps) {
  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      gridCols: 'grid-cols-4',
      gap: 'gap-2',
    },
    tablet: {
      gridCols: 'grid-cols-4',
      gap: 'gap-3',
    },
    pc: {
      gridCols: 'grid-cols-4',
      gap: 'gap-4',
    },
    responsive: {
      gridCols: 'grid-cols-4',
      gap: 'gap-2 md:gap-3 lg:gap-4',
    },
  });

  const isDeckEmpty = generatedDeck !== null && generatedDeck.size === 0;

  if (isDeckEmpty) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
          ⚠️ デッキが空 (0組) のため、ゲームを開始出来ません
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${styles.gap} ${styles.gridCols}`}>
        {stackRecipes.map((recipe) => (
          <StackRecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={onSelectStackRecipe}
            isSelected={selectedStackRecipe?.id === recipe.id}
            isLoading={isLoading}
            screenSize={screenSize}
          />
        ))}
      </div>
    </>
  );
}
