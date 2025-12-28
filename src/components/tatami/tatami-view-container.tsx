import { useCallback } from 'react';
import type { GameState } from '@/models/karuta';
import { getPrototypesByIds } from '@/lib/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { PlayMode } from '@/components/playMode/play-mode-selector-presentation';
import { TatamiViewPresentation } from './tatami-view-presentation';

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

  // Get current YomiFuda (0-indexed by completedRaces)
  const deckArray = [...gameState.deck.values()];
  const currentYomiFuda = deckArray[completedRaces];

  // Get Tatami cards
  const tatamiCards = getPrototypesByIds(gameState.deck, gameState.tatami);

  const handleSelectCard = useCallback(
    (selectedCard: NormalizedPrototype) => {
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
