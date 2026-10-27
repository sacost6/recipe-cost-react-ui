import { apiRequest } from '../../lib/http';
import { endpoints } from '../../lib/endpoints';
import type {
  CreateIngredientInput,
  Ingredient,
  IngredientCategory,
  UpdateIngredientInput,
} from './types';
import type {
  IngredientDensity,
  UsdaDensitySuggestion,
  UsdaFoodSearchResult,
} from './types/densityTypes';

export function listIngredients(): Promise<Ingredient[]> {
  return apiRequest<Ingredient[]>(endpoints.ingredients.list);
}

export function createIngredient(
  input: CreateIngredientInput,
): Promise<Ingredient> {
  return apiRequest<Ingredient>(endpoints.ingredients.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateIngredient(
  id: Ingredient['ingredientId'],
  input: UpdateIngredientInput,
): Promise<Ingredient> {
  return apiRequest<Ingredient>(endpoints.ingredients.detail(id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteIngredient(
  id: Ingredient['ingredientId'],
): Promise<void> {
  return apiRequest<void>(endpoints.ingredients.detail(id), {
    method: 'DELETE',
  });
}

export function listIngredientCategories(): Promise<IngredientCategory[]> {
  return apiRequest<IngredientCategory[]>(endpoints.categories.list);
}

export function getIngredientDensity(
  ingredientId: string,
): Promise<IngredientDensity | null> {
  return apiRequest<IngredientDensity | null>(
    endpoints.ingredients.density(ingredientId),
  );
}

export function searchUsdaFoodsForIngredient(
  ingredientId: string,
  query: string,
): Promise<UsdaFoodSearchResult[]> {
  return apiRequest<UsdaFoodSearchResult[]>(
    endpoints.ingredients.densitySearch(ingredientId),
    { method: 'POST', body: JSON.stringify({ query }) },
  );
}

export function getUsdaDensitySuggestionsForIngredient(
  ingredientId: string,
  fdcId: number,
): Promise<UsdaDensitySuggestion[]> {
  return apiRequest<UsdaDensitySuggestion[]>(
    endpoints.ingredients.densitySuggestions(ingredientId, fdcId),
  );
}

export function saveIngredientDensity(
  ingredientId: string,
  input: { fdcId: number; portionId: number },
): Promise<IngredientDensity> {
  return apiRequest<IngredientDensity>(
    endpoints.ingredients.density(ingredientId),
    { method: 'PUT', body: JSON.stringify(input) },
  );
}

export function deleteIngredientDensity(ingredientId: string): Promise<void> {
  return apiRequest<void>(endpoints.ingredients.density(ingredientId), {
    method: 'DELETE',
  });
}
