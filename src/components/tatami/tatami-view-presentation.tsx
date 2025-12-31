import { DeckManager } from '@/lib/karuta/deck/deck-manager';
import type { Deck, GamePlayerState } from '@/models/karuta';
import type { PlayMode } from '@/lib/karuta';
import type { NormalizedPrototype } from '@f88/promidas/types';
import type { ScreenSize } from '@/types/screen-size';
import { GameHeader } from './game-header';
import { PlayerTatami } from './player-tatami';
import { SharedTatami } from './shared-tatami';
// import { YomiFudaCard } from './yomi-fuda-card';
// import { YomiFudaMarquee } from './yomi-fuda-marquee';
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

  const getPlayerGridCols = () => {
    // Keyboard mode: always match player count
    if (playMode === 'keyboard') {
      if (playerCount === 1) return 'grid-cols-1';
      if (playerCount === 2) return 'grid-cols-2';
      if (playerCount === 3) return 'grid-cols-3';
      if (playerCount === 4) return 'grid-cols-4';
      return 'grid-cols-4'; // 5+ players: max 4 columns
    }

    // Touch mode: simple layout
    // 1 player: 1 column, 2+ players: 2 columns
    if (playerCount === 1) {
      return 'grid-cols-1';
    }
    return 'grid-cols-2';
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-green-50 to-teal-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden">
        <GameHeader
          currentRace={currentRace}
          totalRaces={totalRaces}
          score={totalScore}
          mochiFudaCount={totalMochiFuda}
          stackCount={stackCount}
          tatamiCount={sharedTatamiCards.length}
          screenSize={screenSize}
        />

        {/* Top section: Shared Tatami + YomiFuda (natural height) */}
        <div className="my-8 flex-shrink-0 space-y-6">
          {playMode !== 'touch' && (
            <SharedTatami
              tatamiCards={sharedTatamiCards}
              playMode={playMode}
              screenSize={screenSize}
            />
          )}
          {/* <YomiFudaCard normalizedPrototype={yomiFuda} /> */}
          {/* <YomiFudaMarquee normalizedPrototype={yomiFuda} /> */}
          <Yomite
            key={yomiFuda.id}
            normalizedPrototype={yomiFuda}
            screenSize={screenSize}
          />
        </div>

        {/* Bottom section: Player Tatami Areas (takes remaining height) */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* <h2 className="mb-4 flex-shrink-0 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
            🎮 Player Tatami Areas
          </h2> */}
          <div className="flex-1 overflow-y-auto">
            <div className={`grid gap-4 ${getPlayerGridCols()}`}>
              {playerStates.map((playerState) => {
                const playerTatamiCards = DeckManager.getByIds(
                  deck,
                  playerState.tatami,
                );
                return (
                  <PlayerTatami
                    key={playerState.player.id}
                    player={playerState.player}
                    tatamiCards={playerTatamiCards}
                    onCardClick={(card) =>
                      onPlayerCardSelect(playerState.player.id, card)
                    }
                    mochiFudaCount={playerState.mochiFuda.length}
                    score={playerState.score}
                    playMode={playMode}
                    screenSize={screenSize}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
