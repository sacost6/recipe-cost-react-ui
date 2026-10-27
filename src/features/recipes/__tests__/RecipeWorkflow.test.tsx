// @vitest-environment jsdom
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { IngredientContext } from '../../ingredients/IngredientsContext';
import type { IngredientContextType } from '../../ingredients/IngredientsContext';
import type { Ingredient } from '../../ingredients/types';
import { listUnits } from '../../products/api/product_api';
import type { Unit } from '../../products/types/productTypes';
import { RecipeContext } from '../RecipeContext';
import { useRecipeContext } from '../RecipeContext';
import type { RecipeContextType } from '../RecipeContext';
import { RecipeProvider } from '../RecipeProvider';
import {
  createRecipe,
  createRecipeIngredient,
  deleteRecipe,
  deleteRecipeIngredient,
  getRecipePricing,
  listRecipeIngredients,
  listRecipes,
  updateRecipe,
  updateRecipeIngredient,
} from '../api';
import RecipeIngredientsPane from '../components/RecipeIngredientsPane';
import RecipeList from '../components/RecipeList';
import RecipeDetailsPage from '../pages/RecipeDetailsPage';
import RecipePage from '../pages/RecipePage';
import type { Recipe, RecipeIngredient } from '../types';

vi.mock('../api', () => ({
  createRecipe: vi.fn(),
  createRecipeIngredient: vi.fn(),
  deleteRecipe: vi.fn(),
  deleteRecipeIngredient: vi.fn(),
  getRecipePricing: vi.fn(),
  listRecipeIngredients: vi.fn(),
  listRecipes: vi.fn(),
  updateRecipe: vi.fn(),
  updateRecipeIngredient: vi.fn(),
}));

vi.mock('../../products/api/product_api', () => ({
  listUnits: vi.fn(),
}));

vi.mock('../../products/api/store_locations_api', () => ({
  listStoreLocations: vi.fn().mockResolvedValue([]),
}));

const recipe: Recipe = {
  recipeId: '42',
  userId: '7',
  name: 'Tomato soup',
  description: 'A simple soup.',
  instructions: 'Chop the tomatoes.\nSimmer until soft.',
  servings: 4,
  version: 2,
  createdAt: '2026-10-14T12:00:00.000Z',
  updatedAt: '2026-10-14T12:00:00.000Z',
};

const tomato: Ingredient = {
  ingredientId: '12',
  name: 'Tomato',
  categoryId: null,
  category: null,
  description: null,
  userId: null,
  version: 1,
};

const salt: Ingredient = {
  ingredientId: '13',
  name: 'Salt',
  categoryId: null,
  category: null,
  description: null,
  userId: null,
  version: 1,
};

const grams: Unit = {
  unitId: 3,
  name: 'gram',
  abbreviation: 'g',
  unitType: 'weight',
  conversionToBase: '1',
  createdAt: '2026-10-14T12:00:00.000Z',
};

const cups: Unit = {
  unitId: 4,
  name: 'cup',
  abbreviation: 'cup',
  unitType: 'volume',
  conversionToBase: '236.588',
  createdAt: '2026-10-14T12:00:00.000Z',
};

const tomatoLine: RecipeIngredient = {
  recipeIngredientId: '9',
  recipeId: recipe.recipeId,
  ingredientId: tomato.ingredientId,
  quantity: '250.0000',
  unitId: grams.unitId,
  sortOrder: 0,
  ingredient: {
    ingredientId: tomato.ingredientId,
    name: tomato.name,
    categoryId: tomato.categoryId,
    description: tomato.description,
    userId: tomato.userId,
    version: tomato.version,
  },
  unit: grams,
};

const saltLine: RecipeIngredient = {
  recipeIngredientId: '10',
  recipeId: recipe.recipeId,
  ingredientId: salt.ingredientId,
  quantity: '2.0000',
  unitId: grams.unitId,
  sortOrder: 1,
  ingredient: {
    ingredientId: salt.ingredientId,
    name: salt.name,
    categoryId: salt.categoryId,
    description: salt.description,
    userId: salt.userId,
    version: salt.version,
  },
  unit: grams,
};

const mockedCreateRecipe = vi.mocked(createRecipe);
const mockedCreateRecipeIngredient = vi.mocked(createRecipeIngredient);
const mockedDeleteRecipe = vi.mocked(deleteRecipe);
const mockedDeleteRecipeIngredient = vi.mocked(deleteRecipeIngredient);
const mockedListRecipeIngredients = vi.mocked(listRecipeIngredients);
const mockedListRecipes = vi.mocked(listRecipes);
const mockedUpdateRecipe = vi.mocked(updateRecipe);
const mockedUpdateRecipeIngredient = vi.mocked(updateRecipeIngredient);
const mockedListUnits = vi.mocked(listUnits);

