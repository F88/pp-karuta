import type { Deck, DeckRecipe, Player, StackRecipe } from '@/models/karuta';

import type { ScreenSize } from '@/types/screen-size';

import type { PlayMode, TatamiSize } from '@/lib/karuta';

import { RepoSetup } from '@/components/layout/repo-setup';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DeckRecipeSelector } from './deck-recipe-selector';
import { GameSetupSummary } from './game-setup-summary';
import { PlayModeSelector } from './play-mode-selector';
import { PlayersSelector } from './players-selector';
import { SectionWrapper } from './section-wrapper';
import { StackRecipeSelector } from './stack-recipe-selector';
import { TatamiSizeSelector } from './tatami-size-selector';
import { getResponsiveStyles } from '@/lib/ui-utils';

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
  const sizeStyles = getResponsiveStyles(screenSize, {
    smartphone: {
      padding: 'p-4',
      titleMargin: 'mb-4',
      title: {
        size: 'text-2xl',
      },
      sectionSpacing: 'space-y-4',
      buttonMargin: 'mt-4',
      button: {
        height: 'h-12',
        padding: 'px-8',
        text: 'text-base',
      },
      noteMargin: 'mt-4',
      noteText: 'text-sm',
    },
    tablet: {
      padding: 'p-4',
      titleMargin: 'mb-4',
      title: {
        size: 'text-3xl',
      },
      sectionSpacing: 'space-y-6',
      buttonMargin: 'mt-8',
      button: {
        height: 'h-14',
        padding: 'px-10',
        text: 'text-lg',
      },
      noteMargin: 'mt-4',
      noteText: 'text-sm',
    },
    pc: {
      padding: 'p-8',
      titleMargin: 'mb-8',
      title: {
        size: 'text-4xl',
      },
      sectionSpacing: 'space-y-8',
      buttonMargin: 'mt-8',
      button: {
        height: 'h-16',
        padding: 'px-12',
        text: 'text-xl',
      },
      noteMargin: 'mt-4',
      noteText: 'text-sm',
    },
    responsive: {
      padding: 'p-4',
      titleMargin: 'mb-8',
      title: {
        size: 'text-2xl md:text-3xl lg:text-4xl',
      },
      sectionSpacing: 'space-y-6',
      buttonMargin: 'mt-8',
      button: {
        height: 'h-12 md:h-14 lg:h-16',
        padding: 'px-8 md:px-10 lg:px-12',
        text: 'text-base md:text-lg lg:text-xl',
      },
      noteMargin: 'mt-4',
      noteText: 'text-sm',
    },
  });

  // Calculate expected stack size (use actual if available)
  const stackSize = stackRecipe.generatedStack
    ? stackRecipe.generatedStack.length
    : deckRecipe.generatedDeck && stackRecipe.selected
      ? stackRecipe.selected.maxSize === 'all'
        ? deckRecipe.generatedDeck.size
        : Math.min(stackRecipe.selected.maxSize, deckRecipe.generatedDeck.size)
      : null;

  return (
    <div
      className={`min-h-screen bg-linear-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 ${sizeStyles.padding}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className={`text-center ${sizeStyles.titleMargin}`}>
          <h1
            className={`mb-2 font-bold text-gray-800 dark:text-gray-100 ${sizeStyles.title.size}`}
          >
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
        <div className={sizeStyles.sectionSpacing}>
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
                // enableGrouping={false}
                initialOpenCategories={
                  deckRecipe.selected ? deckRecipe.selected.tags : ['干支']
                }
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
        </div>

        {/* Start Game Button */}
        <div className={`flex justify-center ${sizeStyles.buttonMargin}`}>
          <Button
            onClick={game.onStart}
            disabled={!game.canStart || state.isLoading}
            size="lg"
            className={`font-bold ${sizeStyles.button.height} ${sizeStyles.button.padding} ${sizeStyles.button.text}`}
          >
            {state.isLoading ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent" />
                Loading...
              </>
            ) : (
              'START'
            )}
          </Button>
        </div>

        {!game.canStart && (
          <p
            className={`text-center text-gray-500 dark:text-gray-400 ${sizeStyles.noteMargin} ${sizeStyles.noteText}`}
          >
            全ての項目を選択してください
          </p>
        )}
      </div>
    </div>
  );
}
