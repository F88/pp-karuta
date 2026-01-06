import type { StackRecipe } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSelectableCardClasses, getResponsiveStyles } from '@/lib/ui-utils';

export type StackRecipeCardProps = {
  recipe: StackRecipe;
  onSelect: (recipe: StackRecipe) => void;
  isSelected?: boolean;
  isLoading?: boolean;
  /** Screen size for fixed sizing. If not provided, responsive classes will be used */
  screenSize?: ScreenSize;
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
  const styles = getSelectableCardClasses(isSelected);

  const sizeStyles = getResponsiveStyles(screenSize, {
    smartphone: {
      padding: 'p-2',
      title: {
        size: 'text-sm',
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
      padding: 'p-2',
      title: {
        size: 'text-base',
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
      padding: 'p-2',
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
      padding: 'p-4 md:p-5 lg:p-6',
      title: {
        size: 'text-base md:text-lg lg:text-xl',
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
      <div className={styles.gradient} />
      <div className="relative">
        <h3
          className={`my-0 font-bold ${sizeStyles.title.size} ${styles.title}`}
        >
          {recipe.title}
        </h3>
        {/* {recipe.description && (
          <p
            className={`my-0 ${sizeStyles.description.size} ${styles.description}`}
          >
            {recipe.description}
          </p>
        )} */}

        {import.meta.env.VITE_DEBUG_MODE === 'true' && (
          <div className="my-2 space-y-1">
            <div className={`${sizeStyles.content.size} ${styles.content}`}>
              <span className="font-medium">Size:</span>{' '}
              {recipe.maxSize === 'all'
                ? 'All cards'
                : `${recipe.maxSize} cards`}
            </div>
            <div className={`${sizeStyles.content.size} ${styles.content}`}>
              <span className="font-medium">Order:</span>{' '}
              {getSortMethodLabel(recipe.sortMethod)}
            </div>
          </div>
        )}

        {screenSize !== 'smartphone' && (
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
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Button>
  );
}
