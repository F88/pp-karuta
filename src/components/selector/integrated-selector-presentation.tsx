import type { DeckRecipe, StackRecipe, Player, Deck } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { StackRecipeCard } from '@/components/stackRecipe/stack-recipe-card';
import { PlayerSelectionCard } from '@/components/player/player-selection-card';
import { Keyboard, Smartphone } from 'lucide-react';

export type IntegratedSelectorPresentationProps = {
  // PlayMode selection
  selectedPlayMode: PlayMode | null;
  onSelectPlayMode: (mode: PlayMode) => void;

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:from-gray-900 dark:to-gray-800">
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

        {/* Grid layout for all sections */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Section 1: PlayMode */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              1. 入力方式
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                onClick={() => onSelectPlayMode('keyboard')}
                disabled={isLoading}
                variant={
                  selectedPlayMode === 'keyboard' ? 'default' : 'outline'
                }
                className={`h-auto p-6 ${
                  selectedPlayMode === 'keyboard'
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : ''
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Keyboard className="h-12 w-12" />
                  <span className="text-lg font-semibold">Keyboard</span>
                  <span className="text-xs">PC環境向け</span>
                </div>
              </Button>

              <Button
                onClick={() => onSelectPlayMode('touch')}
                disabled={isLoading}
                variant={selectedPlayMode === 'touch' ? 'default' : 'outline'}
                className={`h-auto p-6 ${
                  selectedPlayMode === 'touch'
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : ''
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Smartphone className="h-12 w-12" />
                  <span className="text-lg font-semibold">Touch</span>
                  <span className="text-xs">モバイル向け</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Section 2: DeckRecipe */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              2. Deck Recipe
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {deckRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={onSelectDeckRecipe}
                  isSelected={selectedDeckRecipe?.id === recipe.id}
                  isLoading={isDeckLoading}
                  isLoadingThisRecipe={loadingDeckRecipeId === recipe.id}
                />
              ))}
            </div>
            {generatedDeck && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                  ✓ Deck生成完了: {generatedDeck.size}枚
                </p>
              </div>
            )}
          </div>

          {/* Section 3: StackRecipe */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              3. Stack Recipe (枚数)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {stackRecipes.map((recipe) => (
                <StackRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={onSelectStackRecipe}
                  isSelected={selectedStackRecipe?.id === recipe.id}
                  isLoading={isLoading}
                />
              ))}
            </div>
            {generatedStack && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                  ✓ Stack生成完了: {generatedStack.length}枚
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Players */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              4. プレイヤー選択
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {availablePlayers.map((player) => (
                <PlayerSelectionCard
                  key={player.id}
                  player={player}
                  isSelected={selectedPlayerIds.includes(player.id)}
                  onToggle={onTogglePlayer}
                  isDisabled={isLoading}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        {canStartGame && (
          <div className="mt-8 rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-700 dark:bg-indigo-950">
            <h3 className="mb-4 text-lg font-bold text-indigo-900 dark:text-indigo-100">
              📋 選択内容
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  入力方式:
                </span>
                <span className="text-sm text-indigo-900 dark:text-indigo-100">
                  {selectedPlayMode === 'keyboard' ? '⌨️ Keyboard' : '📱 Touch'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Deck Recipe:
                </span>
                <span className="text-sm text-indigo-900 dark:text-indigo-100">
                  {selectedDeckRecipe?.title}
                  {generatedDeck && (
                    <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">
                      ({generatedDeck.size}枚)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Stack Recipe:
                </span>
                <span className="text-sm text-indigo-900 dark:text-indigo-100">
                  {selectedStackRecipe?.title}
                  {stackSize !== null && (
                    <span className="ml-1 text-xs text-indigo-600 dark:text-indigo-400">
                      ({stackSize}枚)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  プレイヤー:
                </span>
                <span className="text-sm text-indigo-900 dark:text-indigo-100">
                  {selectedPlayerIds.length}人
                </span>
              </div>
            </div>
          </div>
        )}

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
