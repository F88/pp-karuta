import type { NormalizedPrototype } from '@f88/promidas/types';
import type { ScreenSize } from '@/types/screen-size';
import { useTypewriter } from '@/hooks/use-typewriter';

export type YomiteProps = {
  normalizedPrototype: NormalizedPrototype;
  screenSize?: ScreenSize;
};

export function Yomite({ normalizedPrototype, screenSize }: YomiteProps) {
  const seq =
    '📜' +
    (normalizedPrototype.prototypeNm ?? 'NO NAME') +
    ' - ' +
    (normalizedPrototype.summary || 'No description');

  const { displayedText } = useTypewriter({ text: seq, speed: 200 });

  const textSizeClass = screenSize
    ? {
        smartphone: 'text-base',
        tablet: 'text-xl',
        pc: 'text-2xl',
      }[screenSize]
    : 'text-base md:text-xl lg:text-2xl';

  const paddingClass = screenSize
    ? {
        smartphone: 'px-3 py-2',
        tablet: 'px-4 py-3',
        pc: 'px-6 py-4',
      }[screenSize]
    : 'px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4';

  return (
    <div
      className={`flex items-center gap-3 rounded-lg bg-indigo-600 shadow-lg ${paddingClass}`}
    >
      <h2
        className={`flex-1 font-bold tracking-widest text-white ${textSizeClass}`}
      >
        {displayedText}
      </h2>
    </div>
  );
}
