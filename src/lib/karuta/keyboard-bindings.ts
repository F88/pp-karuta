/**
 * Keyboard bindings for each player in keyboard mode
 * Index-based: Player 0, Player 1, Player 2, Player 3
 */

export const PLAYER_KEY_BINDINGS_16: string[][] = [
  [
    // Player 1
    ...['7', '8', '9', '0'],
    ...['u', 'i', 'o', 'p'],
    ...['j', 'k', 'l', ';'],
    ...['m', ',', '.', '/'],
  ],
  [
    // Player 2
    ...['1', '2', '3', '4'],
    ...['q', 'w', 'e', 'r'],
    ...['a', 's', 'd', 'f'],
    ...['z', 'x', 'c', 'v'],
  ],
];

export const PLAYER_KEY_BINDINGS_8: string[][] = [
  [
    // Player 1
    ...['j', 'k', 'l', ';'],
    ...['m', ',', '.', '/'],
  ],
  [
    // Player 2
    ...['a', 's', 'd', 'f'],
    ...['z', 'x', 'c', 'v'],
  ],
  [
    // Player 3
    ...['7', '8', '9', '0'],
    ...['u', 'i', 'o', 'p'],
  ],
  [
    // Player 4
    ...['1', '2', '3', '4'],
    ...['q', 'w', 'e', 'r'],
  ],
];

/**
 * Get key bindings for a specific player index based on tatami size
 * Tatami size <= 8: Use 8-key layout
 * Tatami size > 8: Use 16-key layout
 *
 * @param playerIndex - Index of the player (0-3)
 * @param playerCount - Number of players (deprecated, kept for backward compatibility)
 * @param tatamiSize - Initial tatami size setting (determines key layout)
 */
export function getPlayerKeyBindings(
  playerIndex: number,
  playerCount: number = 2,
  tatamiSize: number = 16,
): string[] | undefined {
  if (playerCount <= 2) {
    switch (tatamiSize) {
      case 4: {
        return PLAYER_KEY_BINDINGS_8[playerIndex];
      }
      case 8:
        return PLAYER_KEY_BINDINGS_8[playerIndex];
      default:
        return PLAYER_KEY_BINDINGS_16[playerIndex];
    }
  } else {
    return PLAYER_KEY_BINDINGS_8[playerIndex];
  }
}

/**
 * Get individual key for a specific card index within a player's tatami
 *
 * @param playerIndex - Index of the player (0-3)
 * @param cardIndex - Index of the card in player's tatami
 * @param playerCount - Number of players (deprecated, kept for backward compatibility)
 * @param tatamiSize - Initial tatami size setting (determines key layout)
 */
export function getKeyForCard(
  playerIndex: number,
  cardIndex: number,
  playerCount: number = 2,
  tatamiSize: number = 8,
): string | undefined {
  const keys = getPlayerKeyBindings(playerIndex, playerCount, tatamiSize);
  return keys?.[cardIndex];
}
