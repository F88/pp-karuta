import { useCallback } from 'react';
import type { GamePlayerState, Deck } from '@/models/karuta';
import { GameResultsPresentation } from './game-results-presentation';

export type GameResultsContainerProps = {
  deck: Deck;
  playerStates: GamePlayerState[];
  onBackToTop: () => void;
  onReplay: () => void;
};

export function GameResultsContainer({
  deck,
  playerStates,
  onBackToTop,
  onReplay,
}: GameResultsContainerProps) {
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
      playerStates={playerStates}
      deck={deck}
      onBackToTop={handleBackToTop}
      onReplay={handleReplay}
    />
  );
}
