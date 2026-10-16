import { useEffect, useState, type FormEvent } from 'react';
import Button from '../../../components/Button';
import DeleteButton from '../../../components/DeleteButton';
import { useIngredientContext } from '../../ingredients/IngredientsContext';
import { listUnits } from '../../products/api/product_api';
import type { Unit } from '../../products/types/productTypes';
import {
  createRecipeIngredient,
  deleteRecipeIngredient,
  listRecipeIngredients,
  updateRecipeIngredient,
} from '../api';
import type {
  CreateRecipeIngredientInput,
  Recipe,
  RecipeIngredient,
} from '../types';

interface RecipeIngredientsPaneProps {
  recipe: Recipe;
}

interface IngredientLineValues {
  ingredientId: string;
  quantity: string;
  unitId: string;
}

const emptyLine: IngredientLineValues = {
  ingredientId: '',
  quantity: '',
  unitId: '',
};

export default function RecipeIngredientsPane({
  recipe,
}: RecipeIngredientsPaneProps) {
  const {
    ingredients,
    isLoading: isLoadingIngredients,
    error: ingredientsError,
    refreshIngredients,
  } = useIngredientContext();

  const [lines, setLines] = useState<RecipeIngredient[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoadingLines, setIsLoadingLines] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  const [lineError, setLineError] = useState<string | null>(null);
  const [unitError, setUnitError] = useState<string | null>(null);
  const [lineLoadAttempt, setLineLoadAttempt] = useState(0);
  const [unitLoadAttempt, setUnitLoadAttempt] = useState(0);
  const [newLine, setNewLine] = useState<IngredientLineValues>(emptyLine);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editingValues, setEditingValues] =
    useState<IngredientLineValues>(emptyLine);
  const [isAdding, setIsAdding] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [lineActionError, setLineActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void listRecipeIngredients(recipe.recipeId)
      .then((loadedLines) => {
        if (!cancelled) setLines(loadedLines);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLineError(
            error instanceof Error
              ? error.message
              : 'Unable to load recipe ingredients.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingLines(false);
      });

    return () => {
      cancelled = true;
    };
  }, [recipe.recipeId, lineLoadAttempt]);

  useEffect(() => {
    let cancelled = false;

    void listUnits()
      .then((loadedUnits) => {
        if (!cancelled) setUnits(loadedUnits);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setUnitError(
            error instanceof Error ? error.message : 'Unable to load units.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingUnits(false);
      });

    return () => {
      cancelled = true;
    };
  }, [unitLoadAttempt]);

  const orderedLines = [...lines].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );
  const isBusy =
    isLoadingLines ||
    isLoadingUnits ||
    isAdding ||
    isSavingEdit ||
    isReordering;
  const canAddLine =
    !isLoadingIngredients &&
    ingredientsError === null &&
    !isLoadingLines &&
    lineError === null &&
    unitError === null &&
    !isAdding &&
    ingredients.length > 0 &&
    units.length > 0;

  function selectedValues(line: RecipeIngredient): IngredientLineValues {
    return {
      ingredientId: line.ingredientId,
      quantity: line.quantity,
      unitId: String(line.unitId),
    };
  }

  async function handleAddLine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canAddLine) return;

    setIsAdding(true);
    setLineActionError(null);
    const input: CreateRecipeIngredientInput = {
      ingredientId: newLine.ingredientId,
      quantity: newLine.quantity,
      unitId: Number(newLine.unitId),
      sortOrder: orderedLines.length,
    };

    try {
      const created = await createRecipeIngredient(recipe.recipeId, input);
      setLines((current) => [...current, created]);
      setNewLine((current) => ({ ...current, quantity: '' }));
    } catch (error) {
      setLineActionError(
        error instanceof Error
          ? error.message
          : 'Unable to add the ingredient.',
      );
    } finally {
      setIsAdding(false);
    }
  }

  function beginEdit(line: RecipeIngredient) {
    setLineActionError(null);
    setEditingLineId(line.recipeIngredientId);
    setEditingValues(selectedValues(line));
  }

  async function handleSaveEdit(line: RecipeIngredient) {
    if (isSavingEdit) return;

    setIsSavingEdit(true);
    setLineActionError(null);
    try {
      const updated = await updateRecipeIngredient(
        recipe.recipeId,
        line.recipeIngredientId,
        {
          ingredientId: editingValues.ingredientId,
          quantity: editingValues.quantity,
          unitId: Number(editingValues.unitId),
        },
      );
      setLines((current) =>
        current.map((currentLine) =>
          currentLine.recipeIngredientId === updated.recipeIngredientId
            ? updated
            : currentLine,
        ),
      );
      setEditingLineId(null);
    } catch (error) {
      setLineActionError(
        error instanceof Error
          ? error.message
          : 'Unable to update the recipe ingredient.',
      );
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDeleteLine(line: RecipeIngredient) {
    await deleteRecipeIngredient(recipe.recipeId, line.recipeIngredientId);
    setLines((current) =>
      current.filter(
        (currentLine) =>
          currentLine.recipeIngredientId !== line.recipeIngredientId,
      ),
    );
    if (editingLineId === line.recipeIngredientId) setEditingLineId(null);
  }

  async function handleMoveLine(index: number, offset: -1 | 1) {
    if (isReordering) return;
    const destination = index + offset;
    if (destination < 0 || destination >= orderedLines.length) return;

    const nextOrder = [...orderedLines];
    const [movedLine] = nextOrder.splice(index, 1);
    nextOrder.splice(destination, 0, movedLine);

    setIsReordering(true);
    setLineActionError(null);
    try {
      const updatedLines = await Promise.all(
        nextOrder.map((line, sortOrder) =>
          line.sortOrder === sortOrder
            ? Promise.resolve(line)
            : updateRecipeIngredient(recipe.recipeId, line.recipeIngredientId, {
                sortOrder,
              }),
        ),
      );
      setLines(updatedLines);
    } catch (error) {
      setLineActionError(
        error instanceof Error
          ? error.message
          : 'Unable to reorder recipe ingredients.',
      );
      reloadLines();
    } finally {
      setIsReordering(false);
    }
  }

  function reloadLines() {
    setLineError(null);
    setIsLoadingLines(true);
    setLineLoadAttempt((current) => current + 1);
  }

  function reloadUnits() {
    setUnitError(null);
    setIsLoadingUnits(true);
    setUnitLoadAttempt((current) => current + 1);
  }

  function renderIngredientSelect(
    values: IngredientLineValues,
    onChange: (ingredientId: string) => void,
    id: string,
    disabled: boolean,
  ) {
    return (
      <select
        id={id}
        value={values.ingredientId}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled || isLoadingIngredients}
        className="w-full min-w-40 rounded-lg border border-input-border bg-white px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Select an ingredient
        </option>
        {ingredients.map((ingredient) => (
          <option key={ingredient.ingredientId} value={ingredient.ingredientId}>
            {ingredient.name}
          </option>
        ))}
      </select>
    );
  }

  function renderUnitSelect(
    values: IngredientLineValues,
    onChange: (unitId: string) => void,
    id: string,
    disabled: boolean,
  ) {
    return (
      <select
        id={id}
        value={values.unitId}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled || units.length === 0}
        className="w-full min-w-36 rounded-lg border border-input-border bg-white px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Select a unit
        </option>
        {units.map((unit) => (
          <option key={unit.unitId} value={unit.unitId}>
            {unit.name} ({unit.abbreviation})
          </option>
        ))}
      </select>
    );
  }

  return (
    <section
      aria-labelledby="recipe-ingredients-heading"
      className="space-y-5 rounded-xl border border-border bg-surface p-6"
    >
      <header>
        <h2
          id="recipe-ingredients-heading"
          className="text-xl font-semibold text-text"
        >
          Ingredients
        </h2>
        <p className="text-sm text-muted">
          Add ingredients and amounts for {recipe.name}, then arrange them in
          recipe order.
        </p>
      </header>

      {ingredientsError && (
        <div className="text-sm text-red-700">
          <p role="alert">{ingredientsError}</p>
          <Button
            type="button"
            variant="plain"
            className="mt-1 underline"
            onClick={() => void refreshIngredients()}
            disabled={isLoadingIngredients}
          >
            Reload ingredients
          </Button>
        </div>
      )}

      {unitError && (
        <div className="text-sm text-red-700">
          <p role="alert">{unitError}</p>
          <Button
            type="button"
            variant="plain"
            className="mt-1 underline"
            onClick={reloadUnits}
          >
            Reload units
          </Button>
        </div>
      )}

      {lineError && (
        <div className="text-sm text-red-700">
          <p role="alert">{lineError}</p>
          <Button
            type="button"
            variant="plain"
            className="mt-1 underline"
            onClick={reloadLines}
            disabled={isLoadingLines}
          >
            Reload recipe ingredients
          </Button>
        </div>
      )}

      {(isLoadingIngredients || isLoadingUnits) && (
        <p role="status" className="text-sm text-muted">
          {isLoadingIngredients ? 'Loading ingredients...' : 'Loading units...'}
        </p>
      )}

      {ingredients.length === 0 &&
        !isLoadingIngredients &&
        !ingredientsError && (
          <p className="text-sm text-muted">
            Add an ingredient before adding it to this recipe.{' '}
            <Button
              to="/ingredients"
              variant="plain"
              className="font-medium text-primary underline"
            >
              Manage ingredients
            </Button>
          </p>
        )}

      {lineActionError && (
        <p role="alert" className="text-sm text-red-700">
          {lineActionError}
        </p>
      )}

      <form
        onSubmit={(event) => void handleAddLine(event)}
        className="grid gap-3 rounded-lg border border-border p-4 md:grid-cols-[minmax(0,2fr)_minmax(8rem,1fr)_minmax(9rem,1fr)_auto] md:items-end"
      >
        <div>
          <label
            htmlFor="new-recipe-ingredient"
            className="mb-1 block text-sm font-medium"
          >
            Ingredient
          </label>
          {renderIngredientSelect(
            newLine,
            (ingredientId) =>
              setNewLine((current) => ({ ...current, ingredientId })),
            'new-recipe-ingredient',
            !canAddLine,
          )}
        </div>
        <div>
          <label
            htmlFor="new-recipe-quantity"
            className="mb-1 block text-sm font-medium"
          >
            Quantity
          </label>
          <input
            id="new-recipe-quantity"
            type="number"
            min="0.0001"
            max="99999999.9999"
            step="0.0001"
            value={newLine.quantity}
            onChange={(event) =>
              setNewLine((current) => ({
                ...current,
                quantity: event.target.value,
              }))
            }
            required
            disabled={!canAddLine}
            className="w-full rounded-lg border border-input-border bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="new-recipe-unit"
            className="mb-1 block text-sm font-medium"
          >
            Unit
          </label>
          {renderUnitSelect(
            newLine,
            (unitId) => setNewLine((current) => ({ ...current, unitId })),
            'new-recipe-unit',
            !canAddLine,
          )}
        </div>
        <Button type="submit" disabled={!canAddLine}>
          {isAdding ? 'Adding...' : 'Add ingredient'}
        </Button>
      </form>

      {isLoadingLines ? (
        <p role="status" className="text-sm text-muted">
          Loading recipe ingredients...
        </p>
      ) : orderedLines.length === 0 ? (
        <p className="text-sm text-muted">
          This recipe has no ingredients yet.
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th scope="col" className="px-3 py-3">
                  Ingredient
                </th>
                <th scope="col" className="px-3 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-3 py-3">
                  Unit
                </th>
                <th scope="col" className="px-3 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orderedLines.map((line, index) => {
                const isEditing = editingLineId === line.recipeIngredientId;
                const values = isEditing ? editingValues : selectedValues(line);
                const ingredientName =
                  line.ingredient.name ?? `Ingredient ${line.ingredientId}`;

                return (
                  <tr
                    key={line.recipeIngredientId}
                    className="border-t border-border"
                  >
                    <td className="min-w-52 px-3 py-3">
                      {isEditing ? (
                        <>
                          <label
                            htmlFor={`recipe-ingredient-${line.recipeIngredientId}`}
                            className="sr-only"
                          >
                            Ingredient
                          </label>
                          {renderIngredientSelect(
                            values,
                            (ingredientId) =>
                              setEditingValues((current) => ({
                                ...current,
                                ingredientId,
                              })),
                            `recipe-ingredient-${line.recipeIngredientId}`,
                            isSavingEdit,
                          )}
                        </>
                      ) : (
                        ingredientName
                      )}
                    </td>
                    <td className="min-w-32 px-3 py-3">
                      {isEditing ? (
                        <>
                          <label
                            htmlFor={`recipe-quantity-${line.recipeIngredientId}`}
                            className="sr-only"
                          >
                            Quantity
                          </label>
                          <input
                            id={`recipe-quantity-${line.recipeIngredientId}`}
                            type="number"
                            min="0.0001"
                            max="99999999.9999"
                            step="0.0001"
                            value={editingValues.quantity}
                            onChange={(event) =>
                              setEditingValues((current) => ({
                                ...current,
                                quantity: event.target.value,
                              }))
                            }
                            required
                            disabled={isSavingEdit}
                            className="w-full rounded-lg border border-input-border bg-white px-3 py-2 text-sm"
                          />
                        </>
                      ) : (
                        line.quantity
                      )}
                    </td>
                    <td className="min-w-36 px-3 py-3">
                      {isEditing ? (
                        <>
                          <label
                            htmlFor={`recipe-unit-${line.recipeIngredientId}`}
                            className="sr-only"
                          >
                            Unit
                          </label>
                          {renderUnitSelect(
                            values,
                            (unitId) =>
                              setEditingValues((current) => ({
                                ...current,
                                unitId,
                              })),
                            `recipe-unit-${line.recipeIngredientId}`,
                            isSavingEdit,
                          )}
                        </>
                      ) : (
                        `${line.unit.name} (${line.unit.abbreviation})`
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="plain"
                          aria-label={`Move ${ingredientName} up`}
                          disabled={isBusy || index === 0 || isEditing}
                          onClick={() => void handleMoveLine(index, -1)}
                          className="min-h-9 rounded px-2 text-muted hover:bg-slate-100"
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="plain"
                          aria-label={`Move ${ingredientName} down`}
                          disabled={
                            isBusy ||
                            index === orderedLines.length - 1 ||
                            isEditing
                          }
                          onClick={() => void handleMoveLine(index, 1)}
                          className="min-h-9 rounded px-2 text-muted hover:bg-slate-100"
                        >
                          ↓
                        </Button>
                        {isEditing ? (
                          <>
                            <Button
                              type="button"
                              variant="plain"
                              disabled={isSavingEdit}
                              onClick={() => void handleSaveEdit(line)}
                              className="min-h-9 rounded px-2 font-medium text-primary hover:bg-green-50"
                            >
                              {isSavingEdit ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              type="button"
                              variant="plain"
                              disabled={isSavingEdit}
                              onClick={() => setEditingLineId(null)}
                              className="min-h-9 rounded px-2 text-muted hover:bg-slate-100"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="plain"
                              disabled={isBusy || editingLineId !== null}
                              onClick={() => beginEdit(line)}
                              className="min-h-9 rounded px-2 font-medium text-muted hover:bg-slate-100"
                            >
                              Edit
                            </Button>
                            <DeleteButton
                              itemName={ingredientName}
                              disabled={isBusy || editingLineId !== null}
                              onDelete={() => handleDeleteLine(line)}
                            />
                          </>
                        )}
                      </div>
                    </td>
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
