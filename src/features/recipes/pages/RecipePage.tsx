import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import InstructionsEditor from '../components/InstructionsEditor';
import RecipeList from '../components/RecipeList';
import { useRecipeContext } from '../RecipeContext';
import type { CreateRecipeInput, Recipe } from '../types';

interface RecipeFormValues {
  name: string;
  description: string;
  instructions: string;
  servings: string;
}

const emptyForm: RecipeFormValues = {
  name: '',
  description: '',
  instructions: '',
  servings: '1',
};

function valuesFromRecipe(recipe: Recipe): RecipeFormValues {
  return {
    name: recipe.name,
    description: recipe.description ?? '',
    instructions: recipe.instructions,
    servings: String(recipe.servings),
  };
}

export default function RecipePage() {
  const {
    recipes,
    addRecipe,
    deleteRecipe,
    isLoading,
    error,
    refreshRecipes,
    updateRecipe,
  } = useRecipeContext();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formValues, setFormValues] = useState<RecipeFormValues>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function openCreateForm() {
    setEditingRecipe(null);
    setFormValues(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm(recipe: Recipe) {
    setEditingRecipe(recipe);
    setFormValues(valuesFromRecipe(recipe));
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingRecipe(null);
    setFormValues(emptyForm);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const input: CreateRecipeInput = {
      name: formValues.name.trim(),
      description: formValues.description.trim() || null,
      instructions: formValues.instructions.trim(),
      servings: Number(formValues.servings),
    };

    setFormError(null);
    setIsSaving(true);
    try {
      const saved = editingRecipe
        ? await updateRecipe(editingRecipe.recipeId, {
            ...input,
            version: editingRecipe.version,
          })
        : await addRecipe(input);

      closeForm();
      navigate(`/recipes/${saved.recipeId}`);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to save the recipe.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  const showList = recipes.length > 0 || (!isLoading && error === null);

  return (
    <main className="w-full min-w-0 max-w-full space-y-8 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-text">Recipes</h1>
          <p className="text-sm text-muted">
            Organize recipes, ingredients, and serving sizes.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreateForm}
          disabled={showForm || isLoading}
        >
          Add recipe
        </Button>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p role="alert">{error}</p>
          <Button
            type="button"
            variant="plain"
            onClick={() => void refreshRecipes()}
            disabled={isLoading}
            className="mt-2 font-medium underline"
          >
            Reload recipes
          </Button>
        </div>
      )}

      {showForm && (
        <section className="space-y-3" aria-labelledby="recipe-form-heading">
          <h2 id="recipe-form-heading" className="text-lg font-semibold">
            {editingRecipe ? `Edit ${editingRecipe.name}` : 'Add recipe'}
          </h2>
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="space-y-4 rounded-xl border border-border bg-surface p-6"
          >
            <div>
              <label
                htmlFor="recipe-name"
                className="mb-1.5 block text-sm font-medium"
              >
                Name
              </label>
              <input
                id="recipe-name"
                type="text"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
                maxLength={150}
                disabled={isSaving}
                className="w-full rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="recipe-description"
                className="mb-1.5 block text-sm font-medium"
              >
                Description (optional)
              </label>
              <textarea
                id="recipe-description"
                rows={2}
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                maxLength={5000}
                disabled={isSaving}
                className="w-full rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm"
              />
            </div>

            <InstructionsEditor
              value={formValues.instructions}
              onChange={(instructions) =>
                setFormValues((current) => ({ ...current, instructions }))
              }
              maxLength={50000}
              disabled={isSaving}
            />

            <div className="max-w-xs">
              <label
                htmlFor="recipe-servings"
                className="mb-1.5 block text-sm font-medium"
              >
                Servings
              </label>
              <input
                id="recipe-servings"
                type="number"
                min={1}
                max={32767}
                step={1}
                value={formValues.servings}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    servings: event.target.value,
                  }))
                }
                required
                disabled={isSaving}
                className="w-full rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm"
              />
            </div>

            {formError && (
              <p role="alert" className="text-sm text-red-700">
                {formError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={closeForm}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? 'Saving...'
                  : editingRecipe
                    ? 'Save changes'
                    : 'Add recipe'}
              </Button>
            </div>
          </form>
        </section>
      )}

      <div className="w-full min-w-0">
        <label htmlFor="recipe-search" className="block text-sm font-medium">
          Search recipes
        </label>
        <input
          id="recipe-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or description"
          className="mt-1 w-full rounded-lg border border-input-border bg-surface px-3 py-2 placeholder:text-muted"
        />
      </div>

      {isLoading && (
        <p role="status" className="text-sm text-muted">
          Loading recipes...
        </p>
      )}

      {showList && (
        <RecipeList
          recipes={recipes}
          search={search}
          disabled={showForm || isLoading}
          onEdit={openEditForm}
          onDelete={deleteRecipe}
        />
      )}
    </main>
  );
}
