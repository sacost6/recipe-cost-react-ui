import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createRecipe,
  createRecipeIngredient,
  deleteRecipe,
  deleteRecipeIngredient,
  listRecipeIngredients,
  listRecipes,
  updateRecipe,
  updateRecipeIngredient,
} from '../api';
import type { Recipe, RecipeIngredient } from '../types';

const recipe: Recipe = {
  recipeId: '42',
  userId: '7',
  name: 'Tomato soup',
  description: null,
  instructions: 'Simmer until tender.',
  servings: 4,
  version: 1,
  createdAt: '2026-10-14T12:00:00.000Z',
  updatedAt: '2026-10-14T12:00:00.000Z',
};

const recipeIngredient: RecipeIngredient = {
  recipeIngredientId: '9',
  recipeId: '42',
  ingredientId: '12',
  quantity: '2.5000',
  unitId: 3,
  sortOrder: 0,
  ingredient: {
    ingredientId: '12',
    name: 'Tomato',
    categoryId: null,
    description: null,
    userId: null,
    version: 1,
  },
  unit: {
    unitId: 3,
    name: 'pound',
    abbreviation: 'lb',
    unitType: 'weight',
    conversionToBase: '453.592370000',
    createdAt: '2026-10-14T12:00:00.000Z',
  },
};

let fetchMock: ReturnType<typeof vi.fn>;

function successResponse(data: unknown): Response {
  return new Response(JSON.stringify({ status: 'success', data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function expectRequest(path: string, method = 'GET', body?: unknown) {
  const [requestPath, options] = fetchMock.mock.calls[0] as [
    string,
    RequestInit,
  ];

  expect(requestPath).toBe(path);
  expect(options.method ?? 'GET').toBe(method);
  expect(options.headers).toMatchObject({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
  if (body !== undefined) {
    expect(options.body).toBe(JSON.stringify(body));
  }
}

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

describe('recipe API', () => {
  it('lists recipes and unwraps the response data', async () => {
    fetchMock.mockResolvedValue(successResponse([recipe]));

    await expect(listRecipes()).resolves.toEqual([recipe]);
    expectRequest('/api/recipes');
  });

  it('creates a recipe', async () => {
    const input = {
      name: 'Tomato soup',
      instructions: 'Simmer until tender.',
      servings: 4,
    };
    fetchMock.mockResolvedValue(successResponse(recipe));

    await expect(createRecipe(input)).resolves.toEqual(recipe);
    expectRequest('/api/recipes', 'POST', input);
  });

  it('updates a recipe with its version for optimistic concurrency', async () => {
    const input = { name: 'Roasted tomato soup', version: 1 };
    fetchMock.mockResolvedValue(successResponse(recipe));

    await expect(updateRecipe(recipe.recipeId, input)).resolves.toEqual(recipe);
    expectRequest('/api/recipes/42', 'PATCH', input);
  });

  it('deletes a recipe and handles the empty 204 response', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteRecipe(recipe.recipeId)).resolves.toBeUndefined();
    expectRequest('/api/recipes/42', 'DELETE');
  });
});

describe('recipe ingredient API', () => {
  it('lists recipe ingredients and unwraps the response data', async () => {
    fetchMock.mockResolvedValue(successResponse([recipeIngredient]));

    await expect(listRecipeIngredients(recipe.recipeId)).resolves.toEqual([
      recipeIngredient,
    ]);
    expectRequest('/api/recipes/42/ingredients');
  });

  it('adds a recipe ingredient', async () => {
    const input = {
      ingredientId: '12',
      quantity: '2.5000',
      unitId: 3,
    };
    fetchMock.mockResolvedValue(successResponse(recipeIngredient));

    await expect(
      createRecipeIngredient(recipe.recipeId, input),
    ).resolves.toEqual(recipeIngredient);
    expectRequest('/api/recipes/42/ingredients', 'POST', input);
  });

  it('updates a recipe ingredient', async () => {
    const input = { quantity: '3.0000', sortOrder: 1 };
    fetchMock.mockResolvedValue(successResponse(recipeIngredient));

    await expect(
      updateRecipeIngredient(
        recipe.recipeId,
        recipeIngredient.recipeIngredientId,
        input,
      ),
    ).resolves.toEqual(recipeIngredient);
    expectRequest('/api/recipes/42/ingredients/9', 'PATCH', input);
  });

  it('deletes a recipe ingredient and handles the empty 204 response', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(
      deleteRecipeIngredient(
        recipe.recipeId,
        recipeIngredient.recipeIngredientId,
      ),
    ).resolves.toBeUndefined();
    expectRequest('/api/recipes/42/ingredients/9', 'DELETE');
  });
});
