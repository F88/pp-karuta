/**
 * Player - Player state
 */
export type Player = {
  id: string;
  name: string;
  tatami: number[]; // Player's own Tatami (required for Touch mode)
  mochiFuda: number[]; // IDs of acquired cards
  score: number;
};
