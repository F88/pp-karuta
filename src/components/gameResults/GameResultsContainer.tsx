import { useCallback } from 'react';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { getPrototypesByIds } from '@/lib/karuta';
import { GameResultsPresentation } from './GameResultsPresentation';

export type GameResultsContainerProps = {
  deck: Map<number, NormalizedPrototype>;
  score: number;
  mochiFuda: number[];
  onBackToTop: () => void;
  onReplay: () => void;
};

export function GameResultsContainer({
  deck,
  score,
  mochiFuda,
  onBackToTop,
  onReplay,
}: GameResultsContainerProps) {
  const mochiFudaCards = getPrototypesByIds(deck, mochiFuda);

  const handleBackToTop = useCallback(() => {
    console.log('🏠 Back to TOP');
    onBackToTop();
  }, [onBackToTop]);

  const handleReplay = useCallback(() => {
    console.log('🔄 Replay - Regenerating stack from deck');
    onReplay();
  }, [onReplay]);

  return (
    <GameResultsPresentation
      score={score}
      mochiFudaCards={mochiFudaCards}
      onBackToTop={handleBackToTop}
      onReplay={handleReplay}
    />
  );
}
