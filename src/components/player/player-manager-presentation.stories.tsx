import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayerManagerPresentation } from './player-manager-presentation';

const meta = {
  title: 'Player/PlayerManagerPresentation',
  component: PlayerManagerPresentation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerManagerPresentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    players: [
      { id: '1', name: 'プレイヤー1' },
      { id: '2', name: 'プレイヤー2' },
    ],
    isLoading: false,
    error: null,
    onAddPlayer: () => {},
    onUpdatePlayer: () => {},
    onDeletePlayer: () => {},
  },
};

export const SinglePlayer: Story = {
  args: {
    onAddPlayer: () => {},
    onUpdatePlayer: () => {},
    onDeletePlayer: () => {},
    players: [{ id: '1', name: 'プレイヤー1' }],
    isLoading: false,
    error: null,
  },
};

export const MaxPlayers: Story = {
  args: {
    players: [
      { id: '1', name: 'プレイヤー1' },
      { id: '2', name: 'プレイヤー2' },
      { id: '3', name: 'プレイヤー3' },
      { id: '4', name: 'プレイヤー4' },
    ],
    isLoading: false,
    error: null,
    onAddPlayer: () => {},
    onUpdatePlayer: () => {},
    onDeletePlayer: () => {},
  },
};

export const Loading: Story = {
  args: {
    players: [],
    isLoading: true,
    error: null,
    onAddPlayer: () => {},
    onUpdatePlayer: () => {},
    onDeletePlayer: () => {},
  },
};

export const WithError: Story = {
  args: {
    players: [
      { id: '1', name: 'プレイヤー1' },
      { id: '2', name: 'プレイヤー2' },
    ],
    isLoading: false,
    error: 'プレイヤーの読み込みに失敗しました',
    onAddPlayer: () => {},
    onUpdatePlayer: () => {},
    onDeletePlayer: () => {},
  },
};

export const Empty: Story = {
  args: {
    players: [],
    isLoading: false,
    error: null,
    onAddPlayer: () => {},
    onUpdatePlayer: () => {},
    onDeletePlayer: () => {},
  },
};
