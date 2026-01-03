import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionWrapper } from './section-wrapper';

const meta = {
  title: 'Selector/SectionWrapper',
  component: SectionWrapper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div className="space-y-2">
    <p className="text-gray-700 dark:text-gray-300">
      This is sample content inside the section wrapper.
    </p>
    <p className="text-gray-700 dark:text-gray-300">
      The wrapper provides a bordered container with a floating title.
    </p>
  </div>
);

export const Primary: Story = {
  args: {
    title: '入力方式',
    variant: 'primary',
    children: <SampleContent />,
  },
};

export const Secondary: Story = {
  args: {
    title: '札数',
    variant: 'secondary',
    children: <SampleContent />,
  },
};

export const Success: Story = {
  args: {
    title: 'プレイヤー',
    variant: 'success',
    children: <SampleContent />,
  },
};

export const Warning: Story = {
  args: {
    title: '畳サイズ',
    variant: 'warning',
    children: <SampleContent />,
  },
};

export const Danger: Story = {
  args: {
    title: 'デッキ',
    variant: 'danger',
    children: <SampleContent />,
  },
};

// Screen size variants
export const ScreenSizeSmartphone: Story = {
  args: {
    title: 'Smartphone Size',
    variant: 'primary',
    screenSize: 'smartphone',
    children: <SampleContent />,
  },
};

export const ScreenSizeTablet: Story = {
  args: {
    title: 'Tablet Size',
    variant: 'primary',
    screenSize: 'tablet',
    children: <SampleContent />,
  },
};

export const ScreenSizePC: Story = {
  args: {
    title: 'PC Size',
    variant: 'primary',
    screenSize: 'pc',
    children: <SampleContent />,
  },
};

export const ScreenSizeComparison: Story = {
  args: {
    title: 'Comparison',
    children: <SampleContent />,
  },
  render: () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Smartphone
          </h3>
          <SectionWrapper
            title="Smartphone Size"
            variant="primary"
            screenSize="smartphone"
          >
            <SampleContent />
          </SectionWrapper>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Tablet</h3>
          <SectionWrapper
            title="Tablet Size"
            variant="success"
            screenSize="tablet"
          >
            <SampleContent />
          </SectionWrapper>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">PC</h3>
          <SectionWrapper title="PC Size" variant="warning" screenSize="pc">
            <SampleContent />
          </SectionWrapper>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Responsive (Default)
          </h3>
          <SectionWrapper title="Responsive Size" variant="danger">
            <SampleContent />
          </SectionWrapper>
        </div>
      </div>
    );
  },
};

export const AllVariants: Story = {
  args: {
    title: 'All Variants',
    children: <SampleContent />,
  },
  render: () => {
    return (
      <div className="space-y-6">
        <SectionWrapper title="Primary" variant="primary">
          <SampleContent />
        </SectionWrapper>
        <SectionWrapper title="Secondary" variant="secondary">
          <SampleContent />
        </SectionWrapper>
        <SectionWrapper title="Success" variant="success">
          <SampleContent />
        </SectionWrapper>
        <SectionWrapper title="Warning" variant="warning">
          <SampleContent />
        </SectionWrapper>
        <SectionWrapper title="Danger" variant="danger">
          <SampleContent />
        </SectionWrapper>
      </div>
    );
  },
};
