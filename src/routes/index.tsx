/**
 * Home route (`/`) for the main game flow.
 *
 * The shared shadcn/ui `ThemeProvider` is applied here so all main gameplay
 * screens use the common theme, while `/intro` remains theme-isolated.
 */
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { PromidasRepoDashboard } from '@/components/promidas/promid-repo-dashboard-container';
import { RecipeSelectorContainer } from '@/components/recipe/recipe-selector-container';
import { TatamiViewContainer } from '@/components/tatami/tatami-view-container';
import { GameResultsContainer } from '@/components/gameResults/game-results-container';
import { TokenManagerContainer } from '@/components/token/token-manager-container';
import { Button } from '@/components/ui/button';
import { useToken } from '@/hooks/use-token';
import { useRepositoryState } from '@/hooks/use-repository-state';
import { createInitialState } from '@/lib/karuta';
import type { GameState } from '@/models/karuta';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { hasToken } = useToken();
  const repoState = useRepositoryState();
  const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

  // In API mode, RecipeSelector is shown only when repository is valid
  const canShowRecipeSelector =
    useDummyData || (hasToken && repoState.type === 'created-token-valid');

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

  // Game is over when all cards are acquired
  const isGameOver = gameState && mochiFuda.length >= gameState.deck.size;

  if (isGameOver && gameState) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="pp-karuta-theme">
        <GameResultsContainer
          deck={gameState.deck}
          score={score}
          mochiFuda={mochiFuda}
          onBackToTop={handleBackToTop}
          onReplay={handleReplay}
        />
      </ThemeProvider>
    );
  }

  if (gameState) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="pp-karuta-theme">
        <TatamiViewContainer
          gameState={gameState}
          score={score}
          mochiFuda={mochiFuda}
          onCorrectAnswer={handleCorrectAnswer}
          onIncorrectAnswer={handleIncorrectAnswer}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="pp-karuta-theme">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/intro">📜 掟 (RULES)</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
      <div className="mb-8 flex flex-col items-center gap-6">
        <TokenManagerContainer />
        <PromidasRepoDashboard />
      </div>
      {canShowRecipeSelector ? (
        <RecipeSelectorContainer
          onGameStateCreated={setGameState}
          onShowIntro={handleShowIntro}
        />
      ) : null}
    </ThemeProvider>
  );
}
