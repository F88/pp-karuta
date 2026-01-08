import type { NormalizedPrototype } from '@f88/promidas/types';

import type { Deck, GamePlayerState } from '@/models/karuta';

import type { ScreenSize } from '@/types/screen-size';

import type { PlayMode } from '@/lib/karuta';
import { DeckManager } from '@/lib/karuta/deck/deck-manager';
import { getResponsiveStyles } from '@/lib/ui-utils';

import { GameHeader } from './game-header';
import { PlayerArea } from './player-area';
import { SharedTatami } from './shared-tatami';
import { Yomite } from './yomite';

export type TatamiViewPresentationProps = {
  yomiFuda: NormalizedPrototype;
  sharedTatamiCards: NormalizedPrototype[];
  playerStates: GamePlayerState[];
  deck: Deck;
  currentRace: number;
  totalRaces: number;
  stackCount: number;
  playMode: PlayMode;
  onPlayerCardSelect: (playerId: string, card: NormalizedPrototype) => void;
  playerFeedbackStates: Record<string, 'correct' | 'incorrect' | null>;
  screenSize?: ScreenSize;
};

export function TatamiViewPresentation({
  yomiFuda,
  sharedTatamiCards,
  playerStates,
  deck,
  currentRace,
  totalRaces,
  stackCount,
  playMode,
  onPlayerCardSelect,
  playerFeedbackStates,
  screenSize,
}: TatamiViewPresentationProps) {
  // Calculate total stats from all players
  const totalScore = playerStates.reduce((sum, ps) => sum + ps.score, 0);
  const totalMochiFuda = playerStates.reduce(
    (sum, ps) => sum + ps.mochiFuda.length,
    0,
  );

  // Determine grid layout based on player count and screen size
  const playerCount = playerStates.length;

  const styles = getResponsiveStyles(screenSize, {
    smartphone: {
      // containerPadding: 'p-3',
      containerPadding: 'p-0',
      sectionSpacing: 'my-2',
      sharedTatami: {
        padding: 'px-4',
      },
      yomiFuda: {
        padding: 'px-4',
      },
      playerGrid: {
        gap: 'gap-2',
        margin: 'm-0',
        padding: 'px-2',
      },
    },
    tablet: {
      // containerPadding: 'p-4',
      containerPadding: 'p-0',
      sectionSpacing: 'my-3',
      sharedTatami: {
        padding: 'px-12',
      },
      yomiFuda: {
        padding: 'px-12',
      },
      playerGrid: {
        gap: 'gap-2',
        margin: 'm-0',
        padding: 'px-2',
      },
    },
    pc: {
      // containerPadding: 'p-6',
      containerPadding: 'p-0',
      sectionSpacing: 'my-4',
      sharedTatami: {
        padding: 'px-16',
      },
      yomiFuda: {
        padding: 'px-16',
      },
      playerGrid: {
        gap: 'gap-2',
        margin: 'm-0',
        padding: 'px-2',
      },
    },
    responsive: {
      containerPadding: 'p-3 md:p-4 lg:p-6',
      sectionSpacing:
        'my-4 md:my-6 lg:my-8 space-y-3 md:space-y-4 lg:space-y-6',
      sharedTatami: { padding: 'px-2 md:px-4 lg:px-6' },
      yomiFuda: { padding: 'px-2 md:px-4 lg:px-6' },
      playerGrid: {
        gap: 'gap-3 md:gap-4 lg:gap-6',
        margin: 'm-0',
        padding: 'p-2',
      },
    },
  });

  const getPlayerGridCols = () => {
    // Keyboard mode: always match player count
    if (playMode === 'keyboard') {
      if (playerCount === 1) return 'grid-cols-1';
      if (playerCount === 2) return 'grid-cols-2';
      if (playerCount === 3) return 'grid-cols-3';
      if (playerCount === 4) return 'grid-cols-4';
      return 'grid-cols-4'; // 5+ players: max 4 columns
    }

    // Touch mode: screen size based layout
    if (playMode === 'touch') {
      if (screenSize === 'smartphone') {
        if (playerCount <= 2) {
          return 'grid-cols-1';
        } else {
          return 'grid-cols-2';
        }
      } else {
        if (playerCount <= 1) {
          return 'grid-cols-1';
        } else {
          return 'grid-cols-2';
        }
      }
    }
    return 'grid-cols-2';
  };

  return (
    <div
      className={`flex h-full flex-col bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 ${styles.containerPadding}`}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden">
        <div className={`shrink-0 ${styles.sectionSpacing}`}>
          <GameHeader
            currentRace={currentRace}
            totalRaces={totalRaces}
            score={totalScore}
            mochiFudaCount={totalMochiFuda}
            stackCount={stackCount}
            tatamiCount={sharedTatamiCards.length}
            screenSize={screenSize}
          />
        </div>

        {/*  Shared Tatami */}
        {(playMode !== 'touch' ||
          import.meta.env.VITE_DEBUG_MODE === 'true') && (
          <div
            className={`shrink-0 ${styles.sectionSpacing} ${styles.sharedTatami.padding}`}
          >
            <SharedTatami
              tatamiCards={sharedTatamiCards}
              playMode={playMode}
              screenSize={screenSize}
            />
          </div>
        )}

        {/* YomiFuda */}
        <div
          className={`shrink-0 ${styles.sectionSpacing} ${styles.yomiFuda.padding}`}
        >
          {/* <YomiFudaCard normalizedPrototype={yomiFuda} /> */}
          {/* <YomiFudaMarquee normalizedPrototype={yomiFuda} /> */}
          <Yomite
            key={yomiFuda.id}
            normalizedPrototype={yomiFuda}
            screenSize={screenSize}
          />
        </div>

        {/* Bottom section: Player Tatami Areas (takes remaining height) */}
        <div className={`min-h-0 flex-1 ${styles.sectionSpacing}`}>
          <div className="flex h-full flex-col">
            {/* <h2 className="mb-4 flex-shrink-0 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            🎮 Player Tatami Areas
          </h2> */}
            <div
              className={`grid h-full ${styles.playerGrid.gap} ${styles.playerGrid.margin} ${styles.playerGrid.padding} ${getPlayerGridCols()}`}
            >
              {playerStates.map((playerState, playerIndex) => {
                const playerTatamiCards = DeckManager.getByIds(
                  deck,
                  playerState.tatami,
                );
                return (
                  <div key={playerState.player.id} className="min-h-0">
                    <PlayerArea
                      player={playerState.player}
                      playerIndex={playerIndex}
                      playerCount={playerStates.length}
                      tatamiCards={playerTatamiCards}
                      onCardClick={(card) =>
                        onPlayerCardSelect(playerState.player.id, card)
                      }
                      mochiFudaCount={playerState.mochiFuda.length}
                      score={playerState.score}
                      playMode={playMode}
                      feedbackState={
                        playerFeedbackStates[playerState.player.id] ?? null
                      }
                      screenSize={screenSize}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
