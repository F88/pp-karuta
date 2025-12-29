import type { DeckRecipe, StackRecipe, Player, Deck } from '@/models/karuta';
import type { PlayMode, TatamiSize } from '@/lib/karuta';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { GameSetupSummary } from './game-setup-summary';
import { RepoSetup } from '@/components/layout/repo-setup';
import { PlayModeSelector } from './play-mode-selector';
import { PlayersSelector } from './players-selector';
import { DeckRecipeSelector } from './deck-recipe-selector';
import { StackRecipeSelector } from './stack-recipe-selector';
import { TatamiSizeSelector } from './tatami-size-selector';

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
  onAddPlayer: () => void;

  // TatamiSize selection
  selectedTatamiSize: TatamiSize;
  onSelectTatamiSize: (size: TatamiSize) => void;

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
  onAddPlayer,
  selectedTatamiSize,
  onSelectTatamiSize,
  onStartGame,
  canStartGame,
  isLoading,
  error,
  // onShowIntro,
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
            🎴 PP Karuta 26
          </h1>
          {/* <p className="text-lg text-gray-600 dark:text-gray-400">
            ゲーム設定を選択してください
          </p> */}
        </div>

        {/* Error display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <p className="font-semibold">エラーが発生しました:</p>
              <p className="text-sm">{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Sections displayed sequentially */}
        <div className="space-y-8">
          {/* Section 1: PlayMode */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              入力方式
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
              プレイヤー
            </h2>
            <PlayersSelector
              availablePlayers={availablePlayers}
              selectedPlayerIds={selectedPlayerIds}
              onTogglePlayer={onTogglePlayer}
              onAddPlayer={onAddPlayer}
              isLoading={isLoading}
            />
          </div>

          {/* Section 3: DeckRecipe */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              デッキ
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
                札数
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

          {/* Section 5: TatamiSize */}
          {isRepoReady && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                畳サイズ
              </h2>
              <TatamiSizeSelector
                selectedTatamiSize={selectedTatamiSize}
                onSelectTatamiSize={onSelectTatamiSize}
                isLoading={isLoading}
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
