import { RepoSetup } from '@/components/layout/repo-setup';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { PlayMode, TatamiSize } from '@/lib/karuta';
import type { Deck, DeckRecipe, Player, StackRecipe } from '@/models/karuta';
import type { ScreenSize } from '@/types/screen-size';
import { DeckRecipeSelector } from './deck-recipe-selector';
import { GameSetupSummary } from './game-setup-summary';
import { PlayModeSelector } from './play-mode-selector';
import { PlayersSelector } from './players-selector';
import { SectionWrapper } from './section-wrapper';
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
  availableTatamiSizes: readonly TatamiSize[];

  // Start game
  onStartGame: () => void;
  canStartGame: boolean;

  // Loading & error
  isLoading: boolean;
  error: string | null;

  // Intro
  onShowIntro?: () => void;

  // Screen size
  screenSize: ScreenSize;
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
  availableTatamiSizes,
  onStartGame,
  canStartGame,
  isLoading,
  error,
  // onShowIntro,
  screenSize,
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
          <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl lg:text-4xl dark:text-gray-100">
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
              <p className="text-xs md:text-sm">{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Sections displayed sequentially */}
        <div className="space-y-6">
          {/* Section: PlayMode */}
          <SectionWrapper
            title="入力方式"
            variant="primary"
            screenSize={screenSize}
          >
            <PlayModeSelector
              selectedPlayMode={selectedPlayMode}
              onSelectPlayMode={onSelectPlayMode}
              isLoading={isLoading}
              screenSize={screenSize}
            />
          </SectionWrapper>

          {/* Section: Players */}
          <SectionWrapper
            title="プレイヤー"
            variant="success"
            screenSize={screenSize}
          >
            <PlayersSelector
              availablePlayers={availablePlayers}
              selectedPlayerIds={selectedPlayerIds}
              onTogglePlayer={onTogglePlayer}
              onAddPlayer={onAddPlayer}
              isLoading={isLoading}
              screenSize={screenSize}
            />
          </SectionWrapper>

          {/* Section: TatamiSize */}
          <SectionWrapper
            title="畳サイズ"
            variant="warning"
            screenSize={screenSize}
          >
            <TatamiSizeSelector
              selectedTatamiSize={selectedTatamiSize}
              onSelectTatamiSize={onSelectTatamiSize}
              availableSizes={availableTatamiSizes}
              isLoading={isLoading}
              screenSize={screenSize}
            />
          </SectionWrapper>

          {/* Section: DeckRecipe */}
          <SectionWrapper
            title="デッキ"
            variant="danger"
            screenSize={screenSize}
          >
            {!isRepoReady && (
              <div className="flex justify-center py-8">
                <RepoSetup screenSize={screenSize} />
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
                screenSize={screenSize}
              />
            )}
          </SectionWrapper>

          {/* Section: StackRecipe */}
          {isRepoReady && (
            <SectionWrapper
              title="札数"
              variant="secondary"
              screenSize={screenSize}
            >
              <StackRecipeSelector
                stackRecipes={stackRecipes}
                selectedStackRecipe={selectedStackRecipe}
                onSelectStackRecipe={onSelectStackRecipe}
                isLoading={isLoading}
                generatedStack={generatedStack}
                generatedDeck={generatedDeck}
                screenSize={screenSize}
              />
            </SectionWrapper>
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
          screenSize={screenSize}
        />

        {/* Start Game Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onStartGame}
            disabled={!canStartGame || isLoading}
            size="lg"
            className="h-12 px-8 text-base font-bold md:h-14 md:px-10 md:text-lg lg:h-16 lg:px-12 lg:text-xl"
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
