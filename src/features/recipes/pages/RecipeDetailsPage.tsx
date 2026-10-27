import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { useRecipeContext } from '../RecipeContext';
import RecipeInstructionsMarkdown from '../components/RecipeInstructionsMarkdown';
import RecipeIngredientsPane from '../components/RecipeIngredientsPane';
import RecipePricingPane from '../components/RecipePricingPane';

export default function RecipeDetailsPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const { recipes, isLoading, error, refreshRecipes } = useRecipeContext();

  const recipe = recipes.find((item) => item.recipeId === recipeId);

  return (
    <main className="detail-enter w-full min-w-0 space-y-6 py-6">
      <Link
        to="/recipes"
        className="inline-block rounded text-sm font-medium text-primary underline underline-offset-4"
      >
        ← Back to recipes
      </Link>

      {isLoading ? (
        <p role="status">Loading recipe...</p>
      ) : error ? (
        <div className="space-y-3">
          <p role="alert" className="text-red-700">
            {error}
          </p>
          <Button onClick={() => void refreshRecipes()}>Try again</Button>
        </div>
      ) : !recipe ? (
        <div>
          <h1 className="text-3xl font-semibold">Recipe not found</h1>
          <p className="text-muted">
            This recipe may have been removed or is unavailable.
          </p>
        </div>
      ) : (
        <>
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-text">{recipe.name}</h1>
            <p className="text-sm text-muted">
              {recipe.description ?? 'No description provided'}
            </p>
            <p className="text-sm text-muted">
              Makes {recipe.servings}{' '}
              {recipe.servings === 1 ? 'serving' : 'servings'}
            </p>
          </header>

          <RecipeIngredientsPane key={recipe.recipeId} recipe={recipe} />

          <RecipePricingPane
            key={`pricing-${recipe.recipeId}`}
            recipe={recipe}
          />

          <section
            aria-labelledby="recipe-instructions-heading"
            className="space-y-3 rounded-xl border border-border bg-surface p-6"
          >
            <h2
              id="recipe-instructions-heading"
              className="text-xl font-semibold text-text"
            >
              Instructions
            </h2>
            {recipe.instructions.trim() ? (
              <RecipeInstructionsMarkdown>
                {recipe.instructions}
              </RecipeInstructionsMarkdown>
            ) : (
              <p className="text-sm leading-6 text-muted">
                No instructions added yet.
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
