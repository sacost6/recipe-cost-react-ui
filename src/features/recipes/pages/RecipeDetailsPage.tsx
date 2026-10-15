import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { useRecipeContext } from '../RecipeContext';
import RecipeIngredientsPane from '../components/RecipeIngredientsPane';

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
          <header>
            <h1 className="text-3xl font-semibold text-text">{recipe.name}</h1>
            <p className="text-sm text-muted">
              {recipe.description ?? 'No description provided'}
            </p>
          </header>

          <RecipeIngredientsPane key={recipe.recipeId} recipe={recipe} />
        </>
      )}
    </main>
  );
}
