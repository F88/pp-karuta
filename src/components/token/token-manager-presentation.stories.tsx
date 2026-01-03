import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenManagerPresentation } from './token-manager-presentation';

const meta = {
  title: 'Token/TokenManagerPresentation',
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
    screenSize: 'pc',
    inputValue: '',
    showToken: false,
    hasToken: false,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};

export const NoToken: Story = {
  args: {
    screenSize: 'pc',
    inputValue: '',
    showToken: false,
    hasToken: false,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};

export const TokenInputInProgress: Story = {
  args: {
    screenSize: 'pc',
    inputValue: 'some-partial-token',
    showToken: false,
    hasToken: false,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};

export const TokenVisible: Story = {
  args: {
    screenSize: 'pc',
    inputValue: 'my-secret-token-12345',
    showToken: true,
    hasToken: true,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};

export const TokenHidden: Story = {
  args: {
    screenSize: 'pc',
    inputValue: 'my-secret-token-12345',
    showToken: false,
    hasToken: true,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};

export const Validating: Story = {
  args: {
    screenSize: 'pc',
    inputValue: 'validating-token',
    showToken: false,
    hasToken: true,
    isValidating: true,
    repoState: { type: 'not-created' },
  },
};

export const ValidToken: Story = {
  args: {
    screenSize: 'pc',
    inputValue: 'valid-token-12345',
    showToken: false,
    hasToken: true,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};

export const InvalidToken: Story = {
  args: {
    screenSize: 'pc',
    inputValue: 'invalid-token',
    showToken: false,
    hasToken: true,
    isValidating: false,
    repoState: { type: 'token-invalid', error: 'Invalid token' },
  },
};

export const DummyMode: Story = {
  args: {
    screenSize: 'pc',
    inputValue: '',
    showToken: false,
    hasToken: false,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};

export const DummyModeWithToken: Story = {
  args: {
    screenSize: 'pc',
    inputValue: 'dummy-token',
    showToken: false,
    hasToken: true,
    isValidating: false,
    repoState: { type: 'not-created' },
  },
};
