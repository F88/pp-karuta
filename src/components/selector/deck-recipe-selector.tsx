import type { DeckRecipe, Deck } from '@/models/karuta';
import { DeckRecipeCard } from '@/components/recipe/deck-recipe-card';

export type DeckRecipeSelectorProps = {
  deckRecipes: DeckRecipe[];
  selectedDeckRecipe: DeckRecipe | null;
  onSelectDeckRecipe: (recipe: DeckRecipe) => void;
  isDeckLoading: boolean;
  loadingDeckRecipeId: string | null;
  generatedDeck: Deck | null;
};

export function DeckRecipeSelector({
  deckRecipes,
  selectedDeckRecipe,
  onSelectDeckRecipe,
  isDeckLoading,
  loadingDeckRecipeId,
  generatedDeck,
}: DeckRecipeSelectorProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {deckRecipes.map((recipe) => (
          <DeckRecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={onSelectDeckRecipe}
            isSelected={selectedDeckRecipe?.id === recipe.id}
            isLoading={isDeckLoading}
            isLoadingThisRecipe={loadingDeckRecipeId === recipe.id}
          />
        ))}
      </div>
      {generatedDeck && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
          <p className="text-sm font-semibold text-green-800 dark:text-green-200">
            ✓ Deck生成完了: {generatedDeck.size}枚
          </p>
        </div>
      )}
    </>
  );
}
