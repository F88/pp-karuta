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
import {
  useResponsiveGridColumns,
  useResponsiveGap,
} from '@/hooks/use-responsive-styles';
import { getResponsiveStyles } from '@/lib/ui-utils';

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

  const gridCols = useResponsiveGridColumns(screenSize, {
    smartphone: 3,
    tablet: 4,
    pc: 6,
  });

  const gridGap = useResponsiveGap(screenSize, {
    // smartphone: 2,
    // tablet: 4,
    // pc: 4,
  });

  const sizeStyles = getResponsiveStyles(screenSize, {
    smartphone: {
      trigger: {
        padding: 'px-2 py-1',
      },
      title: {
        size: 'text-sm',
      },
      icon: {
        size: 'h-4 w-4',
      },
      spacing: 'space-y-1',
      contentPadding: 'pt-1',
    },
    tablet: {
      trigger: {
        padding: 'px-3 py-2',
      },
      title: {
        size: 'text-sm',
      },
      icon: {
        size: 'h-4 w-4',
      },
      spacing: 'space-y-2',
      contentPadding: 'pt-2',
    },
    pc: {
      trigger: {
        padding: 'px-4 py-2',
      },
      title: {
        size: 'text-base',
      },
      icon: {
        size: 'h-6 w-6',
      },
      spacing: 'space-y-4',
      contentPadding: 'py-4',
    },
    responsive: {
      trigger: {
        padding: 'px-4 py-2.5',
      },
      title: {
        size: 'text-base',
      },
      icon: {
        size: 'h-4 w-4',
      },
      spacing: 'space-y-3',
      contentPadding: 'pt-4',
    },
  });

  const renderRecipeCards = (recipes: DeckRecipe[]) => (
    <div className={`grid ${gridGap} ${gridCols}`}>
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
        <div className={sizeStyles.spacing}>
          {Object.entries(groupedRecipes).map(([category, recipes]) => (
            <Collapsible
              key={category}
              open={openCategories[category]}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger
                className={`border-border bg-background/50 hover:bg-accent hover:border-accent-foreground/20 flex w-full items-center justify-between rounded-md border transition-all ${sizeStyles.trigger.padding}`}
              >
                <h3 className={`font-semibold ${sizeStyles.title.size}`}>
                  {category}
                </h3>
                <ChevronDown
                  className={`text-muted-foreground transition-transform duration-200 ${sizeStyles.icon.size} ${
                    openCategories[category] ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className={sizeStyles.contentPadding}>
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
