import type { StackRecipe } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type StackRecipeCardProps = {
  recipe: StackRecipe;
  onSelect: (recipe: StackRecipe) => void;
  isSelected?: boolean;
  isLoading?: boolean;
  /** Screen size for fixed sizing. If not provided, responsive classes will be used */
  screenSize?: ScreenSize;
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

const getSortMethodLabel = (sortMethod: string) => {
  switch (sortMethod) {
    case 'random':
      return 'Random';
    case 'id-asc':
      return 'ID Ascending';
    case 'id-desc':
      return 'ID Descending';
    default:
      return sortMethod;
  }
};

export function StackRecipeCard({
  recipe,
  onSelect,
  isSelected = false,
  isLoading = false,
  screenSize,
}: StackRecipeCardProps) {
  const baseClass = isSelected
    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
    : 'bg-white dark:bg-gray-800';

  const textClass = {
    title: isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-100',
    description: isSelected
      ? 'text-indigo-100'
      : 'text-gray-600 dark:text-gray-400',
    content: isSelected
      ? 'text-indigo-100'
      : 'text-gray-700 dark:text-gray-300',
    label: isSelected ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400',
  };

  const sizeStyles = screenSize
    ? {
        smartphone: {
          padding: 'p-4',
          titleSize: 'text-base',
          descriptionSize: 'text-xs',
          contentSize: 'text-xs',
          labelSize: 'text-xs',
        },
        tablet: {
          padding: 'p-5',
          titleSize: 'text-lg',
          descriptionSize: 'text-sm',
          contentSize: 'text-sm',
          labelSize: 'text-sm',
        },
        pc: {
          padding: 'p-6',
          titleSize: 'text-xl',
          descriptionSize: 'text-sm',
          contentSize: 'text-sm',
          labelSize: 'text-sm',
        },
      }[screenSize]
    : {
        padding: 'p-4 md:p-5 lg:p-6',
        titleSize: 'text-base md:text-lg lg:text-xl',
        descriptionSize: 'text-xs md:text-sm',
        contentSize: 'text-xs md:text-sm',
        labelSize: 'text-xs md:text-sm',
      };

  return (
    <Button
      onClick={() => onSelect(recipe)}
      disabled={isLoading}
      variant={isSelected ? 'default' : 'outline'}
      className={`group relative h-auto overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${sizeStyles.padding} ${baseClass}`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10 ${
          isSelected ? 'opacity-20' : ''
        }`}
      />
      <div className="relative">
        <h3
          className={`mb-2 font-bold ${sizeStyles.titleSize} ${textClass.title}`}
        >
          {recipe.title}
        </h3>

        {recipe.description && (
          <p
            className={`mb-3 ${sizeStyles.descriptionSize} ${textClass.description}`}
          >
            {recipe.description}
          </p>
        )}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <div className="mb-2 space-y-1">
            <div className={`${sizeStyles.contentSize} ${textClass.content}`}>
              <span className="font-medium">Size:</span>{' '}
              {recipe.maxSize === 'all'
                ? 'All cards'
                : `${recipe.maxSize} cards`}
            </div>
            <div className={`${sizeStyles.contentSize} ${textClass.content}`}>
              <span className="font-medium">Order:</span>{' '}
              {getSortMethodLabel(recipe.sortMethod)}
            </div>
          </div>
        )}

        <div className="mb-2 flex items-center gap-2">
          <span
            className={`font-semibold ${sizeStyles.labelSize} ${textClass.label}`}
          >
            Difficulty:
          </span>
          <Badge
            variant="outline"
            className={getDifficultyBadgeClass(recipe.difficulty, isSelected)}
          >
            {recipe.difficulty}
          </Badge>
        </div>

        {import.meta.env.VITE_DEBUG_MODE === 'true' ||
          (recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={
                    isSelected ? 'bg-white/20 text-white hover:bg-white/30' : ''
                  }
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          ))}
      </div>
    </Button>
  );
}
