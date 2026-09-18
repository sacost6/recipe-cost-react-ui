import { listIngredientCategories } from '../api';
import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import { useIngredientContext } from '../IngredientContext';
import type {
  IngredientCategory,
  CreateIngredientInput,
  Ingredient,
} from '../types';
import { useState, useEffect, useCallback } from 'react';

export default function IngredientsPage() {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );
  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const {
    ingredients,
    addIngredient,
    deleteIngredient,
    isLoading,
    error,
    refreshIngredients,
    updateIngredient,
  } = useIngredientContext();

  const loadCategories = useCallback(async (): Promise<void> => {
    setIsLoadingCategories(true);
    setCategoryError(null);

    try {
      const loadedCategories = await listIngredientCategories();
      setCategories(loadedCategories);
    } catch (error) {
      setCategoryError(
        error instanceof Error ? error.message : 'Unable to load categories.',
      );
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
  };

  const handleSubmit = async (
    ingredient: CreateIngredientInput,
  ): Promise<void> => {
    if (editingIngredient) {
      await updateIngredient(editingIngredient.ingredientId, {
        ...ingredient,
        version: editingIngredient.version,
      });

      setEditingIngredient(null);
      return;
    }

    await addIngredient(ingredient);
  };

  return (
    <main className="space-y-8 p-6">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-text">Ingredients</h1>
          <p className="text-sm text-muted">
            Track purchase prices and unit costs for your recipe ingredients.
          </p>
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void refreshIngredients()}
              className="mt-2 font-medium underline"
            >
              Try again
            </button>
          </div>
        )}

        {isLoadingCategories && (
          <p role="status" className="text-sm text-muted">
            Loading categories...
          </p>
        )}

        {categoryError && (
          <div className="text-sm text-red-700">
            <p role="alert">{categoryError}</p>
            <button
              type="button"
              onClick={() => void loadCategories()}
              className="underline"
            >
              Try again
            </button>
          </div>
        )}

        <IngredientForm
          initialValues={editingIngredient ?? undefined}
          onSubmit={handleSubmit}
          categories={categories}
          categoriesReady={!isLoadingCategories && categoryError === null}
          onCancel={
            editingIngredient ? () => setEditingIngredient(null) : undefined
          }
          submitLabel={editingIngredient ? 'Save Changes' : 'Add Ingredient'}
        />
      </section>
      {isLoading ? (
        <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">
          Loading ingredients...
        </div>
      ) : (
        <IngredientList
          ingredients={ingredients}
          categories={categories}
          onDelete={deleteIngredient}
          onEdit={handleEdit}
        />
      )}
    </main>
  );
}
