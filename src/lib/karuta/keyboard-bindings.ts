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
 * Get key bindings for a specific player index based on player count
 * Player count 1-2: Use 16-key layout
 * Player count 3-4: Use 8-key layout
 */
export function getPlayerKeyBindings(
  playerIndex: number,
  playerCount: number = 2,
): string[] | undefined {
  const bindings =
    playerCount >= 3 ? PLAYER_KEY_BINDINGS_8 : PLAYER_KEY_BINDINGS_16;
  return bindings[playerIndex];
}

/**
 * Get individual key for a specific card index within a player's tatami
 */
export function getKeyForCard(
  playerIndex: number,
  cardIndex: number,
  playerCount: number = 2,
): string | undefined {
  const keys = getPlayerKeyBindings(playerIndex, playerCount);
  return keys?.[cardIndex];
}
