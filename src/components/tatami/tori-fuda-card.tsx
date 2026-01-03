import type { PlayMode } from '@/lib/karuta';
import type { ScreenSize } from '@/types/screen-size';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { ToriFudaCardKeyboard } from './tori-fuda-card-keyboard';
import { ToriFudaCardTouch } from './tori-fuda-card-touch';

export type ToriFudaCardProps = {
  normalizedPrototype: NormalizedPrototype;
  index: number;
  isClickable?: boolean;
  showImage?: boolean;
  playMode?: PlayMode;
  onClick?: (card: NormalizedPrototype) => void;
  keyboardKey?: string;
  screenSize: ScreenSize;
};

export function ToriFudaCard(props: ToriFudaCardProps) {
  const { playMode } = props;

  if (playMode === 'keyboard') {
    return <ToriFudaCardKeyboard {...props} />;
  }

  return <ToriFudaCardTouch {...props} />;
}
