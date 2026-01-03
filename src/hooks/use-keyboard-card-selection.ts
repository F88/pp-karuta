import { DeckManager } from '@/lib/karuta/deck/deck-manager';
import { getPlayerKeyBindings } from '@/lib/karuta/keyboard-bindings';
import type { GamePlayerState } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { useEffect } from 'react';

type UseKeyboardCardSelectionProps = {
  enabled: boolean;
  playerStates: GamePlayerState[];
  deck: Map<number, NormalizedPrototype>;
  onCardSelect: (playerId: string, card: NormalizedPrototype) => void;
};

export function useKeyboardCardSelection({
  enabled,
  playerStates,
  deck,
  onCardSelect,
}: UseKeyboardCardSelectionProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if modifier keys are pressed
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return;
      }

      const key = event.key.toLowerCase();

      // Player count determines key bindings (1-2: 16 keys, 3-4: 8 keys)
      const playerCount = playerStates.length;

      // Find which player and card index this key corresponds to
      for (
        let playerIndex = 0;
        playerIndex < playerStates.length;
        playerIndex++
      ) {
        const playerState = playerStates[playerIndex];
        const keyBindings = getPlayerKeyBindings(playerIndex, playerCount);

        if (!keyBindings) continue;

        const cardIndex = keyBindings.indexOf(key);

        if (cardIndex !== -1) {
          // Get player's tatami cards
          const playerTatamiCards = DeckManager.getByIds(
            deck,
            playerState.tatami,
          );

          // Check if card exists at this index
          if (cardIndex < playerTatamiCards.length) {
            const selectedCard = playerTatamiCards[cardIndex];
            event.preventDefault();
            onCardSelect(playerState.player.id, selectedCard);
            return;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, playerStates, deck, onCardSelect]);
}
