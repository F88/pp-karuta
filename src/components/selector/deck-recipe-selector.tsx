import { useState } from 'react';

import type { ScreenSize } from '@/types/screen-size';

import type { Deck, DeckRecipe } from '@/models/karuta';

import { ChevronDown } from 'lucide-react';

import { DeckRecipeCard } from '@/components/recipe/deck-recipe-card';
import { DeckPreview } from '@/components/selector/deck-preview';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export type DeckRecipeSelectorProps = {
  deckRecipes: DeckRecipe[];
  selectedDeckRecipe: DeckRecipe | null;
  onSelectDeckRecipe: (recipe: DeckRecipe) => void;
  isDeckLoading: boolean;
  loadingDeckRecipeId: string | null;
  generatedDeck: Deck | null;
  screenSize?: ScreenSize;
  enableGrouping?: boolean;
  initialOpenCategories?: string[];
};

export function DeckRecipeSelector({
  deckRecipes,
  selectedDeckRecipe,
  onSelectDeckRecipe,
  isDeckLoading,
  loadingDeckRecipeId,
  generatedDeck,
  screenSize,
  enableGrouping = true,
  initialOpenCategories,
}: DeckRecipeSelectorProps) {
  const groupedRecipes = enableGrouping
    ? deckRecipes.reduce(
        (acc, recipe) => {
          const tags = recipe.tags.length > 0 ? recipe.tags : ['未分類'];
          tags.forEach((tag) => {
            if (!acc[tag]) {
              acc[tag] = [];
            }
            acc[tag].push(recipe);
          });
          return acc;
        },
        {} as Record<string, DeckRecipe[]>,
      )
    : null;

  // Initialize open categories based on initialOpenCategories prop
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => {
      if (!groupedRecipes) return {};

      return Object.keys(groupedRecipes).reduce(
        (acc, key) => {
          acc[key] = initialOpenCategories?.includes(key) ?? false;
          return acc;
        },
        {} as Record<string, boolean>,
      );
    },
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderRecipeCards = (recipes: DeckRecipe[]) => (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe) => (
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
  );

  let triggerPadding: string;
  let titleSize: string;
  let iconSize: string;

  switch (screenSize) {
    case 'smartphone':
      triggerPadding = 'p-3';
      titleSize = 'text-base';
      iconSize = 'h-4 w-4';
      break;
    case 'tablet':
      triggerPadding = 'p-4';
      titleSize = 'text-lg';
      iconSize = 'h-5 w-5';
      break;
    case 'pc':
      triggerPadding = 'p-5';
      titleSize = 'text-xl';
      iconSize = 'h-6 w-6';
      break;
    default:
      triggerPadding = 'p-4';
      titleSize = 'text-lg';
      iconSize = 'h-5 w-5';
  }

  return (
    <>
      {generatedDeck && (
        <DeckPreview
          //
          deck={generatedDeck}
          showDetails={import.meta.env.VITE_DEBUG_MODE === 'true'}
        />
      )}
      {enableGrouping && groupedRecipes ? (
        <div className="space-y-4">
          {Object.entries(groupedRecipes).map(([category, recipes]) => (
            <Collapsible
              key={category}
              open={openCategories[category]}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger
                className={`from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 flex w-full items-center justify-between rounded-lg bg-linear-to-r transition-all hover:shadow-md ${triggerPadding}`}
              >
                <h3 className={`font-bold ${titleSize}`}>{category}</h3>
                <ChevronDown
                  className={`transition-transform duration-200 ${iconSize} ${
                    openCategories[category] ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                {renderRecipeCards(recipes)}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      ) : (
        renderRecipeCards(deckRecipes)
      )}
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
