import type { Update } from 'vite';
import { apiRequest } from '../../lib/http';
import type { Product, CreateProductInput, UpdateProductInput } from './types';

const PRODUCTS_PATH = '/api/products';

export function listProducts(): Promise<Product[]> {
  return apiRequest<Product[]>(PRODUCTS_PATH);
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
