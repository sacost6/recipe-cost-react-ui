import { useEffect, useId, useState } from 'react';
import Button from '../../../components/Button';
import {
  createProductPrice,
  listProductPrices,
} from '../api/product_price_api';
import { listStoreLocations } from '../api/store_locations_api';
import type { Product } from '../types/productTypes';
import type {
  CreateProductPriceInput,
  ProductPrice,
} from '../types/productPriceTypes';
import type { StoreLocation } from '../types/storeLocationTypes';
import ProductPriceForm from './ProductPriceForm';
import ProductPriceList from './ProductPriceList';

interface ProductPricesPaneProps {
  product: Product;
  onClose: () => void;
}

export default function ProductPricesPane({
  product,
  onClose,
}: ProductPricesPaneProps) {
  const headingId = useId();
  const { productId } = product;

  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadData(): Promise<void> {
      try {
        const [loadedPrices, loadedStores] = await Promise.all([
          listProductPrices(productId),
          listStoreLocations(),
        ]);

        if (ignore) return;

        setPrices(loadedPrices);
        setStores(loadedStores);
      } catch (error) {
        if (ignore) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Unable to load prices and store locations.',
        );
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [productId, loadAttempt]);

  function handleRetry(): void {
    setLoadError(null);
    setIsLoading(true);
    setLoadAttempt((current) => current + 1);
  }

  async function handleSubmit(input: CreateProductPriceInput): Promise<void> {
    setSuccessMessage(null);

    const saved = await createProductPrice({
      ...input,
      productId,
    });

    setPrices((current) => [saved, ...current]);
    setSuccessMessage('Price recorded.');
  }

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-text">
            Prices for {product.productName}
          </h2>

          <p className="text-sm text-muted">
            Record the price of one whole package at a store.
          </p>
        </div>

        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>

      {isLoading ? (
        <p role="status" className="text-sm text-muted">
          Loading prices and store locations...
        </p>
      ) : loadError ? (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-red-700">
            {loadError}
          </p>

          <Button type="button" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          {successMessage && (
            <p role="status" className="text-sm text-text">
              {successMessage}
            </p>
          )}

          {stores.length === 0 ? (
            <p className="text-sm text-muted">
              Add a store location before recording a price.
            </p>
          ) : (
            <ProductPriceForm
              productId={productId}
              stores={stores}
              onSubmit={handleSubmit}
            />
          )}

          <ProductPriceList prices={prices} stores={stores} />
        </>
      )}
    </section>
  );
}
