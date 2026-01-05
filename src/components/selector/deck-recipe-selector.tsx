import type { DeckRecipe, Deck } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { DeckRecipeCard } from '@/components/recipe/deck-recipe-card';
import { DeckPreview } from './deck-preview';

export type DeckRecipeSelectorProps = {
  deckRecipes: DeckRecipe[];
  selectedDeckRecipe: DeckRecipe | null;
  onSelectDeckRecipe: (recipe: DeckRecipe) => void;
  isDeckLoading: boolean;
  loadingDeckRecipeId: string | null;
  generatedDeck: Deck | null;
  screenSize?: ScreenSize;
};

export function DeckRecipeSelector({
  deckRecipes,
  selectedDeckRecipe,
  onSelectDeckRecipe,
  isDeckLoading,
  loadingDeckRecipeId,
  generatedDeck,
  screenSize,
}: DeckRecipeSelectorProps) {
  return (
    <>
      {generatedDeck && (
        <DeckPreview
          //
          deck={generatedDeck}
          showDetails={import.meta.env.VITE_DEBUG_MODE === 'true'}
        />
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {deckRecipes.map((recipe) => (
          <DeckRecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={onSelectDeckRecipe}
            isSelected={selectedDeckRecipe?.id === recipe.id}
            isLoading={isDeckLoading}
            isLoadingThisRecipe={loadingDeckRecipeId === recipe.id}
            screenSize={screenSize}
          />
        ))}
      </div>
      {generatedDeck && (
        <DeckPreview
          //
          deck={generatedDeck}
          showDetails={import.meta.env.VITE_DEBUG_MODE === 'true'}
        />
      )}
    </>
  );
}
