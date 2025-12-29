import type { NormalizedPrototype } from '@f88/promidas/types';
import { useTypewriter } from '@/hooks/use-typewriter';

export type YomiteProps = {
  normalizedPrototype: NormalizedPrototype;
};

export function Yomite({ normalizedPrototype }: YomiteProps) {
  const seq =
    '📜' +
    (normalizedPrototype.prototypeNm ?? 'NO NAME') +
    ' - ' +
    (normalizedPrototype.summary || 'No description');

  const { displayedText } = useTypewriter({ text: seq, speed: 200 });

  return (
    <div className="flex items-center gap-3 rounded-lg bg-indigo-600 px-6 py-4 shadow-lg">
      <h2 className="flex-1 text-2xl font-bold tracking-widest text-white">
        {displayedText}
      </h2>
    </div>
  );
}
