const PRODUCTS = '/api/products';
const PRODUCT_PRICES = '/api/product-prices';
const INGREDIENTS = '/api/ingredients';
const CATEGORIES = '/api/categories';
const UNITS = '/api/units';
const STORE_LOCATIONS = '/api/store-locations';
const RETAILERS = '/api/retailers';
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
  },
  storeLocations: {
    list: STORE_LOCATIONS,
    create: STORE_LOCATIONS,
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
