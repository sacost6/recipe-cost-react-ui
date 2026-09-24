import React, { useState, useEffect, useCallback } from 'react';
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
import { IngredientContext } from './IngredientsContext';

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
    let cancelled = false;

    void listIngredients()
      .then((loadedIngredients) => {
        if (cancelled) return;

        setIngredients(loadedIngredients);
        setIsLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;

        setError(
          error instanceof Error ? error.message : 'Failed to load ingredients',
        );
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addIngredient = async (
    ingredient: CreateIngredientInput,
  ): Promise<Ingredient> => {
    setError(null);

    try {
      const createdIngredient = await createIngredient(ingredient);

      setIngredients((current) => [createdIngredient, ...current]);

      return createdIngredient;
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
  ): Promise<Ingredient> => {
    setError(null);

    try {
      const updatedIngredient = await updateIngredientRequest(id, ingredient);

      setIngredients((prev) =>
        prev.map((item) =>
          item.ingredientId === id ? updatedIngredient : item,
        ),
      );

      return updatedIngredient;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update ingredient',
      );
      throw error;
    }
  };

  return (
    <IngredientContext.Provider
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
    </IngredientContext.Provider>
  );
}
