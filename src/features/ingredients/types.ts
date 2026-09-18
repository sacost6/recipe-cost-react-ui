export type IngredientUnit = 'lbs' | 'oz' | 'kg' | 'g' | 'gal' | 'units';

export type UpdateIngredientInput = Partial<CreateIngredientInput> & {
  version: number;
};

export interface Ingredient {
  ingredientId: string;
  name: string;
  categoryId: number | null;
  description: string | null;
  userId: string | null;
  version: number;
}

export interface CreateIngredientInput {
  name: string;
  categoryId?: number | null;
  description?: string | null;
}

export interface IngredientCategory {
  categoryId: number;
  name: string;
}
