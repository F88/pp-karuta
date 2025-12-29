import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerCard } from './player-card';

const meta = {
  title: 'Player/PlayerCard',
  component: PlayerCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    player: { id: '1', name: 'プレイヤー1' },
  },
};

export const LongName: Story = {
  args: {
    player: { id: '1', name: 'とても長いプレイヤー名前です' },
  },
};

export const LongId: Story = {
  args: {
    player: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'プレイヤー1',
    },
  },
};

export const MultipleCards: Story = {
  args: {
    player: { id: '1', name: 'Player 1' },
  },
  render: () => (
    <div className="flex flex-col gap-3" style={{ width: '300px' }}>
      <PlayerCard player={{ id: '1', name: 'プレイヤー1' }} />
      <PlayerCard player={{ id: '2', name: 'プレイヤー2' }} />
      <PlayerCard player={{ id: '3', name: 'プレイヤー3' }} />
      <PlayerCard player={{ id: '4', name: 'プレイヤー4' }} />
    </div>
  ),
};
