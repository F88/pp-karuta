import type { NormalizedPrototype } from '@f88/promidas/types';
import type { Deck, GamePlayerState } from '@/models/karuta';
import { GameHeader } from './game-header';
import { YomiFudaDisplay } from './yomi-fuda-display';
import { SharedTatami } from './shared-tatami';
import { PlayerTatami } from './player-tatami';
import { DeckManager } from '@/lib/karuta/deck/deck-manager';

export type TatamiViewPresentationProps = {
  yomiFuda: NormalizedPrototype;
  sharedTatamiCards: NormalizedPrototype[];
  playerStates: GamePlayerState[];
  deck: Deck;
  currentRace: number;
  totalRaces: number;
  stackCount: number;
  onPlayerCardSelect: (playerId: string, card: NormalizedPrototype) => void;
};

export function TatamiViewPresentation({
  yomiFuda,
  sharedTatamiCards,
  playerStates,
  deck,
  currentRace,
  totalRaces,
  stackCount,
  onPlayerCardSelect,
}: TatamiViewPresentationProps) {
  // Calculate total stats from all players
  const totalScore = playerStates.reduce((sum, ps) => sum + ps.score, 0);
  const totalMochiFuda = playerStates.reduce(
    (sum, ps) => sum + ps.mochiFuda.length,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="mx-auto max-w-7xl">
        <GameHeader
          currentRace={currentRace}
          totalRaces={totalRaces}
          score={totalScore}
          mochiFudaCount={totalMochiFuda}
          stackCount={stackCount}
          tatamiCount={sharedTatamiCards.length}
        />

        <YomiFudaDisplay yomiFuda={yomiFuda} />

        <SharedTatami tatamiCards={sharedTatamiCards} />

        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            🎮 Player Tatami Areas
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
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
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
