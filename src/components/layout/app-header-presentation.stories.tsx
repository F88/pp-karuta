import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { AppHeaderPresentation } from './app-header-presentation';
import { RepoStateIndicatorPresentation } from './repo-state-indicator-presentation';

const meta = {
  title: 'Layout/AppHeaderPresentation',
  component: AppHeaderPresentation,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof AppHeaderPresentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    homeButton: <Button variant="ghost">🎴</Button>,
    rulesButton: <Button variant="ghost">📜 掟</Button>,
    playerButton: <Button variant="ghost">👥 プレイヤー</Button>,
    repoStateIndicator: (
      <RepoStateIndicatorPresentation state={{ type: 'not-created' }} />
    ),
    themeToggle: (
      <Button variant="outline" size="icon">
        🌙
      </Button>
    ),
  },
};

export const WithValidToken: Story = {
  args: {
    homeButton: <Button variant="ghost">🎴</Button>,
    rulesButton: <Button variant="ghost">📜 掟</Button>,
    playerButton: <Button variant="ghost">👥 プレイヤー</Button>,
    repoStateIndicator: (
      <RepoStateIndicatorPresentation
        state={{ type: 'created-token-valid', repository: {} as never }}
      />
    ),
    themeToggle: (
      <Button variant="outline" size="icon">
        🌙
      </Button>
    ),
  },
};

export const WithInvalidToken: Story = {
  args: {
    homeButton: <Button variant="ghost">🎴</Button>,
    playerButton: <Button variant="ghost">👥 プレイヤー</Button>,
    rulesButton: <Button variant="ghost">📜 掟</Button>,
    repoStateIndicator: (
      <RepoStateIndicatorPresentation
        state={{ type: 'token-invalid', error: 'Invalid token' }}
      />
    ),
    themeToggle: (
      <Button variant="outline" size="icon">
        🌙
      </Button>
    ),
  },
};

export const AllStates = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold">No Token:</h3>
        <AppHeaderPresentation
          homeButton={<Button variant="ghost">🎴</Button>}
          rulesButton={<Button variant="ghost">📜 掟</Button>}
          playerButton={<Button variant="ghost">👥 プレイヤー</Button>}
          repoStateIndicator={
            <RepoStateIndicatorPresentation state={{ type: 'not-created' }} />
          }
          themeToggle={
            <Button variant="outline" size="icon">
              🌙
            </Button>
          }
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Ready:</h3>
        <AppHeaderPresentation
          homeButton={<Button variant="ghost">🎴</Button>}
          rulesButton={<Button variant="ghost">📜 掟</Button>}
          playerButton={<Button variant="ghost">👥 プレイヤー</Button>}
          repoStateIndicator={
            <RepoStateIndicatorPresentation
              state={{ type: 'created-token-valid', repository: {} as never }}
            />
          }
          themeToggle={
            <Button variant="outline" size="icon">
              🌙
            </Button>
          }
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Invalid:</h3>
        <AppHeaderPresentation
          homeButton={<Button variant="ghost">🎴</Button>}
          rulesButton={<Button variant="ghost">📜 掟</Button>}
          playerButton={<Button variant="ghost">👥 プレイヤー</Button>}
          repoStateIndicator={
            <RepoStateIndicatorPresentation
              state={{ type: 'token-invalid', error: 'Invalid token' }}
            />
          }
          themeToggle={
            <Button variant="outline" size="icon">
              🌙
            </Button>
          }
        />
      </div>
    </div>
  ),
};
