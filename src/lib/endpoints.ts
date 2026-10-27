const PRODUCTS = '/api/products';
const PRODUCT_PRICES = '/api/product-prices';
const INGREDIENTS = '/api/ingredients';
const CATEGORIES = '/api/categories';
const UNITS = '/api/units';
const STORE_LOCATIONS = '/api/store-locations';
const RETAILERS = '/api/retailers';
const RECIPES = '/api/recipes';
export const endpoints = {
  products: {
    list: (query: string) => `${PRODUCTS}?${query}`,
    create: PRODUCTS,
    detail: (productId: string) =>
      `${PRODUCTS}/${encodeURIComponent(productId)}`,
    prices: (productId: string) =>
      `${PRODUCTS}/${encodeURIComponent(productId)}/prices`,
  },
  ingredients: {
    list: INGREDIENTS,
    create: INGREDIENTS,
    detail: (ingredientId: string) =>
      `${INGREDIENTS}/${encodeURIComponent(ingredientId)}`,
    density: (ingredientId: string) =>
      `${INGREDIENTS}/${encodeURIComponent(ingredientId)}/density`,
    densitySearch: (ingredientId: string) =>
      `${INGREDIENTS}/${encodeURIComponent(ingredientId)}/density/usda/search`,
    densitySuggestions: (ingredientId: string, fdcId: number) =>
      `${INGREDIENTS}/${encodeURIComponent(ingredientId)}/density/usda/${fdcId}/suggestions`,
  },
  recipes: {
    list: RECIPES,
    create: RECIPES,
    detail: (recipeId: string) => `${RECIPES}/${encodeURIComponent(recipeId)}`,
    pricing: (recipeId: string, storeLocationId: string) =>
      `${RECIPES}/${encodeURIComponent(recipeId)}/pricing?${new URLSearchParams({ storeLocationId })}`,
    ingredients: (recipeId: string) =>
      `${RECIPES}/${encodeURIComponent(recipeId)}/ingredients`,
    ingredient: (recipeId: string, recipeIngredientId: string) =>
      `${RECIPES}/${encodeURIComponent(recipeId)}/ingredients/${encodeURIComponent(recipeIngredientId)}`,
  },
  storeLocations: {
    list: STORE_LOCATIONS,
    create: STORE_LOCATIONS,
    krogerSearch: (query: string) =>
      `${STORE_LOCATIONS}/kroger/search?${query}`,
    detail: (storeLocationId: string) =>
      `${STORE_LOCATIONS}/${encodeURIComponent(storeLocationId)}`,
  },
  retailers: {
    list: RETAILERS,
  },
  productPrices: {
    create: PRODUCT_PRICES,
  },
  categories: {
    list: CATEGORIES,
  },
  units: {
    list: UNITS,
  },
};
