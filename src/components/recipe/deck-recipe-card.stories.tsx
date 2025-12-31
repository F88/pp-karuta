import type { Meta, StoryObj } from '@storybook/react-vite';
import type { DeckRecipe } from '@/models/karuta';
import { DeckRecipeCard } from './deck-recipe-card';

const meta = {
  title: 'Recipe/DeckRecipeCard',
  component: DeckRecipeCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeckRecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRecipe: DeckRecipe = {
  id: 'all-prototypes',
  title: '全てのプロトタイプ',
  description: 'ProtoPediaに登録されている全てのプロトタイプを使用',
  difficulty: 'beginner',
  tags: ['all', 'simple'],
  apiParams: {
    limit: 1000,
  },
};

const advancedRecipe: DeckRecipe = {
  id: 'iot-devices',
  title: 'IoTデバイス',
  description: 'IoTタグが付いたプロトタイプのみ',
  difficulty: 'advanced',
  tags: ['iot', 'hardware'],
  apiParams: {
    limit: 500,
    tagNm: 'IoT',
  },
};

export const Default: Story = {
  args: {
    recipe: sampleRecipe,
    onSelect: () => {},
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    recipe: sampleRecipe,
    onSelect: () => {},
    isSelected: true,
  },
};

export const Loading: Story = {
  args: {
    recipe: sampleRecipe,
    onSelect: () => {},
    isSelected: true,
    isLoading: true,
    isLoadingThisRecipe: true,
  },
};

export const Advanced: Story = {
  args: {
    recipe: advancedRecipe,
    onSelect: () => {},
    isSelected: false,
  },
};

export const AdvancedSelected: Story = {
  args: {
    recipe: advancedRecipe,
    onSelect: () => {},
    isSelected: true,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    recipe: sampleRecipe,
    onSelect: () => {},
    isSelected: false,
    screenSize: 'smartphone',
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    recipe: sampleRecipe,
    onSelect: () => {},
    isSelected: false,
    screenSize: 'tablet',
  },
};

export const ScreenSizePC: Story = {
  args: {
    recipe: sampleRecipe,
    onSelect: () => {},
    isSelected: false,
    screenSize: 'pc',
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    recipe: sampleRecipe,
    onSelect: () => {},
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <DeckRecipeCard
            recipe={sampleRecipe}
            onSelect={() => {}}
            isSelected={false}
            screenSize="smartphone"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <DeckRecipeCard
            recipe={sampleRecipe}
            onSelect={() => {}}
            isSelected={false}
            screenSize="tablet"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <DeckRecipeCard
            recipe={sampleRecipe}
            onSelect={() => {}}
            isSelected={false}
            screenSize="pc"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <DeckRecipeCard
            recipe={sampleRecipe}
            onSelect={() => {}}
            isSelected={false}
          />
        </div>
      </div>
    );
  },
};
