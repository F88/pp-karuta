import { useEffect } from 'react';
import type { GamePlayerState } from '@/models/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import { DeckManager } from '@/lib/karuta/deck/deck-manager';

type UseKeyboardCardSelectionProps = {
  enabled: boolean;
  playerStates: GamePlayerState[];
  deck: Map<number, NormalizedPrototype>;
  onCardSelect: (playerId: string, card: NormalizedPrototype) => void;
};

// Keyboard bindings for each player
const PLAYER_KEY_BINDINGS: Record<string, string[]> = {
  'player-1': ['1', '2', '3', '4', '5'],
  'player-2': ['q', 'w', 'e', 'r', 't'],
  'player-3': ['a', 's', 'd', 'f', 'g'],
  'player-4': ['z', 'x', 'c', 'v', 'b'],
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

      // Find which player and card index this key corresponds to
      for (const playerState of playerStates) {
        const playerId = playerState.player.id;
        const keyBindings = PLAYER_KEY_BINDINGS[playerId];

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
            onCardSelect(playerId, selectedCard);
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
