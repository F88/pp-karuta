import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeckManager } from '@/lib/karuta/deck/deck-manager';
import { ETO_RECIPES } from '@/lib/karuta/deck/deck-recipe-eto';

import { useGameSetup } from './use-game-setup';

import type { ProtopediaInMemoryRepository } from 'promidas';

const createRepository = () =>
  ({
    getAllFromSnapshot: vi.fn().mockResolvedValue([]),
  }) as unknown as ProtopediaInMemoryRepository;

describe('useGameSetup', () => {
  // These recipes share the same apiParams, so the snapshot can be reused
  const [firstRecipe, secondRecipe] = ETO_RECIPES;

  const render = (repository: ProtopediaInMemoryRepository) =>
    renderHook(
      (props: { repository: ProtopediaInMemoryRepository }) =>
        useGameSetup({ ...props, onGameStateCreated: vi.fn() }),
      { initialProps: { repository } },
    );

  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(DeckManager, 'getPrototypesFromRecipe').mockResolvedValue([]);
  });

  it('reuses the snapshot when apiParams are unchanged', async () => {
    const repository = createRepository();
    const { result } = render(repository);

    await act(() => result.current.selectDeckRecipe(firstRecipe));
    await act(() => result.current.selectDeckRecipe(secondRecipe));

    expect(DeckManager.getPrototypesFromRecipe).toHaveBeenCalledTimes(1);
    expect(repository.getAllFromSnapshot).toHaveBeenCalledTimes(1);
  });

  it('fetches again after the repository is replaced', async () => {
    const replaced = createRepository();
    const { result, rerender } = render(createRepository());

    await act(() => result.current.selectDeckRecipe(firstRecipe));
    await act(async () => rerender({ repository: replaced }));
    await act(() => result.current.selectDeckRecipe(secondRecipe));

    expect(DeckManager.getPrototypesFromRecipe).toHaveBeenCalledTimes(2);
    expect(DeckManager.getPrototypesFromRecipe).toHaveBeenLastCalledWith(
      secondRecipe,
      replaced,
    );
    expect(replaced.getAllFromSnapshot).not.toHaveBeenCalled();
  });
});
