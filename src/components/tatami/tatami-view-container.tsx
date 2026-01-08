import { useCallback, useEffect, useMemo, useState } from 'react';

import type { NormalizedPrototype } from '@f88/promidas/types';

import { useKeyboardCardSelection } from '@/hooks/use-keyboard-card-selection';

import type { GameState } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';

import type { PlayMode } from '@/lib/karuta';
import { DeckManager } from '@/lib/karuta/deck/deck-manager';
import { GameManager } from '@/lib/karuta/game/game-manager';
import { logger } from '@/lib/logger';

import { TatamiViewPresentation } from './tatami-view-presentation';

export type TatamiViewContainerProps = {
  gameState: GameState;
  playMode: PlayMode;
  onCorrectAnswer: (playerId: string, cardId: number) => void;
  onIncorrectAnswer: (playerId: string) => void;
  screenSize?: ScreenSize;
};

export function TatamiViewContainer({
  gameState,
  playMode,
  onCorrectAnswer,
  onIncorrectAnswer,
  screenSize,
}: TatamiViewContainerProps) {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Calculate current race from total mochiFuda count across all players
  const totalMochiFuda = gameState.playerStates.reduce(
    (sum, ps) => sum + ps.mochiFuda.length,
    0,
  );
  const completedRaces = totalMochiFuda;
  const currentRace = completedRaces + 1;

  // Feedback states for each player
  const [playerFeedbackStates, setPlayerFeedbackStates] = useState<
    Record<string, 'correct' | 'incorrect' | null>
  >({});

  // Pick YomiFuda from tatami (memoized to prevent re-selection on every render)
  const currentYomiFuda = useMemo(() => {
    const cardId = GameManager.pickYomiFuda(gameState.tatami);
    return cardId !== null ? (gameState.deck.get(cardId) ?? null) : null;
  }, [gameState.tatami, gameState.deck]);

  // Get Shared Tatami cards
  const sharedTatamiCards = DeckManager.getByIds(
    gameState.deck,
    gameState.tatami,
  );

  // Handle card selection from any player
  const handlePlayerCardSelect = useCallback(
    (playerId: string, selectedCard: NormalizedPrototype) => {
      if (!currentYomiFuda) return;

      const isCorrect = selectedCard.id === currentYomiFuda.id;

      logger.debug(isCorrect ? '✅ Correct!' : '❌ Incorrect!', {
        player: playerId,
        selected: { name: selectedCard.prototypeNm, id: selectedCard.id },
        answer: { name: currentYomiFuda.prototypeNm, id: currentYomiFuda.id },
      });

      // Set feedback state
      setPlayerFeedbackStates((prev) => ({
        ...prev,
        [playerId]: isCorrect ? 'correct' : 'incorrect',
      }));

      // Clear feedback after animation (correct: 600ms, incorrect: 1500ms)
      const feedbackDuration = isCorrect ? 1_500 : 500;
      setTimeout(() => {
        setPlayerFeedbackStates((prev) => ({
          ...prev,
          [playerId]: null,
        }));
      }, feedbackDuration);

      if (isCorrect) {
        onCorrectAnswer(playerId, selectedCard.id);
      } else {
        onIncorrectAnswer(playerId);
      }
    },
    [currentYomiFuda, onCorrectAnswer, onIncorrectAnswer],
  );

  // Enable keyboard card selection for keyboard mode only
  useKeyboardCardSelection({
    enabled: playMode === 'keyboard',
    playerStates: gameState.playerStates,
    deck: gameState.deck,
    onCardSelect: handlePlayerCardSelect,
  });

  // Check if game is complete
  if (!currentYomiFuda) {
    logger.debug('🎉 All cards acquired! Game complete.');
    return <div>Loading results...</div>;
  }

  return (
    <TatamiViewPresentation
      yomiFuda={currentYomiFuda}
      sharedTatamiCards={sharedTatamiCards}
      playerStates={gameState.playerStates}
      deck={gameState.deck}
      currentRace={currentRace}
      totalRaces={gameState.deck.size}
      stackCount={gameState.stack.length}
      playMode={playMode}
      onPlayerCardSelect={handlePlayerCardSelect}
      playerFeedbackStates={playerFeedbackStates}
      screenSize={screenSize}
    />
  );
}
