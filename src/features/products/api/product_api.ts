import { endpoints } from '../../../lib/endpoints';
import { apiRequest } from '../../../lib/http';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  Unit,
} from '../types/productTypes';

export async function listProducts(): Promise<Product[]> {
  const products: Product[] = [];
  const pageSize = 100;
  let page: Product[];

  do {
    const query = new URLSearchParams({
      limit: String(pageSize),
      offset: String(products.length),
    });
    page = await apiRequest<Product[]>(
      endpoints.products.list(query.toString()),
    );
    products.push(...page);
  } while (page.length === pageSize);

  return products;
}

export function getProductById(
  productId: Product['productId'],
): Promise<Product> {
  return apiRequest<Product>(endpoints.products.detail(productId));
}

export function createProduct(input: CreateProductInput): Promise<Product> {
  return apiRequest<Product>(endpoints.products.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateProduct(
  id: Product['productId'],
  input: UpdateProductInput,
): Promise<Product> {
  return apiRequest<Product>(endpoints.products.detail(id), {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: Product['productId']): Promise<void> {
  return apiRequest<void>(endpoints.products.detail(id), {
    method: 'DELETE',
  });
}

export function listUnits(): Promise<Unit[]> {
  return apiRequest<Unit[]>(endpoints.units.list);
}
