import { useEffect, useId, useState } from 'react';
import type { FormEvent } from 'react';
import Button from '../../../components/Button';
import {
  deleteIngredientDensity,
  getIngredientDensity,
  getUsdaDensitySuggestionsForIngredient,
  saveIngredientDensity,
  searchUsdaFoodsForIngredient,
} from '../api';
import type { Ingredient } from '../types';
import type {
  IngredientDensity,
  UsdaDensitySuggestion,
  UsdaFoodSearchResult,
} from '../types/densityTypes';

interface IngredientDensityPaneProps {
  ingredient: Ingredient;
}

export default function IngredientDensityPane({
  ingredient,
}: IngredientDensityPaneProps) {
  const headingId = useId();
  const searchId = useId();
  const [density, setDensity] = useState<IngredientDensity | null>(null);
  const [query, setQuery] = useState(ingredient.name);
  const [foods, setFoods] = useState<UsdaFoodSearchResult[]>([]);
  const [selectedFood, setSelectedFood] = useState<UsdaFoodSearchResult | null>(
    null,
  );
  const [suggestions, setSuggestions] = useState<UsdaDensitySuggestion[]>([]);
  const [selectedPortionId, setSelectedPortionId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    void getIngredientDensity(ingredient.ingredientId)
      .then((saved) => {
        if (!ignore) setDensity(saved);
      })
      .catch((loadError: unknown) => {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load the confirmed density.',
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [ingredient.ingredientId]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSearching || query.trim().length < 2) return;

    setError(null);
    setMessage(null);
    setSelectedFood(null);
    setSuggestions([]);
    setSelectedPortionId('');
    setIsSearching(true);
    try {
      const results = await searchUsdaFoodsForIngredient(
        ingredient.ingredientId,
        query.trim(),
      );
      setFoods(results);
      if (results.length === 0) setMessage('No USDA foods matched that search.');
    } catch (searchError) {
      setError(
        searchError instanceof Error
          ? searchError.message
          : 'Unable to search USDA foods.',
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSelectFood(food: UsdaFoodSearchResult) {
    setError(null);
    setMessage(null);
    setSelectedFood(food);
    setSuggestions([]);
    setSelectedPortionId('');
    setIsLoadingSuggestions(true);
    try {
      const results = await getUsdaDensitySuggestionsForIngredient(
        ingredient.ingredientId,
        food.fdcId,
      );
      setSuggestions(results);
      if (results.length === 0) {
        setMessage(
          'USDA has no supported volume portions for this food. Choose another match.',
        );
      }
    } catch (suggestionError) {
      setError(
        suggestionError instanceof Error
          ? suggestionError.message
          : 'Unable to load USDA portion data.',
      );
    } finally {
      setIsLoadingSuggestions(false);
    }
  }

  async function handleConfirm() {
    if (!selectedFood || !selectedPortionId || isSaving) return;
    setError(null);
    setMessage(null);
    setIsSaving(true);
    try {
      const saved = await saveIngredientDensity(ingredient.ingredientId, {
        fdcId: selectedFood.fdcId,
        portionId: Number(selectedPortionId),
      });
      setDensity(saved);
      setMessage('USDA density confirmed and saved for this ingredient.');
      setFoods([]);
      setSelectedFood(null);
      setSuggestions([]);
      setSelectedPortionId('');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save the USDA density.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!density || isDeleting) return;
    setError(null);
    setMessage(null);
    setIsDeleting(true);
    try {
      await deleteIngredientDensity(ingredient.ingredientId);
      setDensity(null);
      setMessage('Confirmed density removed.');
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to remove the confirmed density.',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      <div>
        <h2 id={headingId} className="text-lg font-semibold text-text">
          Volume to weight conversion
        </h2>
        <p className="mt-1 text-sm text-muted">
          Match this ingredient to USDA food data and confirm a measured volume
          portion. The selected portion supplies the density used for recipe
          costs.
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="text-sm text-text">{message}</p>}

      {isLoading ? (
        <p role="status" className="text-sm text-muted">
          Loading saved conversion...
        </p>
      ) : density ? (
        <div className="space-y-3 rounded-lg border border-border p-4">
          <div>
            <p className="font-medium text-text">Confirmed USDA match</p>
            <p className="text-sm text-text">{density.foodDescription}</p>
            <p className="text-sm text-muted">
              {density.portionDescription} · {density.gramWeight} g ·{' '}
              {density.densityGramsPerMl} g/mL
            </p>
            <p className="text-xs text-muted">
              {density.dataType}, FDC {density.fdcId}; confirmed{' '}
              {new Date(density.confirmedAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting || isSaving}
            onClick={() => void handleDelete()}
          >
            {isDeleting ? 'Removing...' : 'Remove conversion'}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted">
          No density has been confirmed for this ingredient yet.
        </p>
      )}

      <form onSubmit={(event) => void handleSearch(event)} className="space-y-3">
        <div>
          <label
            htmlFor={searchId}
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Search USDA FoodData Central
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={searchId}
              value={query}
              maxLength={200}
              minLength={2}
              disabled={isSearching || isLoadingSuggestions || isSaving}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm text-text"
            />
            <Button
              type="submit"
              disabled={
                isLoading ||
                isSearching ||
                isLoadingSuggestions ||
                isSaving ||
                query.trim().length < 2
              }
            >
              {isSearching ? 'Searching...' : 'Search foods'}
            </Button>
          </div>
        </div>
      </form>

      {foods.length > 0 && !selectedFood && (
        <div className="space-y-2" aria-label="USDA food matches">
          <h3 className="text-sm font-semibold text-text">
            Choose the closest match
          </h3>
          <ul className="space-y-2">
            {foods.map((food) => (
              <li key={food.fdcId}>
                <button
                  type="button"
                  disabled={isLoadingSuggestions || isSaving}
                  onClick={() => void handleSelectFood(food)}
                  className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-green-50 disabled:opacity-50"
                >
                  <span className="block font-medium text-text">
                    {food.description}
                  </span>
                  <span className="block text-sm text-muted">
                    {food.dataType}
                    {food.brandOwner ? ` · ${food.brandOwner}` : ''} · FDC{' '}
                    {food.fdcId}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoadingSuggestions && (
        <p role="status" className="text-sm text-muted">
          Loading USDA portion measurements...
        </p>
      )}

      {selectedFood && suggestions.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-text">Choose a volume portion</h3>
            <p className="text-sm text-muted">{selectedFood.description}</p>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <label
                key={suggestion.portionId}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3"
              >
                <input
                  type="radio"
                  name={`density-portion-${ingredient.ingredientId}`}
                  value={suggestion.portionId}
                  checked={selectedPortionId === String(suggestion.portionId)}
                  disabled={isSaving}
                  onChange={(event) => setSelectedPortionId(event.target.value)}
                  className="mt-1"
                />
                <span className="min-w-0 text-sm">
                  <span className="block font-medium text-text">
                    {suggestion.portionDescription}
                  </span>
                  <span className="block text-muted">
                    {suggestion.gramWeight} g per measured portion ·{' '}
                    {suggestion.densityGramsPerMl} g/mL
                  </span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted">
            Review that the USDA food and portion represent your ingredient
            before confirming. This conversion will apply to volume and weight
            costing for this ingredient.
          </p>
          <Button
            type="button"
            disabled={!selectedPortionId || isSaving}
            onClick={() => void handleConfirm()}
          >
            {isSaving ? 'Saving...' : 'Confirm density'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isSaving}
            onClick={() => {
              setSelectedFood(null);
              setSuggestions([]);
              setSelectedPortionId('');
            }}
          >
            Choose another food
          </Button>
        </div>
      )}
    </section>
  );
}
