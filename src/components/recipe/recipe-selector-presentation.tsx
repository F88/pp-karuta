import type { DeckRecipe } from '@/models/karuta';

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
          {recipes.map((recipe) => {
            const isLoadingThisRecipe = loadingRecipeId === recipe.id;
            return (
              <button
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                disabled={isLoading}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:bg-gray-800"
              >
                {isLoadingThisRecipe && (
                  <div className="bg-opacity-90 dark:bg-opacity-90 absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        Loading...
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10" />
                <div className="relative">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {recipe.title}
                  </h2>

                  {recipe.description && (
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {recipe.description}
                    </p>
                  )}

                  <div className="mb-3 flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {recipe.deckSize}
                    </span>
                    <span>{recipe.deckSize === 1 ? 'Race' : 'Races'}</span>
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      Difficulty:
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        recipe.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : recipe.difficulty === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {recipe.difficulty}
                    </span>
                  </div>

                  {recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
