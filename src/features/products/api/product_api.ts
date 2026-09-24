import { apiRequest } from '../../../lib/http';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  Unit,
} from '../types/productTypes';

export const PRODUCTS_PATH = '/api/products';

export async function listProducts(): Promise<Product[]> {
  const products: Product[] = [];
  const pageSize = 100;
  let page: Product[];

  do {
    const query = new URLSearchParams({
      limit: String(pageSize),
      offset: String(products.length),
    });
    page = await apiRequest<Product[]>(`${PRODUCTS_PATH}?${query}`);
    products.push(...page);
  } while (page.length === pageSize);

  return products;
}

export function createProduct(input: CreateProductInput): Promise<Product> {
  return apiRequest<Product>(PRODUCTS_PATH, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateProduct(
  id: Product['productId'],
  input: UpdateProductInput,
): Promise<Product> {
  return apiRequest<Product>(`${PRODUCTS_PATH}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: Product['productId']): Promise<void> {
  return apiRequest<void>(`${PRODUCTS_PATH}/${id}`, {
    method: 'DELETE',
  });
}

export function listUnits(): Promise<Unit[]> {
  return apiRequest<Unit[]>('/api/units');
}
