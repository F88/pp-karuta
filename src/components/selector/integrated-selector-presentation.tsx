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
  playMode: {
    selected: PlayMode | null;
    onSelect: (mode: PlayMode) => void;
  };

  repository: {
    isReady: boolean;
  };

  deckRecipe: {
    recipes: DeckRecipe[];
    selected: DeckRecipe | null;
    onSelect: (recipe: DeckRecipe) => void;
    isLoading: boolean;
    loadingRecipeId: string | null;
    generatedDeck: Deck | null;
  };

  stackRecipe: {
    recipes: StackRecipe[];
    selected: StackRecipe | null;
    onSelect: (recipe: StackRecipe) => void;
    generatedStack: number[] | null;
  };

  players: {
    available: Player[];
    selectedIds: string[];
    onToggle: (playerId: string) => void;
    onAdd: () => void;
  };

  tatamiSize: {
    selected: TatamiSize;
    onSelect: (size: TatamiSize) => void;
    availableSizes: readonly TatamiSize[];
  };

  game: {
    onStart: () => void;
    canStart: boolean;
  };

  state: {
    isLoading: boolean;
    error: string | null;
  };

  onShowIntro?: () => void;
  screenSize: ScreenSize;
};

export function IntegratedSelectorPresentation({
  playMode,
  repository,
  deckRecipe,
  stackRecipe,
  players,
  tatamiSize,
  game,
  state,
  // onShowIntro,
  screenSize,
}: IntegratedSelectorPresentationProps) {
  // Calculate expected stack size (use actual if available)
  const stackSize = stackRecipe.generatedStack
    ? stackRecipe.generatedStack.length
    : deckRecipe.generatedDeck && stackRecipe.selected
      ? stackRecipe.selected.maxSize === 'all'
        ? deckRecipe.generatedDeck.size
        : Math.min(stackRecipe.selected.maxSize, deckRecipe.generatedDeck.size)
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
        {state.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <p className="font-semibold">エラーが発生しました:</p>
              <p className="text-xs md:text-sm">{state.error}</p>
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
              selectedPlayMode={playMode.selected}
              onSelectPlayMode={playMode.onSelect}
              isLoading={state.isLoading}
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
              availablePlayers={players.available}
              selectedPlayerIds={players.selectedIds}
              onTogglePlayer={players.onToggle}
              onAddPlayer={players.onAdd}
              isLoading={state.isLoading}
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
              selectedTatamiSize={tatamiSize.selected}
              onSelectTatamiSize={tatamiSize.onSelect}
              availableSizes={tatamiSize.availableSizes}
              isLoading={state.isLoading}
              screenSize={screenSize}
            />
          </SectionWrapper>

          {/* Section: DeckRecipe */}
          <SectionWrapper
            title="デッキ"
            variant="danger"
            screenSize={screenSize}
          >
            {!repository.isReady && (
              <div className="flex justify-center py-8">
                <RepoSetup screenSize={screenSize} />
              </div>
            )}

            {repository.isReady && (
              <DeckRecipeSelector
                deckRecipes={deckRecipe.recipes}
                selectedDeckRecipe={deckRecipe.selected}
                onSelectDeckRecipe={deckRecipe.onSelect}
                isDeckLoading={deckRecipe.isLoading}
                loadingDeckRecipeId={deckRecipe.loadingRecipeId}
                generatedDeck={deckRecipe.generatedDeck}
                screenSize={screenSize}
              />
            )}
          </SectionWrapper>

          {/* Section: StackRecipe */}
          {repository.isReady && (
            <SectionWrapper
              title="札数"
              variant="secondary"
              screenSize={screenSize}
            >
              <StackRecipeSelector
                stackRecipes={stackRecipe.recipes}
                selectedStackRecipe={stackRecipe.selected}
                onSelectStackRecipe={stackRecipe.onSelect}
                isLoading={state.isLoading}
                generatedStack={stackRecipe.generatedStack}
                generatedDeck={deckRecipe.generatedDeck}
                screenSize={screenSize}
              />
            </SectionWrapper>
          )}
        </div>

        {/* Selection Summary */}
        <GameSetupSummary
          selectedPlayMode={playMode.selected}
          selectedDeckRecipe={deckRecipe.selected}
          generatedDeck={deckRecipe.generatedDeck}
          selectedStackRecipe={stackRecipe.selected}
          stackSize={stackSize}
          selectedPlayerCount={players.selectedIds.length}
          screenSize={screenSize}
        />

        {/* Start Game Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={game.onStart}
            disabled={!game.canStart || state.isLoading}
            size="lg"
            className="h-12 px-8 text-base font-bold md:h-14 md:px-10 md:text-lg lg:h-16 lg:px-12 lg:text-xl"
          >
            {state.isLoading ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent" />
                Loading...
              </>
            ) : (
              'ゲーム開始'
            )}
          </Button>
        </div>

        {!game.canStart && (
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            全ての項目を選択してください
          </p>
        )}
      </div>
    </div>
  );
}
