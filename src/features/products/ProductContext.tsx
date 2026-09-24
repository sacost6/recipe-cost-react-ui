import { createContext, useContext } from 'react';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  Unit,
} from './types';

export interface ProductContextType {
  products: Product[];
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (product: CreateProductInput) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (
    id: Product['productId'],
    product: UpdateProductInput,
  ) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined,
);

export function useProductContext() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('Product context does not exist');
  }

  return context;
}
