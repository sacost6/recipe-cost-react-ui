import { createContext, useContext } from 'react';
import type {
  Ingredient,
  CreateIngredientInput,
  UpdateIngredientInput,
} from './types';

export interface IngredientContextType {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  refreshIngredients: () => Promise<void>;
  addIngredient: (ingredient: CreateIngredientInput) => Promise<Ingredient>;
  deleteIngredient: (id: string) => Promise<void>;
  updateIngredient: (
    id: Ingredient['ingredientId'],
    ingredient: UpdateIngredientInput,
  ) => Promise<Ingredient>;
}

export const IngredientContext = createContext<
  IngredientContextType | undefined
>(undefined);

// Custom hook for consuming context
export function useIngredientContext() {
  const context = useContext(IngredientContext);

  if (!context) {
    throw new Error('Ingredient context does not exist');
  }

  return context;
}
