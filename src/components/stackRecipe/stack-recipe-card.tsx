import type { StackRecipe } from '@/models/karuta';
import { Button } from '@/components/ui/button';

export type StackRecipeCardProps = {
  recipe: StackRecipe;
  onSelect: (recipe: StackRecipe) => void;
  isSelected?: boolean;
  isLoading?: boolean;
};

export function StackRecipeCard({
  recipe,
  onSelect,
  isSelected = false,
  isLoading = false,
}: StackRecipeCardProps) {
  return (
    <Button
      onClick={() => onSelect(recipe)}
      disabled={isLoading}
      variant={isSelected ? 'default' : 'outline'}
      className={`group relative h-auto overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
        isSelected
          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
          : 'bg-white dark:bg-gray-800'
      }`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10 ${
          isSelected ? 'opacity-20' : ''
        }`}
      />
      <div className="relative">
        <h3
          className={`mb-2 text-xl font-bold ${
            isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-100'
          }`}
        >
          {recipe.title}
        </h3>

        {recipe.description && (
          <p
            className={`mb-3 text-sm ${
              isSelected
                ? 'text-indigo-100'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {recipe.description}
          </p>
        )}

        <div className="mb-2 space-y-1">
          <div
            className={`text-sm ${
              isSelected
                ? 'text-indigo-100'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="font-medium">Size:</span>{' '}
            {recipe.maxSize === 'all' ? 'All cards' : `${recipe.maxSize} cards`}
          </div>
          <div
            className={`text-sm ${
              isSelected
                ? 'text-indigo-100'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="font-medium">Order:</span>{' '}
            {recipe.sortMethod === 'random' ? 'Random' : 'Sequential'}
          </div>
        </div>

        <div className="mb-2 flex items-center gap-2">
          <span
            className={`text-xs font-semibold ${
              isSelected
                ? 'text-indigo-200'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Difficulty:
          </span>
          <span
            className={`rounded px-2 py-1 text-xs font-bold ${
              isSelected
                ? 'bg-white/20 text-white'
                : recipe.difficulty === 'beginner'
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
