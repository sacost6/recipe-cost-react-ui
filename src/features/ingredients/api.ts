import { apiRequest } from '../../lib/http';
import { endpoints } from '../../lib/endpoints';
import type {
  CreateIngredientInput,
  Ingredient,
  IngredientCategory,
  UpdateIngredientInput,
} from './types';

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
  return apiRequest<Ingredient>(endpoints.ingredients.update(id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteIngredient(
  id: Ingredient['ingredientId'],
): Promise<void> {
  return apiRequest<void>(endpoints.ingredients.delete(id), {
    method: 'DELETE',
  });
}

export function listIngredientCategories(): Promise<IngredientCategory[]> {
  return apiRequest<IngredientCategory[]>(endpoints.categories.list);
}
