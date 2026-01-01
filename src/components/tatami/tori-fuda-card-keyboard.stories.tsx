import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToriFudaCardKeyboard } from './tori-fuda-card-keyboard';
import type { NormalizedPrototype } from '@f88/promidas/types';

const meta = {
  title: 'Game/ToriFudaCardKeyboard',
  component: ToriFudaCardKeyboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToriFudaCardKeyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockCard: NormalizedPrototype = {
  id: 1,
  createDate: '2024-01-01',
  updateDate: '2024-01-01',
  releaseFlg: 1,
  status: 1,
  prototypeNm: 'Sample Prototype Card',
  summary: 'This is a sample prototype card for testing purposes',
  freeComment: '',
  systemDescription: '',
  users: [],
  teamNm: '',
  tags: [],
  materials: [],
  events: [],
  awards: [],
  mainUrl: 'https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Sample+Card',
  viewCount: 0,
  goodCount: 0,
  commentCount: 0,
};

export const Default: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: false,
    keyboardKey: 'Q',
    screenSize: 'pc',
  },
};

export const WithImage: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: true,
    keyboardKey: 'W',
    screenSize: 'pc',
  },
};

export const Smartphone: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: false,
    keyboardKey: '1',
    screenSize: 'smartphone',
  },
};

export const SmartphoneWithImage: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: true,
    keyboardKey: '2',
    screenSize: 'smartphone',
  },
};

export const Tablet: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: false,
    keyboardKey: 'E',
    screenSize: 'tablet',
  },
};

export const TabletWithImage: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: true,
    keyboardKey: 'R',
    screenSize: 'tablet',
  },
};

export const NotClickable: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: false,
    showImage: false,
    keyboardKey: 'A',
    screenSize: 'pc',
  },
};

export const DifferentKeys: Omit<Story, 'args'> = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-4 gap-4 p-4">
      <ToriFudaCardKeyboard
        normalizedPrototype={mockCard}
        index={0}
        isClickable={true}
        showImage={false}
        keyboardKey="Q"
        screenSize="pc"
      />
      <ToriFudaCardKeyboard
        normalizedPrototype={mockCard}
        index={1}
        isClickable={true}
        showImage={false}
        keyboardKey="W"
        screenSize="pc"
      />
      <ToriFudaCardKeyboard
        normalizedPrototype={mockCard}
        index={2}
        isClickable={true}
        showImage={false}
        keyboardKey="E"
        screenSize="pc"
      />
      <ToriFudaCardKeyboard
        normalizedPrototype={mockCard}
        index={3}
        isClickable={true}
        showImage={false}
        keyboardKey="R"
        screenSize="pc"
      />
    </div>
  ),
};

export const Grid4x2: Omit<Story, 'args'> = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-4 gap-3 p-4">
      {['Q', 'W', 'E', 'R', '1', '2', '3', '4'].map((key, index) => (
        <ToriFudaCardKeyboard
          key={key}
          normalizedPrototype={mockCard}
          index={index}
          isClickable={true}
          showImage={false}
          keyboardKey={key}
          screenSize="pc"
        />
      ))}
    </div>
  ),
};
