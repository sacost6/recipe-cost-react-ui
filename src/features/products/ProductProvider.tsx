import React, { useState, useEffect, useCallback } from 'react';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  Unit,
} from './types/productTypes';
import {
  createProduct,
  deleteProduct as deleteProductRequest,
  listProducts,
  listUnits,
  updateProduct as updateProductRequest,
} from './api/product_api';
import { ProductContext } from './ProductContext';

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [loadedProducts, loadedUnits] = await Promise.all([
        listProducts(),
        listUnits(),
      ]);
      setProducts(loadedProducts);
      setUnits(loadedUnits);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to load products',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void Promise.all([listProducts(), listUnits()])
      .then(([loadedProducts, loadedUnits]) => {
        if (cancelled) return;

        setProducts(loadedProducts);
        setUnits(loadedUnits);
        setIsLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;

        setError(
          error instanceof Error ? error.message : 'Failed to load products',
        );
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Forms and rows display mutation errors; this provider's error is for loading.
  const addProduct = async (product: CreateProductInput): Promise<Product> => {
    const createdProduct = await createProduct(product);
    setProducts((prev) => [createdProduct, ...prev]);
    return createdProduct;
  };

  const deleteProduct = async (id: Product['productId']): Promise<void> => {
    await deleteProductRequest(id);
    setProducts((prev) => prev.filter((product) => product.productId !== id));
  };

  const updateProduct = async (
    id: Product['productId'],
    product: UpdateProductInput,
  ): Promise<void> => {
    const updatedProduct = await updateProductRequest(id, product);
    setProducts((prev) =>
      prev.map((item) => (item.productId === id ? updatedProduct : item)),
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        units,
        isLoading,
        error,
        refreshProducts,
        addProduct,
        deleteProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
