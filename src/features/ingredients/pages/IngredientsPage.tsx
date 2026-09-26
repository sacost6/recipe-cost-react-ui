import { listIngredientCategories } from '../api';
import Button from '../../../components/Button';
import IngredientList from '../components/IngredientList';
import { useIngredientContext } from '../IngredientsContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IngredientForm from '../components/IngredientForm';
import type {
  IngredientCategory,
  CreateIngredientInput,
  Ingredient,
} from '../types';

export default function IngredientsPage() {
  const {
    ingredients,
    addIngredient,
    deleteIngredient,
    isLoading,
    error,
    refreshIngredients,
    updateIngredient,
  } = useIngredientContext();

  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryLoadAttempt, setCategoryLoadAttempt] = useState(0);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );
  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const loaded = await listIngredientCategories();
        if (!ignore) setCategories(loaded);
      } catch (error) {
        if (!ignore) {
          setCategoryError(
            error instanceof Error
              ? error.message
              : 'Unable to load categories.',
          );
        }
      } finally {
        if (!ignore) setIsLoadingCategories(false);
      }
    }

    void loadCategories();

    return () => {
      ignore = true;
    };
  }, [categoryLoadAttempt]);

  function retryCategories() {
    setIsLoadingCategories(true);
    setCategoryError(null);
    setCategoryLoadAttempt((current) => current + 1);
  }

  function handleAdd() {
    setEditingIngredient(null);

    setShowIngredientForm(true);
  }

  function handleEdit(ingredient: Ingredient) {
    setEditingIngredient(ingredient);

    setShowIngredientForm(true);
  }

  function closeIngredientForm() {
    setShowIngredientForm(false);
    setEditingIngredient(null);
  }

  const navigate = useNavigate();

  async function handleSubmit(input: CreateIngredientInput): Promise<void> {
    const saved = editingIngredient
      ? await updateIngredient(editingIngredient.ingredientId, {
          ...input,
          version: editingIngredient.version,
        })
      : await addIngredient(input);

    closeIngredientForm();
    navigate(`/ingredients/${saved.ingredientId}`);
  }

  async function handleDelete(ingredientId: string): Promise<void> {
    await deleteIngredient(ingredientId);
  }

  const categoriesReady = !isLoadingCategories && categoryError === null;
  const showList = ingredients.length > 0 || (!isLoading && error === null);

  return (
    <main className="w-full min-w-0 max-w-full space-y-8 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-text">Ingredients</h1>
          <p className="text-sm text-muted">
            Open an ingredient to manage its products and purchase prices.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAdd}
          disabled={showIngredientForm || isLoading}
        >
          Add ingredient
        </Button>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p role="alert">{error}</p>
          <Button
            type="button"
            variant="plain"
            onClick={() => void refreshIngredients()}
            disabled={isLoading}
            className="mt-2 font-medium underline"
          >
            Reload ingredients
          </Button>
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
          <Button
            type="button"
            variant="plain"
            onClick={retryCategories}
            className="underline"
          >
            Retry categories
          </Button>
        </div>
      )}

      {showIngredientForm && (
        <section
          className="space-y-3"
          aria-labelledby="ingredient-form-heading"
        >
          <h2 id="ingredient-form-heading" className="text-lg font-semibold">
            {editingIngredient
              ? `Edit ${editingIngredient.name}`
              : 'Add ingredient'}
          </h2>

          <IngredientForm
            key={
              editingIngredient
                ? `${editingIngredient.ingredientId}:${editingIngredient.version}`
                : 'new'
            }
            initialValues={editingIngredient ?? undefined}
            onSubmit={handleSubmit}
            categories={categories}
            categoriesReady={categoriesReady}
            submitLabel={editingIngredient ? 'Save changes' : 'Add ingredient'}
            onCancel={closeIngredientForm}
          />
        </section>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full min-w-0 sm:flex-1">
          <label
            htmlFor="ingredient-search"
            className="block text-sm font-medium"
          >
            Search ingredients
          </label>
          <input
            id="ingredient-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            className="mt-1 w-full rounded-lg border border-input-border bg-surface px-3 py-2 placeholder:text-muted"
          />
        </div>

        <div className="w-full min-w-0 sm:w-56 sm:shrink-0">
          <label
            htmlFor="ingredient-category-filter"
            className="block text-sm font-medium"
          >
            Category
          </label>
          <select
            id="ingredient-category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            disabled={!categoriesReady}
            className="mt-1 w-full rounded-lg border border-input-border bg-surface px-3 py-2"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option
                key={category.categoryId}
                value={String(category.categoryId)}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <p role="status" className="text-sm text-muted">
          Loading ingredients..
        </p>
      )}

      {showList && (
        <IngredientList
          ingredients={ingredients}
          search={search}
          categoryFilter={categoryFilter}
          disabled={showIngredientForm || isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
