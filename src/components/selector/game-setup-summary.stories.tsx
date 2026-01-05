import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameSetupSummary } from './game-setup-summary';
import { generateDummyPrototypes } from '@/lib/repository/dummy-data';

const meta = {
  title: 'Selector/GameSetupSummary',
  component: GameSetupSummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-200">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GameSetupSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KeyboardMode: Story = {
  args: {
    selectedPlayMode: 'keyboard',
    selectedDeckRecipe: {
      id: 'deck-1',
      title: 'Deck 1 (1-1000)',
      description: 'ID範囲: 1-1000',
      apiParams: { offset: 0, limit: 1000 },
      difficulty: 'beginner',
      tags: ['range'],
    },
    generatedDeck: new Map(generateDummyPrototypes(3).map((p) => [p.id, p])),
    selectedStackRecipe: {
      id: 'stack-50',
      title: '50枚',
      description: 'ランダムに50枚',
      maxSize: 50,
      sortMethod: 'random',
      tags: ['quick'],
      difficulty: 'beginner',
    },
    stackSize: 50,
    selectedPlayerCount: 2,
    screenSize: 'pc',
  },
};

export const TouchMode: Story = {
  args: {
    selectedPlayMode: 'touch',
    selectedDeckRecipe: {
      id: 'all-prototypes',
      title: '全作品',
      description: '全ての作品',
      apiParams: { offset: 0, limit: 10000 },
      difficulty: 'beginner',
      tags: ['quick', 'practice'],
    },
    generatedDeck: new Map(generateDummyPrototypes(1000).map((p) => [p.id, p])),
    selectedStackRecipe: {
      id: 'stack-100',
      title: '100枚',
      description: 'ランダムに100枚',
      maxSize: 100,
      sortMethod: 'random',
      tags: ['standard'],
      difficulty: 'intermediate',
    },
    stackSize: 100,
    selectedPlayerCount: 4,
    screenSize: 'tablet',
  },
};

export const SmallDeck: Story = {
  args: {
    selectedPlayMode: 'keyboard',
    selectedDeckRecipe: {
      id: 'deck-test',
      title: 'テストDeck',
      description: 'テスト用の小さなDeck',
      apiParams: { offset: 0, limit: 10 },
      difficulty: 'beginner',
      tags: ['test'],
    },
    generatedDeck: new Map(generateDummyPrototypes(10).map((p) => [p.id, p])),
    selectedStackRecipe: {
      id: 'stack-all',
      title: '全て',
      description: 'Deck全体を使用',
      maxSize: 'all',
      sortMethod: 'random',
      tags: ['all'],
      difficulty: 'beginner',
    },
    stackSize: 10,
    selectedPlayerCount: 1,
    screenSize: 'smartphone',
  },
};

export const LargeDeck: Story = {
  args: {
    selectedPlayMode: 'touch',
    selectedDeckRecipe: {
      id: 'deck-10',
      title: 'Deck 10 (9001-10000)',
      description: 'ID範囲: 9001-10000',
      apiParams: { offset: 9000, limit: 1000 },
      difficulty: 'advanced',
      tags: ['range'],
    },
    generatedDeck: new Map(generateDummyPrototypes(5000).map((p) => [p.id, p])),
    selectedStackRecipe: {
      id: 'stack-500',
      title: '500枚',
      description: 'ランダムに500枚',
      maxSize: 500,
      sortMethod: 'random',
      tags: ['large'],
      difficulty: 'advanced',
    },
    stackSize: 500,
    selectedPlayerCount: 8,
    screenSize: 'pc',
  },
};

export const SortedStack: Story = {
  args: {
    selectedPlayMode: 'keyboard',
    selectedDeckRecipe: {
      id: 'deck-2',
      title: 'Deck 2 (1001-2000)',
      description: 'ID範囲: 1001-2000',
      apiParams: { offset: 1000, limit: 1000 },
      difficulty: 'beginner',
      tags: ['range'],
    },
    generatedDeck: new Map(generateDummyPrototypes(1000).map((p) => [p.id, p])),
    selectedStackRecipe: {
      id: 'stack-100-asc',
      title: '100枚 (ID昇順)',
      description: 'ID昇順で100枚',
      maxSize: 100,
      sortMethod: 'id-asc',
      tags: ['sorted'],
      difficulty: 'intermediate',
    },
    stackSize: 100,
    selectedPlayerCount: 3,
    screenSize: 'tablet',
  },
};
