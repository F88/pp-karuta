/**
 * GameFlow component encapsulates the entire game flow logic.
 *
 * This component can be used in any route, making it easy to reassign
 * the game flow to different routes in the future (e.g., `/game`, `/play`, etc.)
 */
import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { IntegratedSelectorContainer } from '@/components/selector/integrated-selector-container';
import { TatamiViewContainer } from '@/components/tatami/tatami-view-container';
import { GameResultsContainer } from '@/components/gameResults/game-results-container';
import type { GameState } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import { useGameSetup } from '@/hooks/useGameSetup';
import { usePromidasRepository } from '@/hooks/use-promidas-repository';

export function GameFlow() {
  const navigate = useNavigate();

  // Repository
  const { repository } = usePromidasRepository();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [score, setScore] = useState(0);
  const [mochiFuda, setMochiFuda] = useState<number[]>([]);

  // Game setup (persisted across Top/Replay)
  const setup = useGameSetup({
    repository,
    onGameStateCreated: (newGameState: GameState) => {
      console.log('🎮 Game started');
      setGameState(newGameState);
      setScore(0);
      setMochiFuda([]);
    },
  });

  // Extract playMode from first playerState (all players share same mode)
  const playMode: PlayMode | null = gameState?.playerStates[0]
    ? 'keyboard' // TODO: Store playMode in GameState
    : null;

  const handleCorrectAnswer = useCallback((cardId: number) => {
    console.log('🎯 handleCorrectAnswer called with cardId:', cardId);

    // Add to mochiFuda
    setMochiFuda((prev) => {
      const newMochiFuda = [...prev, cardId];
      console.log('📝 Updated mochiFuda:', newMochiFuda);
      return newMochiFuda;
    });

    // Add 1 point
    setScore((prev) => {
      const newScore = prev + 1;
      console.log('📊 Updated score:', newScore);
      return newScore;
    });

    // Update Tatami: remove the card and add from stack if available
    setGameState((prev) => {
      if (!prev) return prev;

      console.log(
        '🎴 Before update - Tatami:',
        prev.tatami,
        'Stack:',
        prev.stack,
      );

      // Remove the selected card from Tatami
      const newTatami = prev.tatami.filter((id) => id !== cardId);
      const newStack = [...prev.stack];

      // If stack has cards, add one to Tatami
      if (newStack.length > 0) {
        const nextCard = newStack.shift();
        if (nextCard !== undefined) {
          newTatami.push(nextCard);
          console.log('➕ Added card from stack to Tatami:', nextCard);
        }
      }

      console.log('🎴 After update - Tatami:', newTatami, 'Stack:', newStack);

      return {
        ...prev,
        tatami: newTatami,
        stack: newStack,
      };
    });
  }, []);

  const handleIncorrectAnswer = useCallback(() => {
    // Subtract 1 point (minimum 0)
    setScore((prev) => Math.max(0, prev - 1));
  }, []);

  const handleBackToTop = useCallback(() => {
    // Return to selector (keep setup state)
    setGameState(null);
    setScore(0);
    setMochiFuda([]);
  }, []);

  const handleReplay = useCallback(async () => {
    // Replay with same settings (no selector)
    console.log('🔄 Replaying game with same settings');
    setScore(0);
    setMochiFuda([]);
    await setup.createGameState();
  }, [setup]);

  const handleShowIntro = useCallback(() => {
    navigate({ to: '/intro' });
  }, [navigate]);

  // Game is over when all cards are acquired
  const isGameOver = gameState && mochiFuda.length >= gameState.readingOrder.length;

  console.log('📊 Game status:', {
    mochiFudaCount: mochiFuda.length,
    readingOrderLength: gameState?.readingOrder.length,
    isGameOver,
  });

  // Show results if game is over
  if (isGameOver && gameState) {
    return (
      <GameResultsContainer
        deck={gameState.deck}
        score={score}
        mochiFuda={mochiFuda}
        onBackToTop={handleBackToTop}
        onReplay={handleReplay}
      />
    );
  }

  // Show game view if gameState exists
  if (gameState && playMode) {
    return (
      <TatamiViewContainer
        playMode={playMode}
        gameState={gameState}
        score={score}
        mochiFuda={mochiFuda}
        onCorrectAnswer={handleCorrectAnswer}
        onIncorrectAnswer={handleIncorrectAnswer}
      />
    );
  }

  // Show integrated selector (default view)
  return (
    <IntegratedSelectorContainer
      setup={setup}
      onShowIntro={handleShowIntro}
    />
  );
}
