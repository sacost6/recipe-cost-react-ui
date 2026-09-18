import { apiRequest } from '../../lib/http';
import type {
  CreateIngredientInput,
  Ingredient,
  IngredientCategory,
  UpdateIngredientInput,
} from './types';

const INGREDIENTS_PATH = '/api/ingredients';
const CATEGORIES_PATH = '/api/categories';

export function listIngredients(): Promise<Ingredient[]> {
  return apiRequest<Ingredient[]>(INGREDIENTS_PATH);
}

export function createIngredient(
  input: CreateIngredientInput,
): Promise<Ingredient> {
  return apiRequest<Ingredient>(INGREDIENTS_PATH, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateIngredient(
  id: Ingredient['ingredientId'],
  input: UpdateIngredientInput,
): Promise<Ingredient> {
  return apiRequest<Ingredient>(`${INGREDIENTS_PATH}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteIngredient(
  id: Ingredient['ingredientId'],
): Promise<void> {
  return apiRequest<void>(`${INGREDIENTS_PATH}/${id}`, {
    method: 'DELETE',
  });
}

export function listIngredientCategories(): Promise<IngredientCategory[]> {
  return apiRequest<IngredientCategory[]>(`${CATEGORIES_PATH}`);
}
