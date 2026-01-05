import type { StackRecipe, Deck } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StackRecipeCard } from '@/components/recipe/stack-recipe-card';

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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
      {/* // Show generated stack info
      {generatedStack && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <AlertDescription className="text-green-800 dark:text-green-200">
            ✓ 枚数: {generatedStack.length.toLocaleString()} 枚
            {import.meta.env.VITE_DEBUG_MODE === 'true' &&
              generatedStack.map((id) => ` ${id}`).join(',')}
          </AlertDescription>
        </Alert>
      )} */}
    </>
  );
}
