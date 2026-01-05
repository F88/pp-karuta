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
      triggerPadding = 'px-3 py-2';
      titleSize = 'text-sm';
      iconSize = 'h-4 w-4';
      break;
    case 'tablet':
      triggerPadding = 'px-4 py-2.5';
      titleSize = 'text-base';
      iconSize = 'h-4 w-4';
      break;
    case 'pc':
      triggerPadding = 'px-4 py-3';
      titleSize = 'text-base';
      iconSize = 'h-5 w-5';
      break;
    default:
      triggerPadding = 'px-4 py-2.5';
      titleSize = 'text-base';
      iconSize = 'h-4 w-4';
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
                className={`border-border bg-background/50 hover:bg-accent hover:border-accent-foreground/20 flex w-full items-center justify-between rounded-md border transition-all ${triggerPadding}`}
              >
                <h3 className={`font-semibold ${titleSize}`}>{category}</h3>
                <ChevronDown
                  className={`text-muted-foreground transition-transform duration-200 ${iconSize} ${
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
