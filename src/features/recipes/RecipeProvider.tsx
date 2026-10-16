import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  createRecipe,
  deleteRecipe as deleteRecipeRequest,
  listRecipes,
  updateRecipe as updateRecipeRequest,
} from './api';
import { RecipeContext } from './RecipeContext';
import type { CreateRecipeInput, Recipe, UpdateRecipeInput } from './types';

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setRecipes(await listRecipes());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to load recipes.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void listRecipes()
      .then((loadedRecipes) => {
        if (!cancelled) setRecipes(loadedRecipes);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : 'Unable to load recipes.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function addRecipe(input: CreateRecipeInput): Promise<Recipe> {
    setError(null);
    try {
      const created = await createRecipe(input);
      setRecipes((current) => [created, ...current]);
      return created;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to add the recipe.',
      );
      throw error;
    }
  }

  async function updateRecipe(
    id: Recipe['recipeId'],
    input: UpdateRecipeInput,
  ): Promise<Recipe> {
    setError(null);
    try {
      const updated = await updateRecipeRequest(id, input);
      setRecipes((current) =>
        current.map((recipe) => (recipe.recipeId === id ? updated : recipe)),
      );
      return updated;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to update the recipe.',
      );
      throw error;
    }
  }

  async function deleteRecipe(id: Recipe['recipeId']): Promise<void> {
    setError(null);
    try {
      await deleteRecipeRequest(id);
      setRecipes((current) =>
        current.filter((recipe) => recipe.recipeId !== id),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to delete the recipe.',
      );
      throw error;
    }
  }

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        isLoading,
        error,
        refreshRecipes,
        addRecipe,
        deleteRecipe,
        updateRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}
