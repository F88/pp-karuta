import { useCallback, useEffect } from 'react';
import type { GamePlayerState, Deck } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { GameResultsPresentation } from './game-results-presentation';
import { logger } from '@/lib/logger';

export type GameResultsContainerProps = {
  deck: Deck;
  playerStates: GamePlayerState[];
  onBackToTop: () => void;
  onReplay: () => void;
  screenSize?: ScreenSize;
};

export function GameResultsContainer({
  deck,
  playerStates,
  onBackToTop,
  onReplay,
  screenSize,
}: GameResultsContainerProps) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBackToTop = useCallback(() => {
    logger.debug('🏠 Back to TOP');
    onBackToTop();
  }, [onBackToTop]);

  const handleReplay = useCallback(() => {
    logger.debug('🔄 Replay - Regenerating stack from deck');
    onReplay();
  }, [onReplay]);

  return (
    <GameResultsPresentation
      playerStates={playerStates}
      deck={deck}
      onBackToTop={handleBackToTop}
      onReplay={handleReplay}
      screenSize={screenSize}
    />
  );
}
