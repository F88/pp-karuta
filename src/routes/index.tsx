/**
 * Home route (`/`) for the main game flow.
 *
 * The shared shadcn/ui `ThemeProvider` is applied here so all main gameplay
 * screens use the common theme, while `/intro` remains theme-isolated.
 */
import { createFileRoute } from '@tanstack/react-router';
import { GameFlow } from '@/components/game/game-flow';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return <GameFlow />;
}
