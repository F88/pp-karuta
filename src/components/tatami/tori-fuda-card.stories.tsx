import type { NormalizedPrototype } from '@f88/promidas/types';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToriFudaCard } from './tori-fuda-card';

const mockCard: NormalizedPrototype = {
  id: 1,
  createDate: '2024-01-01',
  updateDate: '2024-01-01',
  releaseFlg: 1,
  status: 1,
  prototypeNm: 'Test Prototype',
  summary: 'This is a test prototype for demonstration',
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
};

const meta = {
  title: 'Tatami/ToriFudaCard',
  component: ToriFudaCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    index: {
      control: { type: 'number', min: 0, max: 15 },
      description: 'Card index for display',
    },
    isClickable: {
      control: 'boolean',
      description: 'Whether the card can be clicked',
    },
    showImage: {
      control: 'boolean',
      description: 'Whether to show the card image',
    },
    playMode: {
      control: 'radio',
      options: ['keyboard', 'touch'],
      description: 'Play mode affecting the display',
    },
    keyboardKey: {
      control: 'text',
      description: 'Keyboard shortcut key to display',
    },
  },
} satisfies Meta<typeof ToriFudaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: false,
    showImage: true,
    playMode: 'touch',
    screenSize: 'pc',
  },
};

export const KeyboardMode: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: false,
    playMode: 'keyboard',
    keyboardKey: '1',
    screenSize: 'pc',
  },
};

export const KeyboardModeWithDifferentKeys: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    screenSize: 'pc',
  },
  render: (args) => (
    <div className="grid grid-cols-4 gap-4">
      {['1', '2', '3', '4', 'Q', 'W', 'E', 'R'].map((key, index) => (
        <ToriFudaCard
          key={key}
          {...args}
          normalizedPrototype={{
            ...mockCard,
            id: index + 1,
            prototypeNm: `Card ${index + 1}`,
          }}
          index={index}
          isClickable={true}
          showImage={false}
          playMode="keyboard"
          keyboardKey={key}
          screenSize="pc"
        />
      ))}
    </div>
  ),
};

export const TouchMode: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: true,
    playMode: 'touch',
    screenSize: 'pc',
  },
};

export const TouchModeGrid: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    screenSize: 'pc',
  },
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ToriFudaCard
          key={index}
          {...args}
          normalizedPrototype={{
            ...mockCard,
            id: index + 1,
            prototypeNm: `Prototype ${index + 1}`,
          }}
          index={index}
          isClickable={true}
          showImage={true}
          playMode="touch"
          screenSize="pc"
        />
      ))}
    </div>
  ),
};

export const NotClickable: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: false,
    showImage: true,
    playMode: 'touch',
    screenSize: 'pc',
  },
};

export const WithoutImage: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: false,
    playMode: 'touch',
    screenSize: 'pc',
  },
};

export const LongText: Story = {
  args: {
    normalizedPrototype: {
      ...mockCard,
      prototypeNm:
        'Very Long Prototype Name That Should Be Truncated When Displayed',
      summary:
        'This is a very long summary text that should also be truncated when displayed in the card to maintain proper layout and spacing',
    },
    index: 0,
    isClickable: true,
    showImage: true,
    playMode: 'touch',
    screenSize: 'pc',
  },
};
