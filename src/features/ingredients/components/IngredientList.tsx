import type { Ingredient } from '../types';
import IngredientRow from './IngredientRow';
import IngredientEmptyState from './IngredientEmptyState';
import { useAuth } from '../../users/AuthContext';
import { useProductContext } from '../../products/ProductContext';

interface IngredientListProps {
  ingredients: Ingredient[];
  search: string;
  categoryFilter: string;
  disabled?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (ingredient: Ingredient) => void;
}

export default function IngredientList({
  ingredients,
  search,
  categoryFilter,
  disabled = false,
  onDelete,
  onEdit,
}: IngredientListProps) {
  const { user } = useAuth();
  const { products, isLoading, error } = useProductContext();

  const productCounts = new Map<string, number>();

  for (const product of products) {
    const current = productCounts.get(product.ingredientId) ?? 0;
    productCounts.set(product.ingredientId, current + 1);
  }

  const normalizedSearch = search.trim().toLowerCase();

  function matchesFilters(ingredient: Ingredient): boolean {
    const matchesName = ingredient.name
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesCategory =
      categoryFilter === '' || String(ingredient.categoryId) === categoryFilter;

    return matchesName && matchesCategory;
  }

  const visibleCount = ingredients.filter(matchesFilters).length;
  const showActions = Boolean(onEdit || onDelete);

  if (ingredients.length === 0) {
    return <IngredientEmptyState />;
  }

  return (
    <section
      aria-label="Ingredient list"
      className="w-full min-w-0 max-w-full space-y-3"
    >
      <p className="text-sm text-muted">
        {visibleCount === 1
          ? `Showing ${visibleCount} of ${ingredients.length} ingredient`
          : `Showing ${visibleCount} of ${ingredients.length} ingredient`}
      </p>

      {visibleCount === 0 && (
        <p className="text-sm text-muted">
          No ingredients match your search and filters.
        </p>
      )}

      <div
        hidden={visibleCount === 0}
        className="w-full min-w-0 max-w-full overflow-x-auto"
      >
        <table className="min-w-full text-left text-sm">
          <thead className="bg-background text-xs uppercase text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">
                Ingredient
              </th>
              <th scope="col" className="px-4 py-3">
                Category
              </th>
              <th scope="col" className="px-4 py-3">
                Your Products
              </th>
              {showActions && (
                <th
                  scope="col"
                  className="w-px whitespace-nowrap px-4 py-3 text-right"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {ingredients.map((ingredient) => {
              const id = ingredient.ingredientId;
              const isVisible = matchesFilters(ingredient);

              const canManage =
                user !== null && ingredient.userId === user.userId;

              const productCountLabel = isLoading
                ? 'Loading…'
                : error
                  ? 'Unavailable'
                  : String(productCounts.get(id) ?? 0);

              return (
                <IngredientRow
                  key={id}
                  ingredient={ingredient}
                  showActions={showActions}
                  productCountLabel={productCountLabel}
                  showAddProductHint={
                    user !== null &&
                    !isLoading &&
                    error === null &&
                    (productCounts.get(id) ?? 0) === 0
                  }
                  hidden={!isVisible}
                  disabled={disabled}
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
