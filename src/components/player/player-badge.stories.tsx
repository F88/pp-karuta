import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerBadge } from './player-badge';

const meta = {
  title: 'Player/PlayerBadge',
  component: PlayerBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    player: { id: '1', name: 'プレイヤー1' },
  },
};

export const Compact: Story = {
  args: {
    player: { id: '1', name: 'プレイヤー1' },
    variant: 'compact',
  },
};

export const LongName: Story = {
  args: {
    player: { id: '1', name: 'とても長いプレイヤー名前です' },
  },
};

export const MultipleBadges: Story = {
  args: {
    player: { id: '1', name: 'Player 1' },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PlayerBadge player={{ id: '1', name: 'プレイヤー1' }} />
      <PlayerBadge player={{ id: '2', name: 'プレイヤー2' }} />
      <PlayerBadge player={{ id: '3', name: 'プレイヤー3' }} />
      <PlayerBadge player={{ id: '4', name: 'プレイヤー4' }} />
    </div>
  ),
};

export const CompactMultiple: Story = {
  args: {
    player: { id: '1', name: 'Player 1' },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PlayerBadge
        player={{ id: '1', name: 'プレイヤー1' }}
        variant="compact"
      />
      <PlayerBadge
        player={{ id: '2', name: 'プレイヤー2' }}
        variant="compact"
      />
      <PlayerBadge
        player={{ id: '3', name: 'プレイヤー3' }}
        variant="compact"
      />
      <PlayerBadge
        player={{ id: '4', name: 'プレイヤー4' }}
        variant="compact"
      />
    </div>
  ),
};
