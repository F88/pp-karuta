import { TATAMI_SIZES } from '@/lib/karuta';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TatamiSizeSelector } from './tatami-size-selector';

const meta = {
  title: 'Selector/TatamiSizeSelector',
  component: TatamiSizeSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TatamiSizeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedTatamiSize: 8,
    onSelectTatamiSize: () => {},
    availableSizes: TATAMI_SIZES,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    selectedTatamiSize: 8,
    onSelectTatamiSize: () => {},
    availableSizes: TATAMI_SIZES,
    isLoading: true,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    selectedTatamiSize: 8,
    onSelectTatamiSize: () => {},
    availableSizes: TATAMI_SIZES,
    isLoading: false,
    screenSize: 'smartphone',
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    selectedTatamiSize: 8,
    onSelectTatamiSize: () => {},
    availableSizes: TATAMI_SIZES,
    isLoading: false,
    screenSize: 'tablet',
  },
};

export const ScreenSizePC: Story = {
  args: {
    selectedTatamiSize: 8,
    onSelectTatamiSize: () => {},
    availableSizes: TATAMI_SIZES,
    isLoading: false,
    screenSize: 'pc',
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    selectedTatamiSize: 8,
    onSelectTatamiSize: () => {},
    availableSizes: TATAMI_SIZES,
    isLoading: false,
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <TatamiSizeSelector
            selectedTatamiSize={8}
            onSelectTatamiSize={() => {}}
            availableSizes={TATAMI_SIZES}
            isLoading={false}
            screenSize="smartphone"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <TatamiSizeSelector
            selectedTatamiSize={8}
            onSelectTatamiSize={() => {}}
            availableSizes={TATAMI_SIZES}
            isLoading={false}
            screenSize="tablet"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <TatamiSizeSelector
            selectedTatamiSize={8}
            onSelectTatamiSize={() => {}}
            availableSizes={TATAMI_SIZES}
            isLoading={false}
            screenSize="pc"
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <TatamiSizeSelector
            selectedTatamiSize={8}
            onSelectTatamiSize={() => {}}
            availableSizes={TATAMI_SIZES}
            isLoading={false}
          />
        </div>
      </div>
    );
  },
};
