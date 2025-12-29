import { useCallback } from 'react';
import type { GameState } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { TatamiViewPresentation } from './tatami-view-presentation';
import { DeckManager } from '@/lib/karuta/deck/deck-manager';

export type TatamiViewContainerProps = {
  gameState: GameState;
  onCorrectAnswer: (playerId: string, cardId: number) => void;
  onIncorrectAnswer: (playerId: string) => void;
};

export function TatamiViewContainer({
  gameState,
  onCorrectAnswer,
  onIncorrectAnswer,
}: TatamiViewContainerProps) {
  // Calculate current race from first player's mochiFuda count
  const completedRaces = gameState.playerStates[0]?.mochiFuda.length || 0;
  const currentRace = completedRaces + 1;

  // Get current YomiFuda from reading order
  const currentYomiFudaId = gameState.readingOrder[completedRaces];
  const currentYomiFuda = currentYomiFudaId
    ? gameState.deck.get(currentYomiFudaId)
    : null;

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

      console.group(isCorrect ? '✅ Correct!' : '❌ Incorrect!');
      console.log('Player:', playerId);
      console.log(
        'Selected:',
        selectedCard.prototypeNm,
        `(ID: ${selectedCard.id})`,
      );
      console.log(
        'Answer:',
        currentYomiFuda.prototypeNm,
        `(ID: ${currentYomiFuda.id})`,
      );
      console.groupEnd();

      if (isCorrect) {
        onCorrectAnswer(playerId, selectedCard.id);
      } else {
        onIncorrectAnswer(playerId);
      }
    },
    [currentYomiFuda, onCorrectAnswer, onIncorrectAnswer],
  );

  // Check if game is complete
  if (completedRaces >= gameState.readingOrder.length) {
    console.log('🎉 All cards acquired! Game complete.');
    return <div>Loading results...</div>;
  }

  // Safety check
  if (!currentYomiFuda) {
    console.error(
      'Current YomiFuda not found in deck:',
      currentYomiFudaId,
      'at index',
      completedRaces,
    );
    return <div>Error: YomiFuda not found</div>;
  }

  return (
    <TatamiViewPresentation
      yomiFuda={currentYomiFuda}
      sharedTatamiCards={sharedTatamiCards}
      playerStates={gameState.playerStates}
      deck={gameState.deck}
      currentRace={currentRace}
      totalRaces={gameState.readingOrder.length}
      stackCount={gameState.stack.length}
      onPlayerCardSelect={handlePlayerCardSelect}
    />
  );
}