const ingredientContext: IngredientContextType = {
  ingredients: [tomato, salt],
  isLoading: false,
  error: null,
  refreshIngredients: vi.fn().mockResolvedValue(undefined),
  addIngredient: vi.fn(),
  deleteIngredient: vi.fn(),
  updateIngredient: vi.fn(),
};

function makeRecipeContext(
  values: Partial<RecipeContextType> = {},
): RecipeContextType {
  return {
    recipes: [recipe],
    isLoading: false,
    error: null,
    refreshRecipes: vi.fn().mockResolvedValue(undefined),
    addRecipe: vi.fn().mockResolvedValue(recipe),
    deleteRecipe: vi.fn().mockResolvedValue(undefined),
    updateRecipe: vi.fn().mockResolvedValue(recipe),
    ...values,
  };
}

function renderPane() {
  return render(
    <IngredientContext.Provider value={ingredientContext}>
      <RecipeIngredientsPane recipe={recipe} />
    </IngredientContext.Provider>,
  );
}

function LocationDisplay() {
  const location = useLocation();
  return <output aria-label="Current path">{location.pathname}</output>;
}

function renderRecipePage(context: RecipeContextType) {
  return render(
    <MemoryRouter initialEntries={['/recipes']}>
      <RecipeContext.Provider value={context}>
        <Routes>
          <Route path="/recipes" element={<RecipePage />} />
          <Route path="/recipes/:recipeId" element={<p>Recipe details</p>} />
        </Routes>
        <LocationDisplay />
      </RecipeContext.Provider>
    </MemoryRouter>,
  );
}

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
});

beforeEach(() => {
  vi.clearAllMocks();
  mockedListRecipeIngredients.mockResolvedValue([tomatoLine, saltLine]);
  mockedListUnits.mockResolvedValue([grams, cups]);
  mockedCreateRecipeIngredient.mockResolvedValue(tomatoLine);
  mockedDeleteRecipeIngredient.mockResolvedValue(undefined);
  mockedUpdateRecipeIngredient.mockImplementation(
    async (_recipeId, recipeIngredientId, input) => {
      const current =
        recipeIngredientId === tomatoLine.recipeIngredientId
          ? tomatoLine
          : saltLine;
      const updatedUnit = [grams, cups].find(
        (unit) => unit.unitId === (input.unitId ?? current.unitId),
      )!;
      const updatedIngredient = [tomato, salt].find(
        (ingredient) =>
          ingredient.ingredientId ===
          (input.ingredientId ?? current.ingredientId),
      )!;
      return {
        ...current,
        ...input,
        unit: updatedUnit,
        ingredient: {
          ingredientId: updatedIngredient.ingredientId,
          name: updatedIngredient.name,
          categoryId: updatedIngredient.categoryId,
          description: updatedIngredient.description,
          userId: updatedIngredient.userId,
          version: updatedIngredient.version,
        },
      };
    },
  );
});

afterEach(() => {
  cleanup();
});

