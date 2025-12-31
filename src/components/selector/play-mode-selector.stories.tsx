import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayModeSelector } from './play-mode-selector';

const meta = {
  title: 'Selector/PlayModeSelector',
  component: PlayModeSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayModeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedPlayMode: null,
    onSelectPlayMode: () => {},
    isLoading: false,
  },
};

export const TouchSelected: Story = {
  args: {
    selectedPlayMode: 'touch',
    onSelectPlayMode: () => {},
    isLoading: false,
  },
};

export const KeyboardSelected: Story = {
  args: {
    selectedPlayMode: 'keyboard',
    onSelectPlayMode: () => {},
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    selectedPlayMode: 'touch',
    onSelectPlayMode: () => {},
    isLoading: true,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    selectedPlayMode: 'touch',
    onSelectPlayMode: () => {},
    isLoading: false,
    screenSize: 'smartphone',
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    selectedPlayMode: 'touch',
    onSelectPlayMode: () => {},
    isLoading: false,
    screenSize: 'tablet',
  },
};

export const ScreenSizePC: Story = {
  args: {
    selectedPlayMode: 'touch',
    onSelectPlayMode: () => {},
    isLoading: false,
    screenSize: 'pc',
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    selectedPlayMode: 'touch',
    onSelectPlayMode: () => {},
    isLoading: false,
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <PlayModeSelector
            selectedPlayMode="touch"
            onSelectPlayMode={() => {}}
            isLoading={false}
            screenSize="smartphone"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <PlayModeSelector
            selectedPlayMode="touch"
            onSelectPlayMode={() => {}}
            isLoading={false}
            screenSize="tablet"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <PlayModeSelector
            selectedPlayMode="touch"
            onSelectPlayMode={() => {}}
            isLoading={false}
            screenSize="pc"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <PlayModeSelector
            selectedPlayMode="touch"
            onSelectPlayMode={() => {}}
            isLoading={false}
          />
        </div>
      </div>
    );
  },
};
