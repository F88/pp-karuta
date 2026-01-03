import type { Meta, StoryObj } from '@storybook/react-vite';
import type { StackRecipe } from '@/models/karuta';
import { StackRecipeCard } from './stack-recipe-card';

const meta = {
  title: 'Recipe/StackRecipeCard',
  component: StackRecipeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StackRecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const randomRecipe: StackRecipe = {
  id: 'random-50',
  title: 'ランダム50枚',
  description: 'デッキからランダムに50枚を選択',
  difficulty: 'beginner',
  maxSize: 50,
  sortMethod: 'random',
  tags: ['random', 'medium'],
};

const allCardsRecipe: StackRecipe = {
  id: 'all-cards',
  title: '全ての札',
  description: 'デッキの全ての札を使用',
  difficulty: 'advanced',
  maxSize: 'all',
  sortMethod: 'random',
  tags: ['all', 'complete'],
};

const sortedRecipe: StackRecipe = {
  id: 'sorted-25',
  title: 'ID順25枚',
  description: 'ID昇順で最初の25枚',
  difficulty: 'beginner',
  maxSize: 25,
  sortMethod: 'id-asc',
  tags: ['sorted', 'small'],
};

export const Default: Story = {
  args: {
    recipe: randomRecipe,
    onSelect: () => {},
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    recipe: randomRecipe,
    onSelect: () => {},
    isSelected: true,
  },
};

export const AllCards: Story = {
  args: {
    recipe: allCardsRecipe,
    onSelect: () => {},
    isSelected: false,
  },
};

export const AllCardsSelected: Story = {
  args: {
    recipe: allCardsRecipe,
    onSelect: () => {},
    isSelected: true,
  },
};

export const Sorted: Story = {
  args: {
    recipe: sortedRecipe,
    onSelect: () => {},
    isSelected: false,
  },
};

export const Loading: Story = {
  args: {
    recipe: randomRecipe,
    onSelect: () => {},
    isSelected: true,
    isLoading: true,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    recipe: randomRecipe,
    onSelect: () => {},
    isSelected: false,
    screenSize: 'smartphone',
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    recipe: randomRecipe,
    onSelect: () => {},
    isSelected: false,
    screenSize: 'tablet',
  },
};

export const ScreenSizePC: Story = {
  args: {
    recipe: randomRecipe,
    onSelect: () => {},
    isSelected: false,
    screenSize: 'pc',
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    recipe: randomRecipe,
    onSelect: () => {},
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <StackRecipeCard
            recipe={randomRecipe}
            onSelect={() => {}}
            isSelected={false}
            screenSize="smartphone"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <StackRecipeCard
            recipe={randomRecipe}
            onSelect={() => {}}
            isSelected={false}
            screenSize="tablet"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <StackRecipeCard
            recipe={randomRecipe}
            onSelect={() => {}}
            isSelected={false}
            screenSize="pc"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <StackRecipeCard
            recipe={randomRecipe}
            onSelect={() => {}}
            isSelected={false}
          />
        </div>
      </div>
    );
  },
};
