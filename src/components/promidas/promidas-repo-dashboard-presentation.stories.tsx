import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromidasRepoDashboardPresentation } from './promidas-repo-dashboard-presentation';

const meta = {
  title: 'Promidas/PromidasRepoDashboardPresentation',
  component: PromidasRepoDashboardPresentation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    repoState: {
      control: 'select',
      options: ['not-created', 'created-token-valid', 'token-invalid'],
    },
    repoError: { control: 'text' },
    storeState: {
      control: 'select',
      options: ['not-stored', 'stored', 'expired'],
    },
    useDummyData: { control: 'boolean' },
  },
} satisfies Meta<typeof PromidasRepoDashboardPresentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DummyMode: Story = {
  args: {
    screenSize: 'pc',
    repoState: { type: 'not-created' },
    repoError: null,
    storeState: 'not-stored',
    storeStats: null,
    useDummyData: true,
  },
};

export const NotCreated: Story = {
  args: {
    screenSize: 'pc',
    repoState: { type: 'not-created' },
    repoError: null,
    storeState: 'not-stored',
    storeStats: null,
    useDummyData: false,
  },
};

export const TokenInvalid: Story = {
  args: {
    screenSize: 'pc',
    repoState: {
      type: 'token-invalid',
      error: 'Invalid token',
    },
    repoError: 'Invalid token',
    storeState: 'not-stored',
    storeStats: null,
    useDummyData: false,
  },
};

export const ValidWithNotStored: Story = {
  args: {
    screenSize: 'pc',
    repoState: { type: 'not-created' },
    repoError: null,
    storeState: 'not-stored',
    storeStats: null,
    useDummyData: false,
  },
};

export const ValidWithStored: Story = {
  args: {
    screenSize: 'pc',
    repoState: { type: 'not-created' },
    repoError: null,
    storeState: 'stored',
    storeStats: {
      size: 42,
      cachedAt: new Date(Date.now() - 60000),
      remainingTtlMs: 3540000,
      dataSizeBytes: 512000,
      isExpired: false,
      refreshInFlight: false,
    },
    useDummyData: false,
  },
};

export const ValidWithExpired: Story = {
  args: {
    screenSize: 'pc',
    repoState: { type: 'not-created' },
    repoError: null,
    storeState: 'expired',
    storeStats: {
      size: 42,
      cachedAt: new Date(Date.now() - 3660000),
      remainingTtlMs: 0,
      dataSizeBytes: 512000,
      isExpired: true,
      refreshInFlight: false,
    },
    useDummyData: false,
  },
};

export const LargeDataset: Story = {
  args: {
    screenSize: 'pc',
    repoState: { type: 'not-created' },
    repoError: null,
    storeState: 'stored',
    storeStats: {
      size: 1234,
      cachedAt: new Date(Date.now() - 1800000),
      remainingTtlMs: 1800000,
      dataSizeBytes: 5242880,
      isExpired: false,
      refreshInFlight: false,
    },
    useDummyData: false,
  },
};

export const ShortRemainingTime: Story = {
  args: {
    screenSize: 'pc',
    repoState: { type: 'not-created' },
    repoError: null,
    storeState: 'stored',
    storeStats: {
      size: 42,
      cachedAt: new Date(Date.now() - 3540000),
      remainingTtlMs: 60000,
      dataSizeBytes: 256000,
      isExpired: false,
      refreshInFlight: false,
    },
    useDummyData: false,
  },
};
