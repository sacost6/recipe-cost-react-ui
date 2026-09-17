import IngredientForm from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import { useIngredients } from '../IngredientsContext';
import type { CreateIngredientInput, Ingredient } from '../types';
import { useState } from 'react';

export default function IngredientsPage() {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );
  const {
    ingredients,
    addIngredient,
    deleteIngredient,
    isLoading,
    error,
    refreshIngredients,
    updateIngredient,
  } = useIngredients();

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
        <IngredientForm
          initialValues={editingIngredient ?? undefined}
          onSubmit={handleSubmit}
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
          onDelete={deleteIngredient}
          onEdit={handleEdit}
        />
      )}
    </main>
  );
}
