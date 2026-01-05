import type { DeckRecipe } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type DeckRecipeCardProps = {
  recipe: DeckRecipe;
  onSelect: (recipe: DeckRecipe) => void;
  isSelected?: boolean;
  isLoading?: boolean;
  isLoadingThisRecipe?: boolean;
  /** Screen size for fixed sizing. If not provided, responsive classes will be used */
  screenSize?: ScreenSize;
  /** Whether to show tags. Default is false */
  showTags?: boolean;
};

export function DeckRecipeCard({
  recipe,
  onSelect,
  isSelected = false,
  isLoading = false,
  isLoadingThisRecipe = false,
  screenSize,
  showTags = false,
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

  const sizeStyles = screenSize
    ? {
        smartphone: {
          padding: 'p-2',
          title: {
            size: 'text-lg',
            margin: 'mb-1',
          },
          description: {
            size: 'text-xs',
            margin: 'mb-1',
          },
          label: {
            size: 'text-xs',
          },
          content: {
            size: 'text-xs',
          },
        },
        tablet: {
          padding: 'p-4',
          title: {
            size: 'text-xl',
            margin: 'mb-2',
          },
          description: {
            size: 'text-sm',
            margin: 'mb-2',
          },
          label: {
            size: 'text-sm',
          },
          content: {
            size: 'text-sm',
          },
        },
        pc: {
          padding: 'p-6',
          title: {
            size: 'text-2xl',
            margin: 'mb-3',
          },
          description: {
            size: 'text-sm',
            margin: 'mb-3',
          },
          label: {
            size: 'text-sm',
          },
          content: {
            size: 'text-sm',
          },
        },
      }[screenSize]
    : {
        padding: 'p-4 md:p-6 lg:p-8',
        title: {
          size: 'text-lg md:text-xl lg:text-2xl',
          margin: 'mb-1 md:mb-2 lg:mb-3',
        },
        description: {
          size: 'text-xs md:text-sm',
          margin: 'mb-1 md:mb-2 lg:mb-3',
        },
        label: {
          size: 'text-xs md:text-sm',
        },
        content: {
          size: 'text-xs md:text-sm',
        },
      };

  return (
    <Button
      onClick={() => onSelect(recipe)}
      disabled={isLoading}
      variant={isSelected ? 'default' : 'outline'}
      className={`group relative h-auto overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${sizeStyles.padding} ${baseClass}`}
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
        <h2
          className={`font-bold wrap-break-word whitespace-normal ${sizeStyles.title.size} ${sizeStyles.title.margin} ${textClass.title}`}
        >
          {recipe.title}
        </h2>

        {recipe.description && (
          <p
            className={`wrap-break-word whitespace-normal ${sizeStyles.description.size} ${sizeStyles.description.margin} ${textClass.description}`}
          >
            {recipe.description}
          </p>
        )}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <div className="my-2 space-y-1">
            <div
              className={`font-semibold ${sizeStyles.label.size} ${textClass.label}`}
            >
              API Parameters:
            </div>
            <div
              className={`space-y-0.5 ${sizeStyles.content.size} ${textClass.content}`}
            >
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

        {showTags && (
          <div className="flex flex-wrap items-center gap-1">
            {/* <Badge
              variant="outline"
              className={getDifficultyBadgeClass(recipe.difficulty, isSelected)}
            >
              {recipe.difficulty}
            </Badge> */}
            {recipe.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={
                  isSelected ? 'bg-white/20 text-white hover:bg-white/30' : ''
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Button>
  );
}
