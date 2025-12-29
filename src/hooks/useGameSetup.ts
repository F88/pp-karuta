import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Deck, DeckRecipe, StackRecipe, Player } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import {
  DeckManager,
  GameManager,
  PlayerManager,
  StackManager,
  StackRecipeManager,
} from '@/lib/karuta';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';

export type UseGameSetupReturn = {
  // Deck state
  generatedDeck: Deck | null;
  selectedDeckRecipe: DeckRecipe | null;
  selectDeckRecipe: (recipe: DeckRecipe) => Promise<void>;
  isDeckLoading: boolean;
  loadingDeckRecipeId: string | null;

  // Stack state
  generatedStack: number[] | null;
  selectedStackRecipe: StackRecipe | null;
  selectStackRecipe: (recipe: StackRecipe) => void;

  // Player state
  availablePlayers: Player[];
  selectedPlayerIds: string[];
  togglePlayer: (playerId: string) => void;
  addPlayer: () => Promise<void>;

  // PlayMode state
  selectedPlayMode: PlayMode | null;
  selectPlayMode: (mode: PlayMode) => void;

  // Game creation
  canStartGame: boolean;
  createGameState: () => Promise<void>;

  // Error & loading
  error: string | null;
  isCreatingGame: boolean;
};

export type UseGameSetupOptions = {
  repository: ProtopediaInMemoryRepository | null;
  onGameStateCreated: (gameState: import('@/models/karuta').GameState) => void;
};

