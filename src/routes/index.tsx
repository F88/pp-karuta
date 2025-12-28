/**
 * Home route (`/`) for the main game flow.
 *
 * The shared shadcn/ui `ThemeProvider` is applied here so all main gameplay
 * screens use the common theme, while `/intro` remains theme-isolated.
 */
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { PlayModeSelectorContainer } from '@/components/playMode/play-mode-selector-container';
import type { PlayMode } from '@/components/playMode/play-mode-selector-presentation';
import { RecipeSelectorContainer } from '@/components/recipe/recipe-selector-container';
import { TatamiViewContainer } from '@/components/tatami/tatami-view-container';
import { GameResultsContainer } from '@/components/gameResults/game-results-container';
import { createInitialState } from '@/lib/karuta';
import type { GameState } from '@/models/karuta';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const [playMode, setPlayMode] = useState<PlayMode | null>(null);
  const [gameState, setGameState] = useState<Omit<GameState, 'players'> | null>(
    null,
  );
  const [score, setScore] = useState(0);
  const [mochiFuda, setMochiFuda] = useState<number[]>([]);

  const handleCorrectAnswer = useCallback((cardId: number) => {
    // Add to mochiFuda
    setMochiFuda((prev) => [...prev, cardId]);

    // Add 1 point
    setScore((prev) => prev + 1);

    // Update Tatami: remove the card and add from stack if available
    setGameState((prev) => {
      if (!prev) return prev;

      const newTatami = prev.tatami.filter((id) => id !== cardId);
      const newStack = [...prev.stack];

      if (newStack.length > 0 && newTatami.length < 5) {
        const nextCard = newStack.shift();
        if (nextCard !== undefined) {
          newTatami.push(nextCard);
        }
      }

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
    setPlayMode(null);
    setGameState(null);
    setScore(0);
    setMochiFuda([]);
  }, []);

  const handleReplay = useCallback(() => {
    if (!gameState) return;

    const newGameState = createInitialState(gameState.deck);
    setGameState(newGameState);
    setScore(0);
    setMochiFuda([]);
  }, [gameState]);

  const handleShowIntro = () => {
    navigate({ to: '/intro' });
  };

  const handleModeSelected = useCallback((mode: PlayMode) => {
    console.log('[Index] handleModeSelected called with mode:', mode);
    setPlayMode(mode);
  }, []);

  // Game is over when all cards are acquired
  const isGameOver = gameState && mochiFuda.length >= gameState.deck.size;

  // Show PlayMode selector first
  if (playMode == null) {
    return (
      <PlayModeSelectorContainer
        onModeSelected={handleModeSelected}
        requireRepository={false}
      />
    );
  }

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

  if (gameState) {
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

  return (
    <RecipeSelectorContainer
      playMode={playMode}
      onGameStateCreated={setGameState}
      onShowIntro={handleShowIntro}
    />
  );
}
