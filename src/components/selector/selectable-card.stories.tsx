import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectableCard } from './selectable-card';
import { Smartphone, Keyboard } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Selector/SelectableCard',
  component: SelectableCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    label: 'Option 1',
  },
};

export const Selected: Story = {
  args: {
    isSelected: true,
    onClick: () => {},
    label: 'Option 1',
  },
};

export const WithIcon: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    icon: <Smartphone className="h-6 w-6" />,
    label: 'タッチ',
  },
};

export const WithIconSelected: Story = {
  args: {
    isSelected: true,
    onClick: () => {},
    icon: <Keyboard className="h-6 w-6" />,
    label: 'キーボード',
  },
};

export const WithEmojiIcon: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    icon: '👤',
    label: 'プレイヤー1',
  },
};

export const WithEmojiIconSelected: Story = {
  args: {
    isSelected: true,
    onClick: () => {},
    icon: '✓',
    label: 'プレイヤー1',
  },
};

export const AlignmentStart: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    icon: '👤',
    label: 'プレイヤー1',
    alignment: 'start',
  },
};

export const AlignmentCenter: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    icon: <Smartphone className="h-6 w-6" />,
    label: 'タッチ',
    alignment: 'center',
  },
};

export const NoIcon: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    label: '25',
  },
};

export const NoIconSelected: Story = {
  args: {
    isSelected: true,
    onClick: () => {},
    label: '50',
  },
};

export const Disabled: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    disabled: true,
    icon: '👤',
    label: 'Disabled',
  },
};

export const Interactive: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    label: '',
  },
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <div className="grid w-96 grid-cols-2 gap-4">
        <SelectableCard
          isSelected={selected === 'touch'}
          onClick={() => setSelected('touch')}
          icon={<Smartphone className="h-6 w-6" />}
          label="タッチ"
        />
        <SelectableCard
          isSelected={selected === 'keyboard'}
          onClick={() => setSelected('keyboard')}
          icon={<Keyboard className="h-6 w-6" />}
          label="キーボード"
        />
      </div>
    );
  },
};

export const PlayersGrid: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    label: '',
  },
  render: () => {
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

    const togglePlayer = (id: string) => {
      setSelectedPlayers((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
      );
    };

    return (
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
        {['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'].map(
          (name, i) => {
            const id = `player-${i + 1}`;
            const isSelected = selectedPlayers.includes(id);
            return (
              <SelectableCard
                key={id}
                isSelected={isSelected}
                onClick={() => togglePlayer(id)}
                icon={isSelected ? '✓' : '👤'}
                label={name}
                alignment="start"
              />
            );
          },
        )}
        <SelectableCard
          isSelected={false}
          onClick={() => alert('Add player')}
          icon={<span className="text-4xl text-gray-400">+</span>}
          label=""
          alignment="start"
        />
      </div>
    );
  },
};

export const TatamiSizes: Story = {
  args: {
    isSelected: false,
    onClick: () => {},
    label: '',
  },
  render: () => {
    const [selected, setSelected] = useState<number | null>(null);
    const sizes = [25, 50, 75, 100];

    return (
      <div className="grid w-full max-w-2xl grid-cols-4 gap-4">
        {sizes.map((size) => (
          <SelectableCard
            key={size}
            isSelected={selected === size}
            onClick={() => setSelected(size)}
            label={<span className="text-2xl font-bold">{size}</span>}
          />
        ))}
      </div>
    );
  },
};