export function useGameSetup({
  repository,
  onGameStateCreated,
}: UseGameSetupOptions): UseGameSetupReturn {
  // Deck state - 重いので実体を保持（再利用のため）
  const [generatedDeck, setGeneratedDeck] = useState<Deck | null>(null);
  const [selectedDeckRecipe, setSelectedDeckRecipe] =
    useState<DeckRecipe | null>(null);
  const [isDeckLoading, setIsDeckLoading] = useState(false);
  const [loadingDeckRecipeId, setLoadingDeckRecipeId] = useState<string | null>(
    null,
  );

  // Stack state - 生成済みStackを保持（正確な枚数表示のため）
  const [generatedStack, setGeneratedStack] = useState<number[] | null>(null);
  const [selectedStackRecipe, setSelectedStackRecipe] =
    useState<StackRecipe | null>(() => {
      // Default to 10 Cards recipe
      const defaultRecipe = StackRecipeManager.findById('standard-10');
      return defaultRecipe || null;
    });

  // Player state
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  // PlayMode state
  const [selectedPlayMode, setSelectedPlayMode] = useState<PlayMode | null>(
    'touch',
  );

  // Error & loading state
  const [error, setError] = useState<string | null>(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  // Load available players on mount
  useEffect(() => {
    const loadPlayers = async () => {
      const players = await PlayerManager.loadPlayers();
      if (players) {
        setAvailablePlayers(players);
        // If only one player, select it automatically
        if (players.length === 1) {
          setSelectedPlayerIds([players[0].id]);
        }
      }
    };
    loadPlayers();
  }, []);

  // Select DeckRecipe and generate Deck immediately
  const selectDeckRecipe = useCallback(
    async (recipe: DeckRecipe) => {
      if (!repository) {
        setError('Repository is not initialized');
        return;
      }

      // If same recipe is selected and Deck already exists, skip regeneration
      if (selectedDeckRecipe?.id === recipe.id && generatedDeck !== null) {
        console.log(
          '📦 Same DeckRecipe selected, reusing existing Deck:',
          recipe.id,
        );
        setIsDeckLoading(false); // Ensure loading state is false
        return;
      }

      console.log('🔨 Generating new Deck for recipe:', recipe.id);
      setIsDeckLoading(true);
      setLoadingDeckRecipeId(recipe.id);
      setError(null);

      try {
        const deck = await DeckManager.generateFromRecipe(recipe, repository);
        setGeneratedDeck(deck);
        setSelectedDeckRecipe(recipe);
        console.log('✅ Deck generated successfully:', deck.size, 'cards');

        // If StackRecipe is already selected, regenerate Stack with new Deck
        // Only generate stack if deck is not empty
        if (selectedStackRecipe && deck.size > 0) {
          const stack = StackManager.generate(deck, selectedStackRecipe);
          setGeneratedStack(stack);
          console.log('✅ Stack regenerated:', stack.length, 'cards');
        } else if (deck.size === 0) {
          setGeneratedStack(null);
          console.log('⚠️ Deck is empty, skipping Stack generation');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate Deck';
        setError(errorMessage);
        console.error('Failed to generate Deck:', err);
      } finally {
        console.log('🔄 Setting isDeckLoading to false');
        setIsDeckLoading(false);
        setLoadingDeckRecipeId(null);
        console.log('✔️ isDeckLoading set to false');
      }
    },
    [generatedDeck, repository, selectedDeckRecipe?.id, selectedStackRecipe],
  );

  // Reset deck when repository becomes available or changes
  useEffect(() => {
    // If repository becomes available and we have a selected deck recipe,
    // but no deck yet, regenerate the deck
    if (repository && selectedDeckRecipe && !generatedDeck && !isDeckLoading) {
      console.log(
        '🔄 Repository became available, regenerating deck for recipe:',
        selectedDeckRecipe.id,
      );
      void selectDeckRecipe(selectedDeckRecipe);
    }
  }, [
    repository,
    selectedDeckRecipe,
    generatedDeck,
    isDeckLoading,
    selectDeckRecipe,
  ]);

  // Select StackRecipe and generate Stack if Deck exists
  const selectStackRecipe = useCallback(
    (recipe: StackRecipe) => {
      setSelectedStackRecipe(recipe);
      setError(null);

      // Generate Stack if Deck is already available and not empty
      if (generatedDeck && generatedDeck.size > 0) {
        const stack = StackManager.generate(generatedDeck, recipe);
        setGeneratedStack(stack);
        console.log('✅ Stack generated:', stack.length, 'cards');
      } else {
        setGeneratedStack(null);
        if (generatedDeck && generatedDeck.size === 0) {
          console.log('⚠️ Deck is empty, skipping Stack generation');
        }
      }
    },
    // selectedStackRecipe is not used inside the callback, only the recipe parameter

    [generatedDeck],
  );

  // Toggle player selection
  const togglePlayer = useCallback((playerId: string) => {
    setSelectedPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
    setError(null);
  }, []);

  // Add new player with random name
  const addPlayer = useCallback(async () => {
    const newPlayerNumber = availablePlayers.length + 1;
    const newPlayer = PlayerManager.createPlayer(
      `player-${Date.now()}`,
      `Player ${newPlayerNumber}`,
    );

    const updatedPlayers = [...availablePlayers, newPlayer];
    setAvailablePlayers(updatedPlayers);

    // Save to storage
    await PlayerManager.savePlayers(updatedPlayers);
    setError(null);
  }, [availablePlayers]);

  // Select PlayMode
  const selectPlayMode = useCallback((mode: PlayMode) => {
    setSelectedPlayMode(mode);
    setError(null);
  }, []);

  // Can start game validation
  const canStartGame = useMemo(() => {
    return (
      generatedDeck !== null &&
      selectedStackRecipe !== null &&
      selectedPlayerIds.length > 0 &&
      selectedPlayMode !== null &&
      !isDeckLoading &&
      !isCreatingGame
    );
  }, [
    generatedDeck,
    selectedStackRecipe,
    selectedPlayerIds,
    selectedPlayMode,
    isDeckLoading,
    isCreatingGame,
  ]);

  // Create GameState (reuses generated Deck)
  const createGameState = useCallback(async () => {
    if (
      !canStartGame ||
      !generatedDeck ||
      !selectedStackRecipe ||
      !selectedPlayMode
    ) {
      return;
    }

    setIsCreatingGame(true);
    setError(null);

    try {
      // Reuse generated Deck (no API call!)
      // Note: StackManager.generate is called inside GameManager.createInitialState

      // Get selected Players
      const selectedPlayers = availablePlayers.filter((p) =>
        selectedPlayerIds.includes(p.id),
      );

      if (selectedPlayers.length === 0) {
        throw new Error('No players selected');
      }

      // Create GameState (Deck is reused, Stack is generated from StackRecipe)
      const gameState = GameManager.createInitialState(
        generatedDeck,
        selectedPlayers,
        selectedPlayMode,
        selectedStackRecipe,
        5, // initialTatamiSize
      );

      // Notify parent
      onGameStateCreated(gameState);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create game state';
      setError(errorMessage);
      console.error('Failed to create game state:', err);
    } finally {
      setIsCreatingGame(false);
    }
  }, [
    canStartGame,
    generatedDeck,
    selectedStackRecipe,
    selectedPlayMode,
    availablePlayers,
    selectedPlayerIds,
    onGameStateCreated,
  ]);

  return {
    generatedDeck,
    selectedDeckRecipe,
    selectDeckRecipe,
    isDeckLoading,
    loadingDeckRecipeId,
    generatedStack,
    selectedStackRecipe,
    selectStackRecipe,
    availablePlayers,
    selectedPlayerIds,
    togglePlayer,
    addPlayer,
    selectedPlayMode,
    selectPlayMode,
    canStartGame,
    createGameState,
    error,
    isCreatingGame,
  };
}
