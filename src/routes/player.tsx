import { createFileRoute } from '@tanstack/react-router';
import { PlayerManagerContainer } from '@/components/player/player-manager-container';

export const Route = createFileRoute('/player')({
  component: PlayerManagerPage,
});

function PlayerManagerPage() {
  return <PlayerManagerContainer />;
}
