import { useCallback } from 'react';

import { useScrollToTopOnMount } from '@/hooks/use-scroll-to-top-on-mount';
import { logger } from '@/lib/logger';
import type { GamePlayerState, Deck } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';

import { GameResultsPresentation } from './game-results-presentation';

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
  useScrollToTopOnMount();

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
