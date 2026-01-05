/**
 * @fileoverview Hook for managing game setup workflow and state persistence.
 * Handles deck generation, stack creation, player management, and game initialization
 * with session storage integration for state restoration across page reloads.
 */

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
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { ListPrototypesParams } from 'protopedia-api-v2-client';
import { useCallback, useEffect, useMemo, useState } from 'react';

const SESSION_STORAGE_KEY = 'pp-karuta-deck-setup';

/**
 * State structure for persisting game setup to session storage.
 * Allows restoration of user selections after page reload.
 */
type SavedSetupState = {
  /** ID of the selected deck recipe, or null if none selected */
  selectedDeckRecipeId: string | null;
  /** ID of the selected stack recipe, or null if none selected */
  selectedStackRecipeId: string | null;
  /** Array of IDs for selected players */
  selectedPlayerIds: string[];
  /** Selected play mode (touch/keyboard), or null if none selected */
  selectedPlayMode: PlayMode | null;
  /** Selected tatami mat size */
  selectedTatamiSize: TatamiSize;
};

/**
 * Compares two ListPrototypesParams objects for deep equality.
 *
 * Used to determine if API parameters have changed, allowing the hook to reuse
 * cached repository snapshots when possible and avoid redundant API calls.
 *
 * @param a - First API parameters object to compare
 * @param b - Second API parameters object to compare
 * @returns true if all relevant fields match, false otherwise
 */
function areApiParamsEqual(
  a: ListPrototypesParams,
  b: ListPrototypesParams,
): boolean {
  return (
    a.offset === b.offset &&
    a.limit === b.limit &&
    a.userNm === b.userNm &&
    a.materialNm === b.materialNm &&
    a.tagNm === b.tagNm &&
    a.eventNm === b.eventNm
  );
}

/**
 * Generate a deck from a recipe with snapshot optimization.
 * Reuses repository snapshot if apiParams haven't changed, otherwise fetches new data.
 *
 * @param repository - The repository instance to fetch prototypes from
 * @param recipe - The deck recipe containing apiParams and optional filter function
 * @param lastApiParams - Previous API params for optimization (null if first call or no cache)
 * @returns Object containing the generated deck and the API params that were used
 * @returns Object.deck - The generated deck as a Map of prototype IDs to prototypes
 * @returns Object.usedApiParams - The API parameters used for this generation (for caching)
 * @throws {Error} If repository snapshot retrieval fails
 * @throws {Error} If API call to fetch prototypes fails
 * @throws {Error} If deck creation from prototypes fails
 */
async function generateDeckWithOptimization(
  repository: ProtopediaInMemoryRepository,
  recipe: DeckRecipe,
  lastApiParams: ListPrototypesParams | null,
): Promise<{
  deck: Deck;
  usedApiParams: ListPrototypesParams;
}> {
  console.log(
    '🔨 [generateDeckWithOptimization] Starting for recipe:',
    recipe.id,
  );

  // Check if apiParams are identical to avoid redundant API calls
  const canReuseSnapshot =
    lastApiParams !== null &&
    areApiParamsEqual(lastApiParams, recipe.apiParams);

  console.info(
    '🔍 [generateDeckWithOptimization] canReuseSnapshot:',
    canReuseSnapshot,
  );

  let prototypes: readonly NormalizedPrototype[];
  if (canReuseSnapshot) {
    console.debug(
      '♻️ Reusing repository snapshot (same apiParams), applying filter...',
    );
    // Reuse existing snapshot without making API call
    prototypes = await repository.getAllFromSnapshot();
  } else {
    console.debug('🌐 Fetching new data from API (apiParams changed)');
    // Different apiParams, make API call
    prototypes = await DeckManager.getPrototypesFromRecipe(recipe, repository);
  }

  console.debug(
    '📊 [generateDeckWithOptimization] Fetched prototypes:',
    prototypes.length,
  );

  const deck = DeckManager.createDeckWithFilter(prototypes, recipe.filter);

  console.info(
    '✅ [generateDeckWithOptimization] Created deck with',
    deck.size,
    'cards',
  );

  return {
    deck,
    usedApiParams: recipe.apiParams,
  };
}

/**
 * Persists the current game setup state to session storage.
 *
 * Allows state restoration after page reload. Errors are caught and logged
 * to prevent disruption of game setup flow.
 *
 * @param state - The setup state to save
 */
function saveSetupState(state: SavedSetupState) {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save setup state:', error);
  }
}

/**
 * Loads previously saved game setup state from session storage.
 *
 * Returns null if no saved state exists or if parsing fails. Errors are
 * caught and logged to prevent disruption of game setup flow.
 *
 * @returns The saved setup state, or null if unavailable or invalid
 */
function loadSetupState(): SavedSetupState | null {
  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load setup state:', error);
    return null;
  }
}

/**
 * Return value from the useGameSetup hook.
 * Provides comprehensive game setup state and control functions.
 */
