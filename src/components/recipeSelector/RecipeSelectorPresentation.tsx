import type { DeckRecipe } from '@/models/karuta';

export type RecipeSelectorPresentationProps = {
  recipes: DeckRecipe[];
  onSelectRecipe: (recipe: DeckRecipe) => void;
};

export function RecipeSelectorPresentation({
  recipes,
  onSelectRecipe,
}: RecipeSelectorPresentationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="w-full max-w-6xl">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-800">
          🎴 Select Deck Recipe
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-10" />
              <div className="relative">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  {recipe.title}
                </h2>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <span className="text-3xl font-bold text-indigo-600">
                    {recipe.deckSize}
                  </span>
                  <span>{recipe.deckSize === 1 ? 'Race' : 'Races'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
