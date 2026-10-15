import { createContext, useContext } from 'react';
import type { Recipe, CreateRecipeInput, UpdateRecipeInput } from './types';

export interface RecipeContextType {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  refreshRecipes: () => Promise<void>;
  addRecipe: (recipe: CreateRecipeInput) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
  updateRecipe: (
    id: Recipe['recipeId'],
    recipe: UpdateRecipeInput,
  ) => Promise<Recipe>;
}

export const RecipeContext = createContext<RecipeContextType | undefined>(
  undefined,
);

// Custom hook for consuming context
export function useRecipeContext() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error('Recipe context does not exist');
  }

  return context;
}
