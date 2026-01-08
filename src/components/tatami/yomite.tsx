import type { NormalizedPrototype } from '@f88/promidas/types';
import type { ScreenSize } from '@/types/screen-size';
// import { useTypewriter } from '@/hooks/use-typewriter';
import { getResponsiveStyles } from '@/lib/ui-utils';
import { useYomibito } from '@/hooks/use-yomibito';

export type YomiteProps = {
  normalizedPrototype: NormalizedPrototype;
  screenSize?: ScreenSize;
};

export function Yomite({ normalizedPrototype, screenSize }: YomiteProps) {
  const seq =
    // '📜' +
    (normalizedPrototype.prototypeNm ?? 'NO NAME') +
    ' - ' +
    (normalizedPrototype.summary || 'NO DESCRIPTION');

  // const { displayedText } = useTypewriter({ text: seq, speed: 200 });
  const { displayedText: yomibitoText } = useYomibito({
    // text:
    //   'ふるいけやかわずとびこむみずのおと' +
    //   'ほげほげほげげ' +
    //   'ほげほげほげげ' +
    //   'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
    text: seq,
    speed: 200,
    rhythmPause: 1_000,
  });

  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      text: 'text-lg',
      padding: 'px-3 py-2',
    },
    tablet: {
      text: 'text-xl',
      padding: 'px-4 py-3',
    },
    pc: {
      text: 'text-2xl',
      padding: 'px-6 py-4',
    },
    responsive: {
      text: 'text-lg md:text-xl lg:text-2xl',
      padding: 'px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4',
    },
  });

  // Background color options - uncomment one to use
  const backgroundClass = 'bg-primary text-primary-foreground'; // Yellow/Orange theme
  // const backgroundClass = 'bg-secondary text-secondary-foreground'; // Subtle gray theme
  // const backgroundClass = 'bg-accent text-accent-foreground'; // Gray accent theme
  // const backgroundClass = 'bg-muted text-muted-foreground'; // Muted gray theme
  // const backgroundClass = 'bg-card text-card-foreground'; // Card background theme

  return (
    <>
      {/* <div
        className={`${backgroundClass} flex items-center gap-3 rounded-lg shadow-lg ${styles.padding}`}
      >
        <h2 className={`flex-1 font-bold tracking-widest ${styles.text}`}>
          📜 {displayedText || '\u00A0'}
        </h2>
      </div> */}
      {import.meta.env.VITE_DEBUG_MODE === 'true' && (
        <>ID: {normalizedPrototype.id}</>
      )}
      <div
        className={`${backgroundClass} flex items-center gap-3 rounded-lg shadow-lg ${styles.padding}`}
      >
        <h2 className={`flex-1 font-bold tracking-widest ${styles.text}`}>
          {/* 📜 */}
          {'💬' + ' '}
          {/* 🔊 */}
          {/* 🔈  */}
          {/* 🗣️ */}
          {/* 🐱 */}
          {yomibitoText || '\u00A0'}
        </h2>
      </div>
    </>
  );
}
