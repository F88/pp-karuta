import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerTatami } from './player-tatami';
import type { Player } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';

const mockPlayer: Player = {
  id: 'player-1',
  name: 'Player 1',
};

const mockCards: NormalizedPrototype[] = Array.from({ length: 8 }).map(
  (_, index) => ({
    id: index + 1,
    createDate: '2024-01-01',
    updateDate: '2024-01-01',
    releaseFlg: 1,
    status: 1,
    prototypeNm: `Prototype ${index + 1}`,
    summary: `Summary for prototype ${index + 1}`,
    freeComment: '',
    systemDescription: '',
    users: [],
    teamNm: '',
    tags: [],
    materials: [],
    events: [],
    awards: [],
    mainUrl: 'https://via.placeholder.com/300x200',
    viewCount: 0,
    goodCount: 0,
    commentCount: 0,
  }),
);

const meta = {
  title: 'Tatami/PlayerTatami',
  component: PlayerTatami,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    playerIndex: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Index of the player (0-3)',
    },
    playerCount: {
      control: { type: 'number', min: 1, max: 4 },
      description: 'Total number of players',
    },
    mochiFudaCount: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'Number of mochi-fuda (cards held)',
    },
    score: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Player score',
    },
    playMode: {
      control: 'radio',
      options: ['keyboard', 'touch'],
      description: 'Play mode',
    },
    feedbackState: {
      control: 'radio',
      options: [null, 'correct', 'incorrect'],
      description: 'Visual feedback state',
    },
    screenSize: {
      control: 'radio',
      options: ['smartphone', 'tablet', 'pc'],
      description: 'Screen size for responsive design',
    },
  },
} satisfies Meta<typeof PlayerTatami>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: mockCards,
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 25,
    score: 0,
    playMode: 'touch',
    feedbackState: null,
    screenSize: 'pc',
  },
};

export const KeyboardMode1Player: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 1,
    tatamiCards: mockCards,
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 25,
    score: 5,
    playMode: 'keyboard',
    feedbackState: null,
    screenSize: 'pc',
  },
};

export const KeyboardMode2Players: Story = {
  args: {
    player: { ...mockPlayer, name: 'Player 2' },
    playerIndex: 1,
    playerCount: 2,
    tatamiCards: mockCards,
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 20,
    score: 3,
    playMode: 'keyboard',
    feedbackState: null,
    screenSize: 'pc',
  },
};

export const KeyboardMode3Players: Story = {
  args: {
    player: { ...mockPlayer, name: 'Player 3' },
    playerIndex: 2,
    playerCount: 3,
    tatamiCards: mockCards.slice(0, 8),
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 15,
    score: 7,
    playMode: 'keyboard',
    feedbackState: null,
    screenSize: 'pc',
  },
};

export const KeyboardMode4Players: Story = {
  args: {
    player: { ...mockPlayer, name: 'Player 4' },
    playerIndex: 3,
    playerCount: 4,
    tatamiCards: mockCards.slice(0, 8),
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 10,
    score: 12,
    playMode: 'keyboard',
    feedbackState: null,
    screenSize: 'pc',
  },
};

export const CorrectFeedback: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: mockCards,
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 24,
    score: 1,
    playMode: 'keyboard',
    feedbackState: 'correct',
    screenSize: 'pc',
  },
};

export const IncorrectFeedback: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: mockCards,
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 25,
    score: 0,
    playMode: 'keyboard',
    feedbackState: 'incorrect',
    screenSize: 'pc',
  },
};

export const TouchMode: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: Array.from({ length: 16 }).map((_, index) => ({
      id: index + 1,
      createDate: '2024-01-01',
      updateDate: '2024-01-01',
      releaseFlg: 1,
      status: 1,
      prototypeNm: `Prototype ${index + 1}`,
      summary: `Summary for prototype ${index + 1}`,
      freeComment: '',
      systemDescription: '',
      users: [],
      teamNm: '',
      tags: [],
      materials: [],
      events: [],
      awards: [],
      mainUrl: 'https://via.placeholder.com/300x200',
      viewCount: 0,
      goodCount: 0,
      commentCount: 0,
    })),
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 25,
    score: 0,
    playMode: 'touch',
    feedbackState: null,
    screenSize: 'pc',
  },
};

export const SmartphoneScreen: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: mockCards,
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 25,
    score: 0,
    playMode: 'touch',
    feedbackState: null,
    screenSize: 'smartphone',
  },
};

export const TabletScreen: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: mockCards,
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 25,
    score: 0,
    playMode: 'touch',
    feedbackState: null,
    screenSize: 'tablet',
  },
};

export const HighScore: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: mockCards.slice(0, 4),
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 4,
    score: 21,
    playMode: 'keyboard',
    feedbackState: null,
    screenSize: 'pc',
  },
};

export const EmptyTatami: Story = {
  args: {
    player: mockPlayer,
    playerIndex: 0,
    playerCount: 2,
    tatamiCards: [],
    onCardClick: (card) => console.log('Card clicked:', card),
    mochiFudaCount: 0,
    score: 25,
    playMode: 'keyboard',
    feedbackState: null,
    screenSize: 'pc',
  },
};
