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
  instructions: string;
  servings: number;
}

export type UpdateRecipeInput = Partial<CreateRecipeInput> & {
  version: number;
};
