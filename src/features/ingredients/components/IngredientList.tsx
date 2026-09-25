import { Fragment } from 'react';
import type { Ingredient } from '../types';
import IngredientRow from './IngredientRow';
import IngredientEmptyState from './IngredientEmptyState';
import IngredientProductsPane from './IngredientProductsPane';
import { useAuth } from '../../users/AuthContext';
import { useProductContext } from '../../products/ProductContext';

interface IngredientListProps {
  ingredients: Ingredient[];
  expandedIngredientId: string | null;
  onToggle: (ingredientId: string) => void;
  search: string;
  categoryFilter: string;
  disabled?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: (ingredient: Ingredient) => void;
}

export default function IngredientList({
  ingredients,
  expandedIngredientId,
  onToggle,
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
  const columnCount = showActions ? 4 : 3;

  if (ingredients.length === 0) {
    return <IngredientEmptyState />;
  }

  return (
    <section aria-label="Ingredient list" className="space-y-3">
      <p className="text-sm text-muted">
        Showing {visibleCount} of {ingredients.length} ingredients
      </p>

      {visibleCount === 0 && (
        <p className="text-sm text-muted">
          No ingredients match your search and filters.
        </p>
      )}

      <div
        hidden={visibleCount === 0}
        className="overflow-x-auto rounded-lg border border-border bg-surface"
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
                Your products
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
              const panelId = `ingredient-products-${id}`;
              const isExpanded = expandedIngredientId === id;
              const isVisible = matchesFilters(ingredient);

              const canManage =
                user !== null && ingredient.userId === user.userId;

              const productCountLabel = isLoading
                ? 'Loading…'
                : error
                  ? 'Unavailable'
                  : String(productCounts.get(id) ?? 0);

              return (
                <Fragment key={id}>
                  <IngredientRow
                    ingredient={ingredient}
                    showActions={showActions}
                    isExpanded={isExpanded}
                    panelId={panelId}
                    productCountLabel={productCountLabel}
                    hidden={!isVisible}
                    disabled={disabled}
                    onToggle={() => onToggle(id)}
                    onEdit={canManage ? onEdit : undefined}
                    onDelete={canManage ? onDelete : undefined}
                  />

                  <tr id={panelId} hidden={!isVisible || !isExpanded}>
                    <td
                      colSpan={columnCount}
                      className="border-t border-border bg-background p-4"
                    >
                      <IngredientProductsPane ingredient={ingredient} />
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