export type UseGameSetupReturn = {
  // Deck state
  /** The generated deck map (prototype ID to prototype), or null if not yet generated */
  generatedDeck: Deck | null;
  /** Currently selected deck recipe, or null if none selected */
  selectedDeckRecipe: DeckRecipe | null;
  /** Function to select a deck recipe and trigger deck generation */
  selectDeckRecipe: (recipe: DeckRecipe) => Promise<void>;
  /** Whether a deck is currently being generated */
  isDeckLoading: boolean;
  /** ID of the deck recipe currently being loaded, or null */
  loadingDeckRecipeId: string | null;

  // Stack state
  /** The generated stack (array of prototype indices), or null if not yet generated */
  generatedStack: number[] | null;
  /** Currently selected stack recipe, or null if none selected */
  selectedStackRecipe: StackRecipe | null;
  /** Function to select a stack recipe and trigger stack generation */
  selectStackRecipe: (recipe: StackRecipe) => void;

  // Player state
  /** All available players in the system */
  availablePlayers: Player[];
  /** IDs of currently selected players */
  selectedPlayerIds: string[];
  /** Function to toggle a player's selection state */
  togglePlayer: (playerId: string) => void;
  /** Function to add a new player to the available players */
  addPlayer: () => Promise<void>;

  // PlayMode state
  /** Currently selected play mode (touch/keyboard), or null if none selected */
  selectedPlayMode: PlayMode | null;
  /** Function to select a play mode */
  selectPlayMode: (mode: PlayMode) => void;

  // TatamiSize state
  /** Currently selected tatami mat size */
  selectedTatamiSize: TatamiSize;
  /** Function to select a tatami size */
  selectTatamiSize: (size: TatamiSize8 | TatamiSize16) => void;
  /** Available tatami sizes based on current play mode and player count */
  availableTatamiSizes: readonly TatamiSize8[] | readonly TatamiSize16[];

  // Game creation
  /** Whether all required selections are made and game can be started */
  canStartGame: boolean;
  /** Function to create the game state and trigger game start */
  createGameState: () => Promise<void>;

  // Error & loading
  /** Current error message, or null if no error */
  error: string | null;
  /** Whether game state is currently being created */
  isCreatingGame: boolean;
};

/**
 * Configuration options for the useGameSetup hook.
 */
export type UseGameSetupOptions = {
  /** PROMIDAS repository instance for fetching prototypes, or null if not yet initialized */
  repository: ProtopediaInMemoryRepository | null;
  /** Callback invoked when game state is successfully created */
  onGameStateCreated: (gameState: import('@/models/karuta').GameState) => void;
};

/**
 * Custom React hook for managing the complete game setup workflow.
 *
 * This hook orchestrates the entire game setup process including:
 * - Deck recipe selection and deck generation with API optimization
 * - Stack recipe selection and stack generation
 * - Player management (selection, creation)
 * - Play mode and tatami size configuration
 * - State persistence via session storage
 * - Validation and game state creation
 *
 * Features:
 * - Automatic state restoration from session storage on mount
 * - Smart deck generation that reuses repository snapshots when API params unchanged
 * - Automatic stack regeneration when deck changes
 * - Dynamic tatami size restrictions based on play mode and player count
 * - Comprehensive validation before game creation
 *
 * @param options - Configuration object containing repository and callback
 * @param options.repository - PROMIDAS repository for fetching prototypes
 * @param options.onGameStateCreated - Callback invoked when game is ready to start
 * @returns Object containing all setup state and control functions
 *
 * @example
 * ```tsx
 * function GameSetupScreen() {
 *   const { repository } = usePromidasRepository();
 *   const navigate = useNavigate();
 *
 *   const {
 *     selectDeckRecipe,
 *     selectStackRecipe,
 *     togglePlayer,
 *     selectPlayMode,
 *     canStartGame,
 *     createGameState,
 *     error
 *   } = useGameSetup({
 *     repository,
 *     onGameStateCreated: (gameState) => {
 *       // Navigate to game screen with state
 *       navigate('/game', { state: gameState });
 *     }
 *   });
 *
 *   // Use setup functions...
 * }
 * ```
 */
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
  // Track last used apiParams to avoid redundant API calls
  const [lastApiParams, setLastApiParams] =
    useState<ListPrototypesParams | null>(null);

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

  const selectDeckRecipe = useCallback(
    async (recipe: DeckRecipe) => {
      // 1. Validation
      if (!repository) {
        setError('Repository is not initialized');
        return;
      }

      // 2. Early return if same recipe is already selected
      if (selectedDeckRecipe?.id === recipe.id && generatedDeck !== null) {
        console.log(
          '📦 Same DeckRecipe selected, reusing existing Deck:',
          recipe.id,
        );
        setIsDeckLoading(false);
        return;
      }

      // 3. Set loading state
      setIsDeckLoading(true);
      setLoadingDeckRecipeId(recipe.id);
      setError(null);

      // 4. Generate deck with optimization
      let deck: Deck;
      let usedApiParams: ListPrototypesParams;

      try {
        const result = await generateDeckWithOptimization(
          repository,
          recipe,
          lastApiParams,
        );
        deck = result.deck;
        usedApiParams = result.usedApiParams;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate Deck';
        setError(errorMessage);
        console.error('Failed to generate Deck:', err);
        setIsDeckLoading(false);
        setLoadingDeckRecipeId(null);
        return;
      }

      // 5. Update deck state
      setLastApiParams(usedApiParams);
      setGeneratedDeck(deck);
      setSelectedDeckRecipe(recipe);
      console.log('✅ Deck generated successfully:', deck.size, 'cards');

      // 6. Regenerate stack as side effect
      if (selectedStackRecipe && deck.size > 0) {
        try {
          const stack = StackManager.generate(deck, selectedStackRecipe);
          setGeneratedStack(stack);
          console.log('✅ Stack regenerated:', stack.length, 'cards');
        } catch (stackErr) {
          // Stack generation is non-critical, log error but don't fail
          console.error('Failed to regenerate Stack:', stackErr);
          setGeneratedStack(null);
        }
      } else if (deck.size === 0) {
        setGeneratedStack(null);
        console.log('⚠️ Deck is empty, skipping Stack generation');
      }

      // 7. Clear loading state
      setIsDeckLoading(false);
      setLoadingDeckRecipeId(null);
    },
    [
      repository,
      selectedDeckRecipe?.id,
      generatedDeck,
      selectedStackRecipe,
      lastApiParams,
    ],
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
