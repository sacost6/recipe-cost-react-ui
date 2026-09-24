const PRODUCTS = '/api/products';
const PRODUCT_PRICES = '/api/product-prices';
const INGREDIENTS = '/api/ingredients';
const CATEGORIES = '/api/categories';
const UNITS = 'api/units';
export const endpoints = {
  products: {
    list: (query: string) => `${PRODUCTS}?${query}`,
    create: PRODUCTS,
    detail: (productId: string) =>
      `${PRODUCTS}/${encodeURIComponent(productId)}`,
    prices: (productId: string) =>
      `${PRODUCTS}/${encodeURIComponent(productId)}/prices`,
  },
  productPrices: {
    create: PRODUCT_PRICES,
  },
  ingredients: {
    list: INGREDIENTS,
    create: INGREDIENTS,
    detail: (ingredientId: string) =>
      `${INGREDIENTS}/${encodeURIComponent(ingredientId)}`,
  },
  categories: {
    list: CATEGORIES,
  },
  units: {
    list: UNITS,
  },
};
