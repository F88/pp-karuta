import type { PlayMode, TatamiSize } from '@/lib/karuta';
import {
  DeckManager,
  DeckRecipeManager,
  DEFAULT_TATAMI_SIZE,
  GameManager,
  PlayerManager,
  StackManager,
  StackRecipeManager,
} from '@/lib/karuta';
import {
  TATAMI_SIZES_16,
  TATAMI_SIZES_8,
  type TatamiSize16,
  type TatamiSize8,
} from '@/lib/karuta/tatami/tatami-size';
import type { Deck, DeckRecipe, Player, StackRecipe } from '@/models/karuta';
import type { ProtopediaInMemoryRepository } from '@f88/promidas';
import { useCallback, useEffect, useMemo, useState } from 'react';

const SESSION_STORAGE_KEY = 'pp-karuta-deck-setup';

type SavedSetupState = {
  selectedDeckRecipeId: string | null;
  selectedStackRecipeId: string | null;
  selectedPlayerIds: string[];
  selectedPlayMode: PlayMode | null;
  selectedTatamiSize: TatamiSize;
};

function saveSetupState(state: SavedSetupState) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save setup state:', error);
  }
}

function loadSetupState(): SavedSetupState | null {
  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load setup state:', error);
    return null;
  }
}

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

  // TatamiSize state
  selectedTatamiSize: TatamiSize;
  selectTatamiSize: (size: TatamiSize8 | TatamiSize16) => void;
  availableTatamiSizes: readonly TatamiSize8[] | readonly TatamiSize16[];

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
  // Load saved state
  const savedState = loadSetupState();

  console.log('🔍 useGameSetup initialized with savedState:', savedState);

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
      // Restore from sessionStorage or use default
      if (savedState?.selectedStackRecipeId) {
        const restored = StackRecipeManager.findById(
          savedState.selectedStackRecipeId,
        );
        console.log(
          '🔄 Restoring StackRecipe from sessionStorage:',
          restored?.id,
        );
        return restored || null;
      }
      const defaultRecipe = StackRecipeManager.findById('standard-10');
      console.log('📦 Using default StackRecipe:', defaultRecipe?.id);
      return defaultRecipe || null;
    });

  // Player state
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(() => {
    console.log(
      '🔄 Restoring selectedPlayerIds from sessionStorage:',
      savedState?.selectedPlayerIds,
    );
    return savedState?.selectedPlayerIds || [];
  });

  // PlayMode state
  const [selectedPlayMode, setSelectedPlayMode] = useState<PlayMode | null>(
    () => {
      console.log(
        '🔄 Restoring selectedPlayMode from sessionStorage:',
        savedState?.selectedPlayMode,
      );
      return savedState?.selectedPlayMode || 'touch';
    },
  );

  // TatamiSize state
  const [selectedTatamiSize, setSelectedTatamiSize] = useState<TatamiSize>(
    () => {
      console.log(
        '🔄 Restoring selectedTatamiSize from sessionStorage:',
        savedState?.selectedTatamiSize,
      );
      return savedState?.selectedTatamiSize || DEFAULT_TATAMI_SIZE;
    },
  );

  // Error & loading state
  const [error, setError] = useState<string | null>(null);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  // Load available players on mount
  useEffect(() => {
    const loadPlayers = async () => {
      const players = await PlayerManager.loadPlayers();
      if (players && players.length > 0) {
        setAvailablePlayers(players);
        // Auto-select first player if any players exist
        setSelectedPlayerIds([players[0].id]);
      } else {
        // No players exist, create a default player
        const defaultPlayer = PlayerManager.createPlayer(
          `player-${Date.now()}`,
          'Player 1',
        );
        const newPlayers = [defaultPlayer];
        setAvailablePlayers(newPlayers);
        setSelectedPlayerIds([defaultPlayer.id]);
        // Save to storage
        await PlayerManager.savePlayers(newPlayers);
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

  // Restore deck recipe from sessionStorage when repository becomes available
  useEffect(() => {
    const savedState = loadSetupState();
    console.log('🔍 Checking deck restoration:', {
      hasRepository: !!repository,
      savedDeckRecipeId: savedState?.selectedDeckRecipeId,
      currentDeckRecipe: selectedDeckRecipe?.id,
    });

    if (repository && savedState?.selectedDeckRecipeId && !selectedDeckRecipe) {
      const recipe = DeckRecipeManager.RECIPES.find(
        (r) => r.id === savedState.selectedDeckRecipeId,
      );
      if (recipe) {
        console.log('🔄 Restoring deck recipe from sessionStorage:', recipe.id);
        void selectDeckRecipe(recipe);
      } else {
        console.warn(
          '⚠️ Saved deck recipe not found:',
          savedState.selectedDeckRecipeId,
        );
      }
    }
    // selectDeckRecipe is intentionally not in dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repository, selectedDeckRecipe]);

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
    // selectDeckRecipe is intentionally not in dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repository, selectedDeckRecipe, generatedDeck, isDeckLoading]);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const state: SavedSetupState = {
      selectedDeckRecipeId: selectedDeckRecipe?.id || null,
      selectedStackRecipeId: selectedStackRecipe?.id || null,
      selectedPlayerIds,
      selectedPlayMode,
      selectedTatamiSize,
    };
    saveSetupState(state);
  }, [
    selectedDeckRecipe,
    selectedStackRecipe,
    selectedPlayerIds,
    selectedPlayMode,
    selectedTatamiSize,
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
  const togglePlayer = useCallback(
    (playerId: string) => {
      setSelectedPlayerIds((prev) => {
        const newPlayerIds = prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId];

        // If keyboard mode and player count becomes 3+, restrict tatami size
        if (
          selectedPlayMode === 'keyboard' &&
          newPlayerIds.length >= 3 &&
          (selectedTatamiSize === 12 || selectedTatamiSize === 16)
        ) {
          setSelectedTatamiSize(8);
        }

        return newPlayerIds;
      });
      setError(null);
    },
    [selectedPlayMode, selectedTatamiSize],
  );

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

    // Update selected players
    setSelectedPlayerIds((prev) => {
      const newPlayerIds = [...prev, newPlayer.id];

      // If keyboard mode and player count becomes 3+, restrict tatami size
      if (
        selectedPlayMode === 'keyboard' &&
        newPlayerIds.length >= 3 &&
        (selectedTatamiSize === 12 || selectedTatamiSize === 16)
      ) {
        setSelectedTatamiSize(8);
      }

      return newPlayerIds;
    });

    setError(null);
  }, [availablePlayers, selectedPlayMode, selectedTatamiSize]);

  // Select PlayMode
  const selectPlayMode = useCallback(
    (mode: PlayMode) => {
      setSelectedPlayMode(mode);
      setError(null);

      // If switching to keyboard mode with 3+ players, restrict tatami size to 4 or 8
      if (mode === 'keyboard' && selectedPlayerIds.length >= 3) {
        if (selectedTatamiSize === 12 || selectedTatamiSize === 16) {
          setSelectedTatamiSize(8);
        }
      }
    },
    [selectedPlayerIds.length, selectedTatamiSize],
  );

  // Select TatamiSize
  const selectTatamiSize = useCallback((size: TatamiSize) => {
    setSelectedTatamiSize(size);
    setError(null);
  }, []);

  // Get available tatami sizes based on play mode and player count
  const availableTatamiSizes = useMemo(() => {
    if (selectedPlayMode === 'keyboard') {
      switch (selectedPlayerIds.length) {
        case 1:
          return TATAMI_SIZES_16;
        case 2:
          return TATAMI_SIZES_16;
        case 3:
          return TATAMI_SIZES_8;
        case 4:
          return TATAMI_SIZES_8;
        default:
          return TATAMI_SIZES_8;
      }
    }
  }, [selectedPlayMode, selectedPlayerIds.length]);

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
        selectedTatamiSize, // Use selected tatami size
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
    selectedTatamiSize,
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
    selectedTatamiSize,
    selectTatamiSize,
    availableTatamiSizes: availableTatamiSizes ?? ([4, 8, 12, 16] as const),
    canStartGame,
    createGameState,
    error,
    isCreatingGame,
  };
}
