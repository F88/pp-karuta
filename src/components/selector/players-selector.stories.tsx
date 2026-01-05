import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Player } from '@/models/karuta';
import { PlayersSelector } from './players-selector';
import { PlayerManager } from '@/lib/karuta';

const meta = {
  title: 'Selector/PlayersSelector',
  component: PlayersSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayersSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePlayers: Player[] = [
  PlayerManager.createPlayer('player-1', 'Alice'),
  PlayerManager.createPlayer('player-2', 'Bob'),
  PlayerManager.createPlayer('player-3', 'Charlie'),
  PlayerManager.createPlayer('player-4', 'Diana'),
];

export const Default: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: [],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: false,
  },
};

export const WithSelectedPlayers: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: ['player-1', 'player-3'],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: false,
  },
};

export const MaxPlayersReached: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: ['player-1', 'player-2', 'player-3', 'player-4'],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: ['player-1'],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: true,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: ['player-1', 'player-2'],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: false,
    screenSize: 'smartphone',
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: ['player-1', 'player-2'],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: false,
    screenSize: 'tablet',
  },
};

export const ScreenSizePC: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: ['player-1', 'player-2'],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: false,
    screenSize: 'pc',
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    availablePlayers: samplePlayers,
    selectedPlayerIds: ['player-1', 'player-2'],
    onTogglePlayer: () => {},
    onAddPlayer: () => {},
    isLoading: false,
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <PlayersSelector
            availablePlayers={samplePlayers}
            selectedPlayerIds={['player-1', 'player-2']}
            onTogglePlayer={() => {}}
            onAddPlayer={() => {}}
            isLoading={false}
            screenSize="smartphone"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <PlayersSelector
            availablePlayers={samplePlayers}
            selectedPlayerIds={['player-1', 'player-2']}
            onTogglePlayer={() => {}}
            onAddPlayer={() => {}}
            isLoading={false}
            screenSize="tablet"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <PlayersSelector
            availablePlayers={samplePlayers}
            selectedPlayerIds={['player-1', 'player-2']}
            onTogglePlayer={() => {}}
            onAddPlayer={() => {}}
            isLoading={false}
            screenSize="pc"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <PlayersSelector
            availablePlayers={samplePlayers}
            selectedPlayerIds={['player-1', 'player-2']}
            onTogglePlayer={() => {}}
            onAddPlayer={() => {}}
            isLoading={false}
          />
        </div>
      </div>
    );
  },
};
