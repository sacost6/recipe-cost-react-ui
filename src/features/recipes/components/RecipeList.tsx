import { useState } from 'react';
import Button from '../../../components/Button';
import DeleteButton from '../../../components/DeleteButton';
import type { Recipe } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
  search: string;
  disabled?: boolean;
  onDelete?: (id: Recipe['recipeId']) => Promise<void>;
  onEdit?: (recipe: Recipe) => void;
}

export default function RecipeList({
  recipes,
  search,
  disabled = false,
  onDelete,
  onEdit,
}: RecipeListProps) {
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null);
  const normalizedSearch = search.trim().toLowerCase();
  const visibleRecipes = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(normalizedSearch) ||
      recipe.description?.toLowerCase().includes(normalizedSearch) === true
    );
  });
  const showActions = Boolean(onEdit || onDelete);

  async function handleDelete(recipeId: Recipe['recipeId']) {
    if (!onDelete || disabled || deletingRecipeId !== null) return;

    setDeletingRecipeId(recipeId);
    try {
      await onDelete(recipeId);
    } finally {
      setDeletingRecipeId(null);
    }
  }

  if (recipes.length === 0) {
    return (
      <section
        aria-label="Recipe list"
        className="rounded-xl border border-border bg-surface p-8 text-center"
      >
        <h2 className="text-lg font-semibold text-text">No recipes yet</h2>
        <p className="mt-2 text-sm text-muted">
          Add a recipe to start organizing its ingredients and costs.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Recipe list" className="w-full min-w-0 space-y-3">
      <p className="text-sm text-muted">
        Showing {visibleRecipes.length} of {recipes.length}{' '}
        {recipes.length === 1 ? 'recipe' : 'recipes'}
      </p>

      {visibleRecipes.length === 0 ? (
        <p className="text-sm text-muted">No recipes match your search.</p>
      ) : (
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Recipe
                </th>
                <th scope="col" className="px-4 py-3">
                  Description
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">
                  Servings
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
              {visibleRecipes.map((recipe) => {
                const isDeleting = deletingRecipeId === recipe.recipeId;
                const rowDisabled = disabled || isDeleting;

                return (
                  <tr
                    key={recipe.recipeId}
                    className="border-t border-border transition-colors hover:bg-green-50"
                  >
                    <th scope="row" className="px-4 py-3 font-medium">
                      <Button
                        to={`/recipes/${recipe.recipeId}`}
                        variant="plain"
                        disabled={rowDisabled}
                        className="inline-flex min-h-9 items-center gap-2 rounded text-left font-medium text-primary hover:underline"
                      >
                        {recipe.name}
                        <span aria-hidden="true">→</span>
                      </Button>
                    </th>
                    <td className="max-w-md px-4 py-3 text-muted">
                      <span className="line-clamp-2">
                        {recipe.description || '—'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {recipe.servings}
                    </td>
                    {showActions && (
                      <td className="w-px whitespace-nowrap px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          {onEdit && (
                            <Button
                              type="button"
                              variant="plain"
                              className="inline-flex min-h-9 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-text"
                              aria-label={`Edit ${recipe.name}`}
                              disabled={rowDisabled}
                              onClick={() => onEdit(recipe)}
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <div
                              className={
                                onEdit ? 'border-l border-border pl-3' : ''
                              }
                            >
                              <DeleteButton
                                itemName={recipe.name}
                                disabled={rowDisabled}
                                onDelete={() => handleDelete(recipe.recipeId)}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
