import { useCallback } from 'react';
import type { GameState } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { PlayMode } from '@/components/playMode/play-mode-selector-presentation';
import { TatamiViewPresentation } from './tatami-view-presentation';
import { DeckManager } from '@/lib/karuta/deck/deck-manager';

export type TatamiViewContainerProps = {
  playMode: PlayMode;
  gameState: Omit<GameState, 'players'>;
  score: number;
  mochiFuda: number[]; // Array of cardId (prototypeId)
  onCorrectAnswer: (cardId: number) => void;
  onIncorrectAnswer: () => void;
};

export function TatamiViewContainer({
  playMode, // Reserved for future keyboard/touch mode differences
  gameState,
  score,
  mochiFuda,
  onCorrectAnswer,
  onIncorrectAnswer,
}: TatamiViewContainerProps) {
  // playMode will be used for keyboard/touch mode differences in the future
  void playMode;

  // Calculate current race from completed races (mochiFuda count)
  const completedRaces = mochiFuda.length;
  const currentRace = completedRaces + 1;

  // Get current YomiFuda from reading order (handle out of bounds)
  const currentYomiFudaId = gameState.readingOrder[completedRaces];
  const currentYomiFuda = currentYomiFudaId
    ? gameState.deck.get(currentYomiFudaId)
    : null;

  // Get Tatami cards
  const tatamiCards = DeckManager.getByIds(gameState.deck, gameState.tatami);

  const handleSelectCard = useCallback(
    (selectedCard: NormalizedPrototype) => {
      if (!currentYomiFuda) return;

      const isCorrect = selectedCard.id === currentYomiFuda.id;

      console.group(isCorrect ? '✅ Correct!' : '❌ Incorrect!');
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
        onCorrectAnswer(selectedCard.id);
      } else {
        onIncorrectAnswer();
      }
    },
    [currentYomiFuda, onCorrectAnswer, onIncorrectAnswer],
  );

  // Check if game is complete (all cards acquired)
  if (completedRaces >= gameState.readingOrder.length) {
    console.log('🎉 All cards acquired! Game complete.');
    // Return empty div - GameFlow will handle transition to results
    return <div>Loading results...</div>;
  }

  // Safety check: if currentYomiFuda is not found, use a placeholder
  if (!currentYomiFuda) {
    console.error(
      'Current YomiFuda not found in deck:',
      currentYomiFudaId,
      'at index',
      completedRaces,
    );
    // Return early or show error state
    return <div>Error: YomiFuda not found</div>;
  }

  return (
    <TatamiViewPresentation
      yomiFuda={currentYomiFuda}
      tatamiCards={tatamiCards}
      currentRace={currentRace}
      totalRaces={gameState.deck.size}
      stackCount={gameState.stack.length}
      score={score}
      mochiFudaCount={mochiFuda.length}
      onSelectCard={handleSelectCard}
    />
  );
}