describe('recipe details and ingredient lines', () => {
  it('shows recipe details without automatically calculating costs', async () => {
    mockedListRecipeIngredients.mockResolvedValue([tomatoLine]);
    const markdownRecipe = {
      ...recipe,
      instructions:
        '1. Chop the tomatoes.\n2. Simmer until soft.\n\n**Tip:** Season to taste.',
    };
    render(
      <MemoryRouter initialEntries={['/recipes/42']}>
        <RecipeContext.Provider
          value={makeRecipeContext({ recipes: [markdownRecipe] })}
        >
          <IngredientContext.Provider value={ingredientContext}>
            <Routes>
              <Route
                path="/recipes/:recipeId"
                element={<RecipeDetailsPage />}
              />
            </Routes>
          </IngredientContext.Provider>
        </RecipeContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Tomato soup' })).toBeTruthy();
    expect(screen.getByText('Makes 4 servings')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Instructions' })).toBeTruthy();
    expect(screen.getByText(/Chop the tomatoes\./)).toBeTruthy();
    expect(screen.getByRole('list').tagName).toBe('OL');
    expect(screen.getByText('Tip:').tagName).toBe('STRONG');
    expect(await screen.findByRole('row', { name: /Tomato/ })).toBeTruthy();
    expect(screen.queryByText(/\$\d/)).toBeNull();
    expect(getRecipePricing).not.toHaveBeenCalled();
  });

  it('loads recipe lines and presents quantity and unit in sort order', async () => {
    renderPane();

    const rows = await screen.findAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(rows[1].textContent).toContain('Tomato');
    expect(rows[1].textContent).toContain('250.0000');
    expect(rows[1].textContent).toContain('gram (g)');
    expect(rows[2].textContent).toContain('Salt');
    expect(mockedListRecipeIngredients).toHaveBeenCalledWith(recipe.recipeId);
    expect(mockedListUnits).toHaveBeenCalledOnce();
  });

  it('adds a line with its selected ingredient, quantity, unit, and order', async () => {
    const user = userEvent.setup();
    const createdLine: RecipeIngredient = {
      ...saltLine,
      recipeIngredientId: '11',
      quantity: '1.5000',
      sortOrder: 2,
    };
    mockedCreateRecipeIngredient.mockResolvedValue(createdLine);
    renderPane();

    await screen.findByRole('row', { name: /Tomato/ });
    await user.selectOptions(screen.getByLabelText('Ingredient'), '13');
    await user.type(screen.getByLabelText('Quantity'), '1.5');
    await user.selectOptions(screen.getByLabelText('Unit'), '3');
    await user.click(screen.getByRole('button', { name: 'Add ingredient' }));

    await waitFor(() =>
      expect(mockedCreateRecipeIngredient).toHaveBeenCalledWith(
        recipe.recipeId,
        {
          ingredientId: '13',
          quantity: '1.5',
          unitId: 3,
          sortOrder: 2,
        },
      ),
    );
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(4));
    expect(screen.getByText('1.5000')).toBeTruthy();
  });

  it('edits a line ingredient, quantity, and unit', async () => {
    const user = userEvent.setup();
    const updatedLine = {
      ...tomatoLine,
      ingredientId: salt.ingredientId,
      ingredient: saltLine.ingredient,
      quantity: '300.0000',
      unitId: cups.unitId,
      unit: cups,
    };
    mockedUpdateRecipeIngredient.mockResolvedValue(updatedLine);
    renderPane();

    const row = await screen.findByRole('row', { name: /Tomato/ });
    await user.click(within(row).getByRole('button', { name: 'Edit' }));
    await user.selectOptions(within(row).getByLabelText('Ingredient'), '13');
    const quantity = within(row).getByLabelText('Quantity');
    await user.clear(quantity);
    await user.type(quantity, '300');
    await user.selectOptions(within(row).getByLabelText('Unit'), '4');
    await user.click(within(row).getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(mockedUpdateRecipeIngredient).toHaveBeenCalledWith(
        recipe.recipeId,
        tomatoLine.recipeIngredientId,
        { ingredientId: '13', quantity: '300', unitId: 4 },
      ),
    );
    expect(await screen.findByRole('row', { name: /300.0000/ })).toBeTruthy();
  });

  it('deletes a line after confirmation', async () => {
    const user = userEvent.setup();
    renderPane();

    const row = await screen.findByRole('row', { name: /Tomato/ });
    await user.click(
      within(row).getByRole('button', { name: 'Delete Tomato' }),
    );
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    await waitFor(() =>
      expect(mockedDeleteRecipeIngredient).toHaveBeenCalledWith(
        recipe.recipeId,
        tomatoLine.recipeIngredientId,
      ),
    );
    expect(screen.queryByRole('row', { name: /Tomato/ })).toBeNull();
  });

  it('updates sort order when a line is moved', async () => {
    const user = userEvent.setup();
    renderPane();

    await screen.findByRole('row', { name: /Tomato/ });
    await user.click(screen.getByRole('button', { name: 'Move Tomato down' }));

    await waitFor(() =>
      expect(mockedUpdateRecipeIngredient).toHaveBeenCalledTimes(2),
    );
    expect(mockedUpdateRecipeIngredient).toHaveBeenCalledWith(
      recipe.recipeId,
      saltLine.recipeIngredientId,
      { sortOrder: 0 },
    );
    expect(mockedUpdateRecipeIngredient).toHaveBeenCalledWith(
      recipe.recipeId,
      tomatoLine.recipeIngredientId,
      { sortOrder: 1 },
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows[1].textContent).toContain('Salt');
      expect(rows[2].textContent).toContain('Tomato');
    });
  });
});

