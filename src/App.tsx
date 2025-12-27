import { useState, useCallback } from 'react';
import './App.css';
import { RecipeSelectorContainer } from '@/components/recipeSelector/RecipeSelectorContainer';
import { TatamiViewContainer } from '@/components/tatamiView/TatamiViewContainer';
import { GameResultsContainer } from '@/components/gameResults/GameResultsContainer';
import { createInitialState } from '@/lib/karuta';
import type { GameState } from '@/models/karuta';

function App() {
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

      // If stack has cards, add one to tatami
      if (newStack.length > 0) {
        const nextCard = newStack.shift()!;
        newTatami.push(nextCard);
      }

      return {
        ...prev,
        tatami: newTatami,
        stack: newStack,
      };
    });
  }, []);

  const handleIncorrectAnswer = useCallback(() => {
    // Subtract 1 point
    setScore((prev) => prev - 1);
  }, []);

  const handleBackToTop = useCallback(() => {
    setGameState(null);
    setScore(0);
    setMochiFuda([]);
  }, []);

  const handleReplay = useCallback(() => {
    if (!gameState) return;

    // Regenerate stack and tatami from existing deck
    const newState = createInitialState(gameState.deck);
    setGameState(newState);
    setScore(0);
    setMochiFuda([]);
  }, [gameState]);

  // Game is over when all cards are acquired
  // completedRaces = mochiFuda.length (single player)
  const isGameOver = gameState && mochiFuda.length >= gameState.deck.size;

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
        gameState={gameState}
        score={score}
        mochiFuda={mochiFuda}
        onCorrectAnswer={handleCorrectAnswer}
        onIncorrectAnswer={handleIncorrectAnswer}
      />
    );
  }

  return <RecipeSelectorContainer onGameStateCreated={setGameState} />;
}

export default App;
