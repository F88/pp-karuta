import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import { RepoStateIndicatorPresentation } from './repo-state-indicator-presentation';

const meta = {
  title: 'Layout/RepoStateIndicatorPresentation',
  component: RepoStateIndicatorPresentation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RepoStateIndicatorPresentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotCreated: Story = {
  args: {
    state: {
      type: 'not-created',
    },
  },
};

export const Validating: Story = {
  args: {
    state: {
      type: 'validating',
    },
  },
};

export const CreatedTokenValid: Story = {
  args: {
    state: {
      type: 'created-token-valid',
      repository: {} as ProtopediaInMemoryRepository,
    },
  },
};

export const TokenInvalid: Story = {
  args: {
    state: {
      type: 'token-invalid',
      error: 'Invalid authentication token',
    },
  },
};

export const AllStates = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Not Created:</span>
        <RepoStateIndicatorPresentation state={{ type: 'not-created' }} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Validating:</span>
        <RepoStateIndicatorPresentation state={{ type: 'validating' }} />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Valid:</span>
        <RepoStateIndicatorPresentation
          state={{
            type: 'created-token-valid',
            repository: {} as ProtopediaInMemoryRepository,
          }}
        />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Invalid:</span>
        <RepoStateIndicatorPresentation
          state={{ type: 'token-invalid', error: 'Invalid token' }}
        />
      </div>
    </div>
  ),
};
