import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Deck } from '@/models/karuta';
import { StackRecipeSelector } from './stack-recipe-selector';
import { StackRecipeManager, generateDummyPrototypes } from '@/lib/karuta';

const meta = {
  title: 'Selector/StackRecipeSelector',
  component: StackRecipeSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StackRecipeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePrototypes = generateDummyPrototypes(100);

const sampleDeck: Deck = new Map(
  samplePrototypes.map((proto) => [proto.id, proto]),
);

const emptyDeck: Deck = new Map();

const sampleStack = Array.from({ length: 25 }, (_, i) => i + 1);

export const Default: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: null,
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: null,
    generatedDeck: sampleDeck,
  },
};

export const WithSelectedRecipe: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: StackRecipeManager.RECIPES[0],
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: null,
    generatedDeck: sampleDeck,
  },
};

export const Loading: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: StackRecipeManager.RECIPES[0],
    onSelectStackRecipe: () => {},
    isLoading: true,
    generatedStack: null,
    generatedDeck: sampleDeck,
  },
};

export const WithGeneratedStack: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: StackRecipeManager.RECIPES[0],
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: sampleStack,
    generatedDeck: sampleDeck,
  },
};

export const EmptyDeck: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: null,
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: null,
    generatedDeck: emptyDeck,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: StackRecipeManager.RECIPES[0],
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: null,
    generatedDeck: sampleDeck,
    screenSize: 'smartphone',
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: StackRecipeManager.RECIPES[0],
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: null,
    generatedDeck: sampleDeck,
    screenSize: 'tablet',
  },
};

export const ScreenSizePC: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: StackRecipeManager.RECIPES[0],
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: null,
    generatedDeck: sampleDeck,
    screenSize: 'pc',
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    stackRecipes: StackRecipeManager.RECIPES,
    selectedStackRecipe: StackRecipeManager.RECIPES[0],
    onSelectStackRecipe: () => {},
    isLoading: false,
    generatedStack: null,
    generatedDeck: sampleDeck,
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <StackRecipeSelector
            stackRecipes={StackRecipeManager.RECIPES}
            selectedStackRecipe={StackRecipeManager.RECIPES[0]}
            onSelectStackRecipe={() => {}}
            isLoading={false}
            generatedStack={null}
            generatedDeck={sampleDeck}
            screenSize="smartphone"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <StackRecipeSelector
            stackRecipes={StackRecipeManager.RECIPES}
            selectedStackRecipe={StackRecipeManager.RECIPES[0]}
            onSelectStackRecipe={() => {}}
            isLoading={false}
            generatedStack={null}
            generatedDeck={sampleDeck}
            screenSize="tablet"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <StackRecipeSelector
            stackRecipes={StackRecipeManager.RECIPES}
            selectedStackRecipe={StackRecipeManager.RECIPES[0]}
            onSelectStackRecipe={() => {}}
            isLoading={false}
            generatedStack={null}
            generatedDeck={sampleDeck}
            screenSize="pc"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <StackRecipeSelector
            stackRecipes={StackRecipeManager.RECIPES}
            selectedStackRecipe={StackRecipeManager.RECIPES[0]}
            onSelectStackRecipe={() => {}}
            isLoading={false}
            generatedStack={null}
            generatedDeck={sampleDeck}
          />
        </div>
      </div>
    );
  },
};
