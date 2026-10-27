import { apiRequest } from '../../lib/http';
import { endpoints } from '../../lib/endpoints';
import type {
  CreateRecipeIngredientInput,
  CreateRecipeInput,
  Recipe,
  RecipeIngredient,
  RecipePricing,
  UpdateRecipeIngredientInput,
  UpdateRecipeInput,
} from './types';

export function listRecipes(): Promise<Recipe[]> {
  return apiRequest<Recipe[]>(endpoints.recipes.list);
}

export function createRecipe(input: CreateRecipeInput): Promise<Recipe> {
  return apiRequest<Recipe>(endpoints.recipes.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateRecipe(
  id: Recipe['recipeId'],
  input: UpdateRecipeInput,
): Promise<Recipe> {
  return apiRequest<Recipe>(endpoints.recipes.detail(id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteRecipe(id: Recipe['recipeId']): Promise<void> {
  return apiRequest<void>(endpoints.recipes.detail(id), {
    method: 'DELETE',
  });
}

export function listRecipeIngredients(
  recipeId: Recipe['recipeId'],
): Promise<RecipeIngredient[]> {
  return apiRequest<RecipeIngredient[]>(
    endpoints.recipes.ingredients(recipeId),
  );
}

export function createRecipeIngredient(
  recipeId: Recipe['recipeId'],
  input: CreateRecipeIngredientInput,
): Promise<RecipeIngredient> {
  return apiRequest<RecipeIngredient>(endpoints.recipes.ingredients(recipeId), {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateRecipeIngredient(
  recipeId: Recipe['recipeId'],
  recipeIngredientId: RecipeIngredient['recipeIngredientId'],
  input: UpdateRecipeIngredientInput,
): Promise<RecipeIngredient> {
  return apiRequest<RecipeIngredient>(
    endpoints.recipes.ingredient(recipeId, recipeIngredientId),
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
}

export function deleteRecipeIngredient(
  recipeId: Recipe['recipeId'],
  recipeIngredientId: RecipeIngredient['recipeIngredientId'],
): Promise<void> {
  return apiRequest<void>(
    endpoints.recipes.ingredient(recipeId, recipeIngredientId),
    {
      method: 'DELETE',
    },
  );
}

export function getRecipePricing(
  recipeId: Recipe['recipeId'],
  storeLocationId: string,
): Promise<RecipePricing> {
  return apiRequest<RecipePricing>(
    endpoints.recipes.pricing(recipeId, storeLocationId),
  );
}
