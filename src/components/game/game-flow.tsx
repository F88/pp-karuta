/**
 * GameFlow component encapsulates the entire game flow logic.
 *
 * This component can be used in any route, making it easy to reassign
 * the game flow to different routes in the future (e.g., `/game`, `/play`, etc.)
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { IntegratedSelectorContainer } from '@/components/selector/integrated-selector-container';
import { TatamiViewContainer } from '@/components/tatami/tatami-view-container';
import { GameResultsContainer } from '@/components/gameResults/game-results-container';
import type { GameState } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import { GameManager } from '@/lib/karuta/game/game-manager';
import { useGameSetup } from '@/hooks/use-game-setup';
import { useRepositoryState } from '@/hooks/use-repository-state';
import { useScreenSizeContext } from '@/hooks/use-screen-size-context';
import { logger } from '@/lib/logger';

export function GameFlow() {
  const navigate = useNavigate();
  const screenSize = useScreenSizeContext();
  const searchParams = useSearch({ from: '/' });

  // Repository state
  const repoState = useRepositoryState();
  const repository =
    repoState.type === 'created-token-valid' ? repoState.repository : null;

  const [gameState, setGameState] = useState<GameState | null>(null);

  // Game setup (persisted across Top/Replay)
  const setup = useGameSetup({
    repository,
    onGameStateCreated: (newGameState: GameState) => {
      logger.debug('🎮 Game started');
      setGameState(newGameState);
    },
  });

  // Reset game state when reset query parameter changes
  const resetValue = searchParams?.reset;
  useEffect(() => {
    if (resetValue) {
      logger.debug('🔄 Resetting game state due to reset parameter');
      // This is an intentional state reset triggered by navigation
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGameState(null);
    }
  }, [resetValue]);

  // Use the selected play mode from setup
  const playMode: PlayMode | null = setup.selectedPlayMode;

  const handleCorrectAnswer = useCallback(
    (playerId: string, cardId: number) => {
      logger.debug(
        '🎯 handleCorrectAnswer called with playerId:',
        playerId,
        'cardId:',
        cardId,
      );

      setGameState((prev) => {
        if (!prev) return prev;
        return GameManager.processCorrectAnswer(prev, playerId, cardId);
      });
    },
    [],
  );

  const handleIncorrectAnswer = useCallback((playerId: string) => {
    setGameState((prev) => {
      if (!prev) return prev;
      return GameManager.processIncorrectAnswer(prev, playerId);
    });
  }, []);

  const handleBackToTop = useCallback(() => {
    // Return to selector (keep setup state)
    setGameState(null);
  }, []);

  const handleReplay = useCallback(async () => {
    // Replay with same settings (no selector)
    logger.debug('🔄 Replaying game with same settings');
    await setup.createGameState();
  }, [setup]);

  const handleShowIntro = useCallback(() => {
    navigate({ to: '/intro' });
  }, [navigate]);

  // Game is over when all cards are acquired
  const isGameOver = gameState ? GameManager.isGameOver(gameState) : false;

  // Show results if game is over
  if (isGameOver && gameState) {
    return (
      <GameResultsContainer
        deck={gameState.deck}
        playerStates={gameState.playerStates}
        onBackToTop={handleBackToTop}
        onReplay={handleReplay}
        screenSize={screenSize}
      />
    );
  }

  // Show game view if gameState exists
  if (gameState && playMode) {
    return (
      <TatamiViewContainer
        gameState={gameState}
        playMode={playMode}
        onCorrectAnswer={handleCorrectAnswer}
        onIncorrectAnswer={handleIncorrectAnswer}
        screenSize={screenSize}
      />
    );
  }

  // Show integrated selector (default view)
  return (
    <IntegratedSelectorContainer setup={setup} onShowIntro={handleShowIntro} />
  );
}
