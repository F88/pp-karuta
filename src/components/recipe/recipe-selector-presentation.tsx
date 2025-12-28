import type { DeckRecipe } from '@/models/karuta';
import { RecipeCard } from './recipe-card';

export type RecipeSelectorPresentationProps = {
  recipes: DeckRecipe[];
  onSelectRecipe: (recipe: DeckRecipe) => void;
  onShowIntro?: () => void;
  isLoading?: boolean;
  error?: string | null;
  loadingRecipeId?: string | null;
};

export function RecipeSelectorPresentation({
  recipes,
  onSelectRecipe,
  isLoading = false,
  error = null,
  loadingRecipeId = null,
}: RecipeSelectorPresentationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-8 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-6xl">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-800 dark:text-gray-100">
          🎴 Select Deck Recipe
        </h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
            <p className="font-semibold">Error loading deck:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              isLoading={isLoading}
              isLoadingThisRecipe={loadingRecipeId === recipe.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
