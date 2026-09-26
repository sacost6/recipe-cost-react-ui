import { useEffect, useId, useRef, useState } from 'react';
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
import StoreLocationForm from './StoreLocationForm';
import { useProductContext } from '../ProductContext';

interface ProductPricesPaneProps {
  product: Product;
  onClose: () => void;
}

export default function ProductPricesPane({
  product,
  onClose,
}: ProductPricesPaneProps) {
  const headingId = useId();
  const formId = useId();
  const { productId } = product;
  const { units } = useProductContext();
  const unit = units.find((item) => item.unitId === product.packageUnitId);
  const productLabel = product.brand
    ? `${product.brand} ${product.productName}`
    : product.productName;

  const [prices, setPrices] = useState<ProductPrice[]>([]);
  const [stores, setStores] = useState<StoreLocation[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'price' | 'store' | null>(null);
  const addPriceRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const previousForm = useRef(activeForm);

  useEffect(() => {
    if (activeForm) {
      formRef.current?.focus({ preventScroll: true });
      formRef.current?.scrollIntoView({ block: 'nearest' });
    } else if (previousForm.current) {
      addPriceRef.current?.focus({ preventScroll: true });
    }

    previousForm.current = activeForm;
  }, [activeForm]);

  useEffect(() => {
    if (!successMessage) return;

    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

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
    setActiveForm(null);
    setSuccessMessage('Price recorded.');
  }

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-text">
            Prices for {productLabel}
          </h2>

          <p className="text-sm text-muted">
            Package: {product.packageQuantity}{' '}
            {unit?.abbreviation ?? 'unknown unit'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            ref={addPriceRef}
            type="button"
            disabled={isLoading || loadError !== null || activeForm !== null}
            aria-expanded={activeForm === 'price'}
            aria-controls={formId}
            onClick={() => {
              setSuccessMessage(null);
              setActiveForm('price');
            }}
          >
            Add price
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading || loadError !== null || activeForm !== null}
            onClick={() => {
              setSuccessMessage(null);
              setActiveForm('store');
            }}
          >
            Add store location
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
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

          <ProductPriceList prices={prices} stores={stores} />

          <div
            id={formId}
            ref={formRef}
            hidden={activeForm === null}
            tabIndex={-1}
            role="region"
            aria-label={
              activeForm === 'store'
                ? 'Add store location'
                : `Add price for ${productLabel}`
            }
            className="scroll-mt-24 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {activeForm === 'store' && (
              <StoreLocationForm
                onCreated={(location) => {
                  setStores((current) => [location, ...current]);
                  setActiveForm('price');
                }}
                onCancel={() => setActiveForm(null)}
              />
            )}

            {activeForm === 'price' &&
              (stores.length === 0 ? (
                <div className="space-y-3 rounded-lg border border-border p-4">
                  <h3 className="font-semibold text-text">
                    Add price for {productLabel}
                  </h3>
                  <p className="text-sm text-muted">
                    Add a store location to record where you found this price.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setActiveForm('store')}>
                      Add store location
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setActiveForm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <ProductPriceForm
                  productId={productId}
                  title={`Add price for ${productLabel}`}
                  stores={stores}
                  onSubmit={handleSubmit}
                  onCancel={() => setActiveForm(null)}
                />
              ))}
          </div>
        </>
      )}
    </section>
  );
}
