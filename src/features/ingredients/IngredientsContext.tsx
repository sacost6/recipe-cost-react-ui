import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  createIngredient,
  deleteIngredient as deleteIngredientRequest,
  listIngredients,
  updateIngredient as updateIngredientRequest,
} from './api';
import type {
  Ingredient,
  CreateIngredientInput,
  UpdateIngredientInput,
} from './types';

export interface IngredientsContextType {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  refreshIngredients: () => Promise<void>;
  addIngredient: (ingredient: CreateIngredientInput) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
  updateIngredient: (
    id: Ingredient['ingredientId'],
    ingredient: UpdateIngredientInput,
  ) => Promise<void>;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(
  undefined,
);

export function IngredientsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshIngredients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const ingredients = await listIngredients();
      setIngredients(ingredients);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load ingredients',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshIngredients();
  }, [refreshIngredients]);

  const addIngredient = async (
    ingredient: CreateIngredientInput,
  ): Promise<void> => {
    setError(null);

    try {
      const createdIngredient = await createIngredient(ingredient);
      setIngredients((prev) => [createdIngredient, ...prev]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to add ingredient',
      );
      throw error;
    }
  };

  const deleteIngredient = async (
    id: Ingredient['ingredientId'],
  ): Promise<void> => {
    try {
      await deleteIngredientRequest(id);
      setIngredients((prev) =>
        prev.filter((ingredient) => ingredient.ingredientId !== id),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to delete ingredient',
      );
      throw error;
    }
  };

  const updateIngredient = async (
    id: Ingredient['ingredientId'],
    ingredient: UpdateIngredientInput,
  ): Promise<void> => {
    setError(null);

    try {
      const updatedIngredient = await updateIngredientRequest(id, ingredient);

      setIngredients((prev) =>
        prev.map((item) =>
          item.ingredientId === id ? updatedIngredient : item,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update ingredient',
      );
      throw error;
    }
  };

  return (
    <IngredientsContext.Provider
      value={{
        ingredients,
        isLoading,
        error,
        refreshIngredients,
        addIngredient,
        deleteIngredient,
        updateIngredient,
      }}
    >
      {children}
    </IngredientsContext.Provider>
  );
}

// Custom hook for consuming context
export function useIngredients() {
  const context = useContext(IngredientsContext);

  if (!context) {
    throw new Error(
      'useIngredients must be used within an IngredientsProvider',
    );
  }

  return context;
}
