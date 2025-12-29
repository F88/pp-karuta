import type { DeckRecipe } from '@/models/karuta';
import { Button } from '@/components/ui/button';

export type DeckRecipeCardProps = {
  recipe: DeckRecipe;
  onSelect: (recipe: DeckRecipe) => void;
  isSelected?: boolean;
  isLoading?: boolean;
  isLoadingThisRecipe?: boolean;
};

const getDifficultyBadgeClass = (difficulty: string, isSelected: boolean) => {
  if (isSelected) return 'bg-white/20 text-white';

  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
    case 'advanced':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200';
  }
};

export function DeckRecipeCard({
  recipe,
  onSelect,
  isSelected = false,
  isLoading = false,
  isLoadingThisRecipe = false,
}: DeckRecipeCardProps) {
  const baseClass = isSelected
    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
    : 'bg-white dark:bg-gray-800';

  const textClass = {
    title: isSelected
      ? 'text-white dark:text-white'
      : 'text-gray-800 dark:text-gray-100',
    description: isSelected
      ? 'text-white/90 dark:text-white/90'
      : 'text-gray-600 dark:text-gray-400',
    label: isSelected
      ? 'text-white/80 dark:text-white/80'
      : 'text-gray-500 dark:text-gray-400',
    content: isSelected
      ? 'text-white/90 dark:text-white/90'
      : 'text-gray-700 dark:text-gray-300',
  };

  return (
    <Button
      onClick={() => onSelect(recipe)}
      disabled={isLoading}
      variant={isSelected ? 'default' : 'outline'}
      className={`group relative h-auto overflow-hidden rounded-2xl p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${baseClass}`}
    >
      {isLoadingThisRecipe && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90">
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
        <h2 className={`mb-2 text-2xl font-bold ${textClass.title}`}>
          {recipe.title}
        </h2>

        {recipe.description && (
          <p className={`mb-3 text-sm ${textClass.description}`}>
            {recipe.description}
          </p>
        )}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <div className="mb-3 space-y-1">
            <div className={`text-xs font-semibold ${textClass.label}`}>
              API Parameters:
            </div>
            <div className={`space-y-0.5 text-sm ${textClass.content}`}>
              {recipe.apiParams.limit && (
                <div>
                  <span className="font-medium">Limit:</span>{' '}
                  {recipe.apiParams.limit}
                </div>
              )}
              {recipe.apiParams.userNm && (
                <div>
                  <span className="font-medium">User:</span>{' '}
                  {recipe.apiParams.userNm}
                </div>
              )}
              {recipe.apiParams.materialNm && (
                <div>
                  <span className="font-medium">Material:</span>{' '}
                  {recipe.apiParams.materialNm}
                </div>
              )}
              {recipe.apiParams.tagNm && (
                <div>
                  <span className="font-medium">Tag:</span>{' '}
                  {recipe.apiParams.tagNm}
                </div>
              )}
              {recipe.apiParams.eventNm && (
                <div>
                  <span className="font-medium">Event:</span>{' '}
                  {recipe.apiParams.eventNm}
                </div>
              )}
              {recipe.apiParams.offset !== undefined && (
                <div>
                  <span className="font-medium">Offset:</span>{' '}
                  {recipe.apiParams.offset}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-2 flex items-center gap-2">
          <span className={`text-xs font-semibold ${textClass.label}`}>
            Difficulty:
          </span>
          <span
            className={`rounded px-2 py-1 text-xs font-bold ${getDifficultyBadgeClass(
              recipe.difficulty,
              isSelected,
            )}`}
          >
            {recipe.difficulty}
          </span>
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2 py-1 text-xs ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Button>
  );
}
