import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToriFudaCardTouch } from './tori-fuda-card-touch';
import type { NormalizedPrototype } from '@f88/promidas/types';

const meta = {
  title: 'Game/ToriFudaCardTouch',
  component: ToriFudaCardTouch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToriFudaCardTouch>;

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
    showImage: true,
    screenSize: 'pc',
  },
};

export const Smartphone: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: true,
    screenSize: 'smartphone',
  },
};

export const Tablet: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: true,
    screenSize: 'tablet',
  },
};

export const PC: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: true,
    screenSize: 'pc',
  },
};

export const WithoutImage: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: true,
    showImage: false,
    screenSize: 'pc',
  },
};

export const NotClickable: Story = {
  args: {
    normalizedPrototype: mockCard,
    index: 0,
    isClickable: false,
    showImage: true,
    screenSize: 'pc',
  },
};

export const Grid2Columns: Omit<Story, 'args'> = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-2 gap-3 p-4">
      {[0, 1, 2, 3].map((index) => (
        <ToriFudaCardTouch
          key={index}
          normalizedPrototype={{
            ...mockCard,
            id: index + 1,
            prototypeNm: `Prototype Card ${index + 1}`,
          }}
          index={index}
          isClickable={true}
          showImage={true}
          screenSize="smartphone"
        />
      ))}
    </div>
  ),
};

export const Grid3Columns: Omit<Story, 'args'> = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-3 gap-3 p-4">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <ToriFudaCardTouch
          key={index}
          normalizedPrototype={{
            ...mockCard,
            id: index + 1,
            prototypeNm: `Prototype Card ${index + 1}`,
          }}
          index={index}
          isClickable={true}
          showImage={true}
          screenSize="tablet"
        />
      ))}
    </div>
  ),
};

export const Grid4Columns: Omit<Story, 'args'> = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="grid grid-cols-4 gap-3 p-4">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <ToriFudaCardTouch
          key={index}
          normalizedPrototype={{
            ...mockCard,
            id: index + 1,
            prototypeNm: `Prototype Card ${index + 1}`,
          }}
          index={index}
          isClickable={true}
          showImage={true}
          screenSize="pc"
        />
      ))}
    </div>
  ),
};

export const LongTitle: Story = {
  args: {
    normalizedPrototype: {
      ...mockCard,
      prototypeNm:
        'This is a very long prototype name that should be truncated with ellipsis when displayed',
    },
    index: 0,
    isClickable: true,
    showImage: true,
    screenSize: 'pc',
  },
};

export const ImageError: Story = {
  args: {
    normalizedPrototype: {
      ...mockCard,
      mainUrl: 'https://invalid-url-that-will-fail-to-load.example.com/image.jpg',
    },
    index: 0,
    isClickable: true,
    showImage: true,
    screenSize: 'pc',
  },
};
