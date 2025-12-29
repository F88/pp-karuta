import { useCallback } from 'react';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { GamePlayerState } from '@/models/karuta';
import { GameResultsPresentation } from './game-results-presentation';
import { DeckManager } from '@/lib/karuta';

export type GameResultsContainerProps = {
  deck: Map<number, NormalizedPrototype>;
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
  // Calculate total score and mochiFuda from all players
  const totalScore = playerStates.reduce((sum, ps) => sum + ps.score, 0);
  const allMochiFudaIds = playerStates.flatMap((ps) => ps.mochiFuda);
  const mochiFudaCards = DeckManager.getByIds(deck, allMochiFudaIds);

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
      totalScore={totalScore}
      mochiFudaCards={mochiFudaCards}
      onBackToTop={handleBackToTop}
      onReplay={handleReplay}
    />
  );
}
