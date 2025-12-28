import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlayModeSelectorPresentation } from './play-mode-selector-presentation';

const meta = {
  title: 'PlayMode/PlayModeSelectorPresentation',
  component: PlayModeSelectorPresentation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PlayModeSelectorPresentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSelectMode: (mode) => {
      console.log('Selected mode:', mode);
    },
  },
};

export const WithAlert: Story = {
  args: {
    onSelectMode: (mode) => {
      console.log('Selected mode:', mode);
      alert(`Selected mode: ${mode}`);
    },
  },
};
