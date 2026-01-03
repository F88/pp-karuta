import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Deck } from '@/models/karuta';
import { DeckRecipeSelector } from './deck-recipe-selector';
import { DeckRecipeManager, generateDummyPrototypes } from '@/lib/karuta';

const meta = {
  title: 'Selector/DeckRecipeSelector',
  component: DeckRecipeSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DeckRecipeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePrototypes = generateDummyPrototypes(100);

const sampleDeck: Deck = new Map(
  samplePrototypes.map((proto) => [proto.id, proto]),
);

export const Default: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: null,
    onSelectDeckRecipe: () => {},
    isDeckLoading: false,
    loadingDeckRecipeId: null,
    generatedDeck: null,
  },
};

export const WithSelectedRecipe: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: DeckRecipeManager.RECIPES[0],
    onSelectDeckRecipe: () => {},
    isDeckLoading: false,
    loadingDeckRecipeId: null,
    generatedDeck: null,
  },
};

export const Loading: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: DeckRecipeManager.RECIPES[0],
    onSelectDeckRecipe: () => {},
    isDeckLoading: true,
    loadingDeckRecipeId: DeckRecipeManager.RECIPES[0].id,
    generatedDeck: null,
  },
};

export const WithGeneratedDeck: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: DeckRecipeManager.RECIPES[0],
    onSelectDeckRecipe: () => {},
    isDeckLoading: false,
    loadingDeckRecipeId: null,
    generatedDeck: sampleDeck,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: DeckRecipeManager.RECIPES[0],
    onSelectDeckRecipe: () => {},
    isDeckLoading: false,
    loadingDeckRecipeId: null,
    generatedDeck: null,
    screenSize: 'smartphone',
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: DeckRecipeManager.RECIPES[0],
    onSelectDeckRecipe: () => {},
    isDeckLoading: false,
    loadingDeckRecipeId: null,
    generatedDeck: null,
    screenSize: 'tablet',
  },
};

export const ScreenSizePC: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: DeckRecipeManager.RECIPES[0],
    onSelectDeckRecipe: () => {},
    isDeckLoading: false,
    loadingDeckRecipeId: null,
    generatedDeck: null,
    screenSize: 'pc',
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    deckRecipes: DeckRecipeManager.RECIPES.slice(0, 4),
    selectedDeckRecipe: DeckRecipeManager.RECIPES[0],
    onSelectDeckRecipe: () => {},
    isDeckLoading: false,
    loadingDeckRecipeId: null,
    generatedDeck: null,
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <DeckRecipeSelector
            deckRecipes={DeckRecipeManager.RECIPES.slice(0, 4)}
            selectedDeckRecipe={DeckRecipeManager.RECIPES[0]}
            onSelectDeckRecipe={() => {}}
            isDeckLoading={false}
            loadingDeckRecipeId={null}
            generatedDeck={null}
            screenSize="smartphone"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <DeckRecipeSelector
            deckRecipes={DeckRecipeManager.RECIPES.slice(0, 4)}
            selectedDeckRecipe={DeckRecipeManager.RECIPES[0]}
            onSelectDeckRecipe={() => {}}
            isDeckLoading={false}
            loadingDeckRecipeId={null}
            generatedDeck={null}
            screenSize="tablet"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <DeckRecipeSelector
            deckRecipes={DeckRecipeManager.RECIPES.slice(0, 4)}
            selectedDeckRecipe={DeckRecipeManager.RECIPES[0]}
            onSelectDeckRecipe={() => {}}
            isDeckLoading={false}
            loadingDeckRecipeId={null}
            generatedDeck={null}
            screenSize="pc"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <DeckRecipeSelector
            deckRecipes={DeckRecipeManager.RECIPES.slice(0, 4)}
            selectedDeckRecipe={DeckRecipeManager.RECIPES[0]}
            onSelectDeckRecipe={() => {}}
            isDeckLoading={false}
            loadingDeckRecipeId={null}
            generatedDeck={null}
          />
        </div>
      </div>
    );
  },
};
