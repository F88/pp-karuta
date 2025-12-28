import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenManagerPresentation } from './token-manager-presentation';

const meta = {
  title: 'Components/Token/TokenManagerPresentation',
  component: TokenManagerPresentation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    inputValue: { control: 'text' },
    showToken: { control: 'boolean' },
    hasToken: { control: 'boolean' },
    isValidating: { control: 'boolean' },
    useDummyData: { control: 'boolean' },
    repoState: {
      control: 'select',
      options: [
        'not-created',
        'created-token-valid',
        'token-invalid',
        'created-validating',
      ],
      mapping: {
        'not-created': { type: 'not-created' as const },
        'created-token-valid': { type: 'created-token-valid' as const },
        'token-invalid': {
          type: 'token-invalid' as const,
          error: 'Invalid token',
        },
        'created-validating': { type: 'created-validating' as const },
      },
    },
  },
  args: {
    onInputChange: () => {},
    onToggleShowToken: () => {},
    onSave: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof TokenManagerPresentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    inputValue: '',
    showToken: false,
    hasToken: false,
    isValidating: false,
    useDummyData: false,
    repoState: { type: 'not-created' },
  },
};

export const NoToken: Story = {
  args: {
    inputValue: '',
    showToken: false,
    hasToken: false,
    isValidating: false,
    useDummyData: false,
    repoState: { type: 'not-created' },
  },
};

export const TokenInputInProgress: Story = {
  args: {
    inputValue: 'some-partial-token',
    showToken: false,
    hasToken: false,
    isValidating: false,
    useDummyData: false,
    repoState: { type: 'not-created' },
  },
};

export const TokenVisible: Story = {
  args: {
    inputValue: 'my-secret-token-12345',
    showToken: true,
    hasToken: true,
    isValidating: false,
    useDummyData: false,
    repoState: { type: 'not-created' },
  },
};

export const TokenHidden: Story = {
  args: {
    inputValue: 'my-secret-token-12345',
    showToken: false,
    hasToken: true,
    isValidating: false,
    useDummyData: false,
    repoState: { type: 'not-created' },
  },
};

export const Validating: Story = {
  args: {
    inputValue: 'validating-token',
    showToken: false,
    hasToken: true,
    isValidating: true,
    useDummyData: false,
    repoState: { type: 'not-created' },
  },
};

export const ValidToken: Story = {
  args: {
    inputValue: 'valid-token-12345',
    showToken: false,
    hasToken: true,
    isValidating: false,
    useDummyData: false,
    repoState: { type: 'not-created' },
  },
};

export const InvalidToken: Story = {
  args: {
    inputValue: 'invalid-token',
    showToken: false,
    hasToken: true,
    isValidating: false,
    useDummyData: false,
    repoState: { type: 'token-invalid', error: 'Invalid token' },
  },
};

export const DummyMode: Story = {
  args: {
    inputValue: '',
    showToken: false,
    hasToken: false,
    isValidating: false,
    useDummyData: true,
    repoState: { type: 'not-created' },
  },
};

export const DummyModeWithToken: Story = {
  args: {
    inputValue: 'dummy-token',
    showToken: false,
    hasToken: true,
    isValidating: false,
    useDummyData: true,
    repoState: { type: 'not-created' },
  },
};
