import type { Recipe } from '../types';

interface RecipeIngredientsPaneProps {
  recipe: Recipe;
}

export default function RecipeIngredientsPane({
  recipe,
}: RecipeIngredientsPaneProps) {
  return (
    <section
      aria-labelledby="recipe-ingredients-heading"
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      <header>
        <h2
          id="recipe-ingredients-heading"
          className="text-xl font-semibold text-text"
        >
          Ingredients
        </h2>
        <p className="text-sm text-muted">
          Add the ingredients and quantities for {recipe.name}.
        </p>
      </header>
    </section>
  );
}
