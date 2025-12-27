import type { DeckRecipe } from '@/models/karuta';

export type RecipeSelectorPresentationProps = {
  recipes: DeckRecipe[];
  onSelectRecipe: (recipe: DeckRecipe) => void;
  onShowIntro?: () => void;
};

export function RecipeSelectorPresentation({
  recipes,
  onSelectRecipe,
  onShowIntro,
}: RecipeSelectorPresentationProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="w-full max-w-6xl">
        {onShowIntro && (
          <div className="mb-8 text-center">
            <button
              onClick={onShowIntro}
              className="rounded-lg bg-gray-800 px-6 py-3 font-bold text-green-400 shadow-lg transition-all duration-300 hover:bg-gray-900 hover:text-green-300 hover:shadow-xl active:scale-95"
            >
              📜 掟 (RULES)
            </button>
          </div>
        )}
        <div className="mb-8 flex justify-center">
          <img
            src={`${import.meta.env.BASE_URL}vite.svg`}
            alt="Vite logo"
            className="h-24 w-24"
          />
        </div>
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
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                  {recipe.title}
                </h2>

                {recipe.description && (
                  <p className="mb-3 text-sm text-gray-600">
                    {recipe.description}
                  </p>
                )}

                <div className="mb-3 flex items-center gap-2 text-lg text-gray-600">
                  <span className="text-3xl font-bold text-indigo-600">
                    {recipe.deckSize}
                  </span>
                  <span>{recipe.deckSize === 1 ? 'Race' : 'Races'}</span>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Difficulty:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-bold ${
                      recipe.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : recipe.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {recipe.difficulty}
                  </span>
                </div>

                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