describe('recipe list and page', () => {
  it('formats selected text and previews Markdown instructions', async () => {
    const user = userEvent.setup();
    renderRecipePage(makeRecipeContext({ recipes: [] }));

    await user.click(screen.getByRole('button', { name: 'Add recipe' }));
    const instructions = screen.getByRole('textbox', {
      name: 'Instructions',
    }) as HTMLTextAreaElement;
    await user.type(instructions, 'Mix well');
    instructions.setSelectionRange(0, instructions.value.length);
    await user.click(screen.getByRole('button', { name: 'Bold' }));
    expect(instructions.value).toBe('**Mix well**');

    await user.click(screen.getByRole('button', { name: 'Numbered list' }));
    expect(instructions.value).toBe('1. **Mix well**');

    expect(screen.getByRole('list').tagName).toBe('OL');
    expect(screen.getByText('Mix well').tagName).toBe('STRONG');
    expect(screen.getByRole('textbox', { name: 'Instructions' })).toBeTruthy();
    expect(screen.getByText('Preview')).toBeTruthy();
  });

  it('filters the list by recipe name or description', () => {
    render(
      <MemoryRouter>
        <RecipeList
          recipes={[
            recipe,
            {
              ...recipe,
              recipeId: '43',
              name: 'Garden salad',
              description: 'Fresh greens and herbs.',
            },
          ]}
          search="greens"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Garden salad/ })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Tomato soup/ })).toBeNull();
    expect(screen.getByText('Showing 1 of 2 recipes')).toBeTruthy();
  });

  it('creates a recipe and navigates to its details', async () => {
    const user = userEvent.setup();
    const addRecipe = vi.fn().mockResolvedValue(recipe);
    renderRecipePage(makeRecipeContext({ recipes: [], addRecipe }));

    await user.click(screen.getByRole('button', { name: 'Add recipe' }));
    await user.type(screen.getByLabelText('Name'), 'Tomato soup');
    await user.type(
      screen.getByRole('textbox', { name: 'Instructions' }),
      'Simmer gently.',
    );
    await user.clear(screen.getByLabelText('Servings'));
    await user.type(screen.getByLabelText('Servings'), '4');
    const addButtons = screen.getAllByRole('button', { name: 'Add recipe' });
    await user.click(addButtons[addButtons.length - 1]);

    await waitFor(() =>
      expect(addRecipe).toHaveBeenCalledWith({
        name: 'Tomato soup',
        description: null,
        instructions: 'Simmer gently.',
        servings: 4,
      }),
    );
    expect(await screen.findByText('Recipe details')).toBeTruthy();
    expect(screen.getByLabelText('Current path').textContent).toBe(
      '/recipes/42',
    );
  });

  it('edits a recipe with its current version', async () => {
    const user = userEvent.setup();
    const saveRecipe = vi.fn().mockResolvedValue({
      ...recipe,
      name: 'Roasted tomato soup',
      version: 3,
    });
    renderRecipePage(makeRecipeContext({ updateRecipe: saveRecipe }));

    await user.click(screen.getByRole('button', { name: 'Edit Tomato soup' }));
    const name = screen.getByLabelText('Name');
    await user.clear(name);
    await user.type(name, 'Roasted tomato soup');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() =>
      expect(saveRecipe).toHaveBeenCalledWith(recipe.recipeId, {
        name: 'Roasted tomato soup',
        description: 'A simple soup.',
        instructions: recipe.instructions,
        servings: 4,
        version: 2,
      }),
    );
  });
});

describe('recipe provider', () => {
  it('loads recipes and applies create, update, and delete results to context', async () => {
    const user = userEvent.setup();
    mockedListRecipes.mockResolvedValue([recipe]);
    mockedCreateRecipe.mockResolvedValue({
      ...recipe,
      recipeId: '43',
      name: 'Salad',
    });
    mockedUpdateRecipe.mockResolvedValue({ ...recipe, name: 'Updated soup' });
    mockedDeleteRecipe.mockResolvedValue(undefined);

    function ProviderActions() {
      const context = useRecipeContext();
      return (
        <>
          <p>{context.recipes.map((item) => item.name).join(', ')}</p>
          <button
            onClick={() =>
              void context.addRecipe({ name: 'Salad', servings: 2 })
            }
          >
            Add salad
          </button>
          <button
            onClick={() =>
              void context.updateRecipe(recipe.recipeId, {
                name: 'Updated soup',
                version: recipe.version,
              })
            }
          >
            Rename soup
          </button>
          <button onClick={() => void context.deleteRecipe('43')}>
            Remove salad
          </button>
        </>
      );
    }

    render(
      <RecipeProvider>
        <ProviderActions />
      </RecipeProvider>,
    );

    expect(await screen.findByText('Tomato soup')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Add salad' }));
    expect(await screen.findByText('Salad, Tomato soup')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Rename soup' }));
    expect(await screen.findByText('Salad, Updated soup')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Remove salad' }));
    await waitFor(() => expect(screen.getByText('Updated soup')).toBeTruthy());
    expect(mockedDeleteRecipe).toHaveBeenCalledWith('43');
  });
});
