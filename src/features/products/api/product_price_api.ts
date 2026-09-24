import { apiRequest } from '../../../lib/http';
import { endpoints } from '../../../lib/endpoints';
import type {
  ProductPrice,
  CreateProductPriceInput,
} from '../types/productPriceTypes';

export function listProductPrices(productId: string): Promise<ProductPrice[]> {
  return apiRequest<ProductPrice[]>(endpoints.products.prices(productId));
}

export function createProductPrice(
  input: CreateProductPriceInput,
): Promise<ProductPrice> {
  return apiRequest<ProductPrice>(endpoints.productPrices.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
