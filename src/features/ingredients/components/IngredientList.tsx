import type { Ingredient, IngredientCategory } from '../types.ts';
import IngredientRow from './IngredientRow.tsx';
import IngredientEmptyState from './IngredientEmptyState.tsx';
import { useAuth } from '../../users/AuthContext.tsx';

export interface IngredientListProps {
  ingredients: Ingredient[];
  categories: IngredientCategory[];
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (ingredient: Ingredient) => void;
}

export default function IngredientList({
  ingredients,
  onDelete,
  onEdit,
}: IngredientListProps) {
  const { user } = useAuth();

  if (ingredients.length === 0) {
    return <IngredientEmptyState />;
  }

  const showActions = Boolean(onEdit || onDelete);

  return (
    <section className="w-full" aria-label="ingredients-heading">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2
            id="ingredients-heading"
            className="text-lg font-semibold text-text"
          >
            Ingredients
          </h2>
          <p className="text-sm text-muted">
            {ingredients.length}{' '}
            {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-background text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Ingredient</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Description</th>

              {showActions && (
                <th className="px-4 py-3 font-semibold">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {ingredients.map((ingredient) => {
              const canManage =
                user !== null && ingredient.userId === user.userId;

              return (
                <IngredientRow
                  key={ingredient.ingredientId}
                  ingredient={ingredient}
                  showActions={showActions}
                  onEdit={canManage ? onEdit : undefined}
                  onDelete={canManage ? onDelete : undefined}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
