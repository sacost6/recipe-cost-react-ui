const PRODUCTS = '/api/products';
const PRODUCT_PRICES = '/api/product-prices';
const INGREDIENTS = '/api/ingredients';
const CATEGORIES = '/api/categories';

export const endpoints = {
  products: {
    list: PRODUCTS,
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
    update: (ingredientId: string) => `${INGREDIENTS}/${ingredientId}`,
    delete: (ingredientId: string) => `${INGREDIENTS}/${ingredientId}`,
  },
  categories: {
    list: CATEGORIES,
  },
};
