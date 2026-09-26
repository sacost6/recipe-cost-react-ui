import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import { useIngredientContext } from '../IngredientsContext';
import IngredientProductsPane from '../components/IngredientProductsPane';

export default function IngredientDetailsPage() {
  const { ingredientId } = useParams<{ ingredientId: string }>();
  const { ingredients, isLoading, error, refreshIngredients } =
    useIngredientContext();

  const ingredient = ingredients.find(
    (item) => item.ingredientId === ingredientId,
  );

  return (
    <main className="detail-enter w-full min-w-0 space-y-6 py-6">
      <Link
        to="/ingredients"
        className="inline-block rounded text-sm font-medium text-primary underline underline-offset-4"
      >
        ← Back to ingredients
      </Link>

      {isLoading ? (
        <p role="status">Loading ingredient...</p>
      ) : error ? (
        <div className="space-y-3">
          <p role="alert" className="text-red-700">
            {error}
          </p>
          <Button onClick={() => void refreshIngredients()}>Try again</Button>
        </div>
      ) : !ingredient ? (
        <div>
          <h1 className="text-3xl font-semibold">Ingredient not found</h1>
          <p className="text-muted">
            This ingredient may have been removed or is unavailable.
          </p>
        </div>
      ) : (
        <>
          <header>
            <h1 className="text-3xl font-semibold text-text">
              {ingredient.name}
            </h1>
            <p className="text-sm text-muted">
              {ingredient.category?.name ?? 'Uncategorized'}
            </p>
          </header>

          <IngredientProductsPane
            key={ingredient.ingredientId}
            ingredient={ingredient}
          />
        </>
      )}
    </main>
  );
}
