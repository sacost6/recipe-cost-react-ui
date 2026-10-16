import type { Ingredient } from '../ingredients/types';
import type { Unit } from '../products/types/productTypes';

export interface Recipe {
  recipeId: string;
  userId: string;
  name: string;
  description: string | null;
  instructions: string;
  servings: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeInput {
  name: string;
  description?: string | null;
  instructions?: string;
  servings: number;
}

export type UpdateRecipeInput = Partial<CreateRecipeInput> & {
  version: number;
};

export interface RecipeIngredient {
  recipeIngredientId: string;
  recipeId: string;
  ingredientId: string;
  quantity: string;
  unitId: number;
  sortOrder: number;
  ingredient: Omit<Ingredient, 'category'>;
  unit: Unit;
}

export interface CreateRecipeIngredientInput {
  ingredientId: string;
  quantity: string;
  unitId: number;
  sortOrder?: number;
}

export type UpdateRecipeIngredientInput = Partial<CreateRecipeIngredientInput>;
