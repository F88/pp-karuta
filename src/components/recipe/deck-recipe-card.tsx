import type { DeckRecipe } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSelectableCardClasses, getResponsiveStyles } from '@/lib/ui-utils';

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
  const styles = getSelectableCardClasses(isSelected);

  const sizeStyles = getResponsiveStyles(screenSize, {
    smartphone: {
      padding: 'p-2',
      title: {
        size: 'text-base',
      },
      description: {
        size: 'text-xs',
      },
      label: {
        size: 'text-xs',
      },
      content: {
        size: 'text-xs',
      },
    },
    tablet: {
      padding: 'p-3',
      title: {
        size: 'text-lg',
      },
      description: {
        size: 'text-sm',
      },
      label: {
        size: 'text-sm',
      },
      content: {
        size: 'text-sm',
      },
    },
    pc: {
      padding: 'p-4',
      title: {
        size: 'text-xl',
      },
      description: {
        size: 'text-sm',
      },
      label: {
        size: 'text-sm',
      },
      content: {
        size: 'text-sm',
      },
    },
    responsive: {
      padding: 'p-4 md:p-6 lg:p-8',
      title: {
        size: 'text-lg md:text-xl lg:text-2xl',
      },
      description: {
        size: 'text-xs md:text-sm',
      },
      label: {
        size: 'text-xs md:text-sm',
      },
      content: {
        size: 'text-xs md:text-sm',
      },
    },
  });

  return (
    <Button
      onClick={() => onSelect(recipe)}
      disabled={isLoading}
      variant={isSelected ? 'default' : 'outline'}
      className={`group relative h-full overflow-hidden rounded-lg shadow-lg ${styles.animation} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${sizeStyles.padding} ${styles.base}`}
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
      <div className={styles.gradient} />
      <div className="relative">
        <h2
          className={`font-bold wrap-break-word whitespace-normal ${sizeStyles.title.size} ${styles.title}`}
        >
          {recipe.title}
        </h2>

        {recipe.description && (
          <p
            className={`wrap-break-word whitespace-normal ${sizeStyles.description.size} ${styles.description}`}
          >
            {recipe.description}
          </p>
        )}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <div className="my-2 space-y-1">
            <div
              className={`font-semibold ${sizeStyles.label.size} ${styles.label}`}
            >
              API Parameters:
            </div>
            <div
              className={`space-y-0.5 ${sizeStyles.content.size} ${styles.content}`}
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
