/**
 * Stack - Prototype IDs waiting to be drawn to Tatami
 * Represents the deck of cards yet to be played
 */
export type Stack = number[];

/**
 * StackRecipe - Stack generation rule definition
 * Specifies how many cards to extract and how to sort them
 */
export type StackRecipe = {
  id: string;
  title: string;
  description?: string;
  maxSize: number | 'all';
  sortMethod: 'random' | 'sequential';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
};
