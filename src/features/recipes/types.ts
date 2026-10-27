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

export interface RecipePricingLine {
  recipeIngredientId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: string;
  unit: string;
  productId: string | null;
  productName: string | null;
  source: string | null;
  priceRecordedAt: string | null;
  cost: string | null;
  issue: 'missing_product' | 'missing_price' | 'missing_conversion' | null;
}

export interface RecipePricing {
  recipeId: string;
  storeLocationId: string;
  servings: number;
  lines: RecipePricingLine[];
  knownSubtotal: string;
  totalCost: string | null;
  costPerServing: string | null;
  currencyCode: string | null;
  isComplete: boolean;
}

export interface CreateRecipeIngredientInput {
  ingredientId: string;
  quantity: string;
  unitId: number;
  sortOrder?: number;
}

export type UpdateRecipeIngredientInput = Partial<CreateRecipeIngredientInput>;
