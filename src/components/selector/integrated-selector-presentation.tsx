import type { DeckRecipe, StackRecipe, Player, Deck } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import { Button } from '@/components/ui/button';
import { GameSetupSummary } from './game-setup-summary';
import { RepoSetup } from '@/components/layout/repo-setup';
import { PlayModeSelector } from './play-mode-selector';
import { PlayersSelector } from './players-selector';
import { DeckRecipeSelector } from './deck-recipe-selector';
import { StackRecipeSelector } from './stack-recipe-selector';

export type IntegratedSelectorPresentationProps = {
  // PlayMode selection
  selectedPlayMode: PlayMode | null;
  onSelectPlayMode: (mode: PlayMode) => void;

  // Repository state
  isRepoReady: boolean;

  // DeckRecipe selection
  deckRecipes: DeckRecipe[];
  selectedDeckRecipe: DeckRecipe | null;
  onSelectDeckRecipe: (recipe: DeckRecipe) => void;
  isDeckLoading: boolean;
  loadingDeckRecipeId: string | null;
  generatedDeck: Deck | null;

  // StackRecipe selection
  stackRecipes: StackRecipe[];
  selectedStackRecipe: StackRecipe | null;
  onSelectStackRecipe: (recipe: StackRecipe) => void;
  generatedStack: number[] | null;

  // Players selection
  availablePlayers: Player[];
  selectedPlayerIds: string[];
  onTogglePlayer: (playerId: string) => void;

  // Start game
  onStartGame: () => void;
  canStartGame: boolean;

  // Loading & error
  isLoading: boolean;
  error: string | null;

  // Intro
  onShowIntro?: () => void;
};

export function IntegratedSelectorPresentation({
  selectedPlayMode,
  onSelectPlayMode,
  isRepoReady,
  deckRecipes,
  selectedDeckRecipe,
  onSelectDeckRecipe,
  isDeckLoading,
  loadingDeckRecipeId,
  generatedDeck,
  stackRecipes,
  selectedStackRecipe,
  onSelectStackRecipe,
  generatedStack,
  availablePlayers,
  selectedPlayerIds,
  onTogglePlayer,
  onStartGame,
  canStartGame,
  isLoading,
  error,
  onShowIntro,
}: IntegratedSelectorPresentationProps) {
  // Calculate expected stack size (use actual if available)
  const stackSize = generatedStack
    ? generatedStack.length
    : generatedDeck && selectedStackRecipe
      ? selectedStackRecipe.maxSize === 'all'
        ? generatedDeck.size
        : Math.min(selectedStackRecipe.maxSize, generatedDeck.size)
      : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">
            🎴 PP Karuta
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            ゲーム設定を選択してください
          </p>
          {onShowIntro && (
            <Button
              onClick={onShowIntro}
              variant="link"
              className="mt-2 text-sm"
            >
              📖 INTRO を表示
            </Button>
          )}
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
            <p className="font-semibold">エラーが発生しました:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Sections displayed sequentially */}
        <div className="space-y-8">
          {/* Section 1: PlayMode */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              1. 入力方式
            </h2>
            <PlayModeSelector
              selectedPlayMode={selectedPlayMode}
              onSelectPlayMode={onSelectPlayMode}
              isLoading={isLoading}
            />
          </div>

          {/* Section 2: Players */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              2. プレイヤー選択
            </h2>
            <PlayersSelector
              availablePlayers={availablePlayers}
              selectedPlayerIds={selectedPlayerIds}
              onTogglePlayer={onTogglePlayer}
              isLoading={isLoading}
            />
          </div>

          {/* Section 3: DeckRecipe */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              3. Deck Recipe
            </h2>

            {!isRepoReady && (
              <div className="flex justify-center py-8">
                <RepoSetup />
              </div>
            )}

            {isRepoReady && (
              <DeckRecipeSelector
                deckRecipes={deckRecipes}
                selectedDeckRecipe={selectedDeckRecipe}
                onSelectDeckRecipe={onSelectDeckRecipe}
                isDeckLoading={isDeckLoading}
                loadingDeckRecipeId={loadingDeckRecipeId}
                generatedDeck={generatedDeck}
              />
            )}
          </div>

          {/* Section 4: StackRecipe */}
          {isRepoReady && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                4. Stack Recipe (枚数)
              </h2>
              <StackRecipeSelector
                stackRecipes={stackRecipes}
                selectedStackRecipe={selectedStackRecipe}
                onSelectStackRecipe={onSelectStackRecipe}
                isLoading={isLoading}
                generatedStack={generatedStack}
                generatedDeck={generatedDeck}
              />
            </div>
          )}
        </div>

        {/* Selection Summary */}
        <GameSetupSummary
          selectedPlayMode={selectedPlayMode}
          selectedDeckRecipe={selectedDeckRecipe}
          generatedDeck={generatedDeck}
          selectedStackRecipe={selectedStackRecipe}
          stackSize={stackSize}
          selectedPlayerCount={selectedPlayerIds.length}
        />

        {/* Start Game Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onStartGame}
            disabled={!canStartGame || isLoading}
            size="lg"
            className="h-16 px-12 text-xl font-bold"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent" />
                Loading...
              </>
            ) : (
              'ゲーム開始'
            )}
          </Button>
        </div>

        {!canStartGame && (
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            全ての項目を選択してください
          </p>
        )}
      </div>
    </div>
  );
}
