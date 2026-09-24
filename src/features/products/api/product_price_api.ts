import { apiRequest } from '../../../lib/http';
import { PRODUCTS_PATH } from './product_api';
import type {
  ProductPrice,
  CreateProductPriceInput,
} from '../types/productPriceTypes';

const PRODUCT_PRICES_PATH = '/api/product-prices';

const getProductPricesPath = (productId: string): string =>
  `${PRODUCTS_PATH}/${encodeURIComponent(productId)}/prices`;

export function listProductPrices(productId: string): Promise<ProductPrice[]> {
  return apiRequest<ProductPrice[]>(getProductPricesPath(productId));
}
