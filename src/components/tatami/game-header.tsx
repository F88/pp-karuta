import { Badge } from '@/components/ui/badge';

export type GameHeaderProps = {
  currentRace: number;
  totalRaces: number;
  score: number;
  mochiFudaCount: number;
  stackCount: number;
  tatamiCount: number;
};

export function GameHeader({
  currentRace,
  totalRaces,
  score,
  mochiFudaCount,
  stackCount,
  tatamiCount,
}: GameHeaderProps) {
  return (
    <div className="mb-4 text-center">
      <h1 className="mb-2 text-3xl font-bold text-gray-800">🎴 Karuta</h1>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:gap-4 sm:text-base md:text-lg">
        <span>
          Race {currentRace} / {totalRaces}
        </span>
        <span className="hidden text-gray-400 sm:inline">•</span>
        <span className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold text-yellow-600">Score:</span>
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            {score} pts
          </Badge>
        </span>
        <span className="hidden text-gray-400 sm:inline">•</span>
        <span className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold text-pink-600">MochiFuda:</span>
          <Badge variant="outline" className="bg-pink-100 text-pink-700">
            {mochiFudaCount} cards
          </Badge>
        </span>
        <span className="hidden text-gray-400 sm:inline">•</span>
        <span className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold text-indigo-600">Stack:</span>
          <Badge variant="outline" className="bg-indigo-100 text-indigo-700">
            {stackCount} remaining
          </Badge>
        </span>
        <span className="hidden text-gray-400 sm:inline">•</span>
        <span className="flex items-center gap-1 sm:gap-2">
          <span className="font-semibold text-green-600">Tatami:</span>
          <Badge variant="outline" className="bg-green-100 text-green-700">
            {tatamiCount} cards
          </Badge>
        </span>
      </div>
    </div>
  );
}
