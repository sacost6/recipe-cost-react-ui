import { useEffect, useId, useState } from 'react';
import type { SubmitEvent } from 'react';
import Button from '../../../components/Button';
import { searchKrogerProducts } from '../api/kroger_api';
import { listStoreLocations } from '../api/store_locations_api';
import type { StoreLocation } from '../types/storeLocationTypes';
import type {
  CreateProductInput,
  KrogerPriceSelection,
  KrogerProductSuggestion,
  Product,
  Unit,
} from '../types/productTypes';
import { inputClassName } from '../utils/classNames';

export interface ProductFormProps {
  ingredientId: string;
  initialValues?: Product;
  units: Unit[];
  unitReady: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (
    product: CreateProductInput,
    krogerPrice?: KrogerPriceSelection,
  ) => void | Promise<void>;
}

function normalizeUnit(value: string): string {
  return value.trim().toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ');
}

function parsePackageSize(
  size: string,
  units: Unit[],
): { quantity: string; unitId: number | null } | null {
  const match = size.trim().match(/^(\d+(?:\.\d+)?)\s*(.*?)$/);
  if (!match) return null;

  const quantity = match[1];
  if (!/^\d{1,8}(?:\.\d{1,4})?$/.test(quantity)) return null;

  const suffix = normalizeUnit(match[2]);
  if (!suffix) return { quantity, unitId: null };

  const aliases: Record<string, string[]> = {
    g: ['g', 'gram', 'grams'],
    kg: ['kg', 'kilogram', 'kilograms'],
    lb: ['lb', 'lbs', 'pound', 'pounds'],
    oz: ['oz', 'ounce', 'ounces'],
    ml: ['ml', 'milliliter', 'milliliters'],
    l: ['l', 'liter', 'liters'],
    'fl oz': ['fl oz', 'fluid ounce', 'fluid ounces'],
    gal: ['gal', 'gallon', 'gallons'],
    qt: ['qt', 'quart', 'quarts'],
    pt: ['pt', 'pint', 'pints'],
    ct: ['ct', 'count', 'counts', 'each', 'ea'],
  };
  const acceptedNames = new Set([suffix]);
  for (const options of Object.values(aliases)) {
    if (options.includes(suffix)) {
      options.forEach((option) => acceptedNames.add(normalizeUnit(option)));
    }
  }

  const unit = units.find(
    (candidate) =>
      acceptedNames.has(normalizeUnit(candidate.name)) ||
      acceptedNames.has(normalizeUnit(candidate.abbreviation)),
  );
  return { quantity, unitId: unit?.unitId ?? null };
}

interface SelectedKrogerProduct {
  product: KrogerProductSuggestion;
  store: StoreLocation;
}

export default function ProductForm({
  ingredientId,
  initialValues,
  onSubmit,
  units,
  unitReady,
  submitLabel = 'Save Product',
  onCancel,
}: ProductFormProps) {
  const [productName, setProductName] = useState(
    initialValues?.productName ?? '',
  );

  const [brand, setBrand] = useState(initialValues?.brand ?? '');
  const [packageQuantity, setPackageQuantity] = useState(
    initialValues?.packageQuantity ?? '',
  );
  const [selectedUnitId, setSelectedUnitId] = useState(
    initialValues ? String(initialValues.packageUnitId) : '',
  );
  const [upc, setUpc] = useState(initialValues?.upc ?? '');
  const productNameId = useId();
  const suggestionsId = useId();
  const [krogerStores, setKrogerStores] = useState<StoreLocation[]>([]);
  const [isLoadingKrogerStores, setIsLoadingKrogerStores] = useState(
    !initialValues,
  );
  const [krogerStoreError, setKrogerStoreError] = useState<string | null>(null);
  const [selectedKrogerStoreId, setSelectedKrogerStoreId] = useState('');
  const [krogerSuggestions, setKrogerSuggestions] = useState<
    KrogerProductSuggestion[]
  >([]);
  const [isSearchingKroger, setIsSearchingKroger] = useState(false);
  const [krogerSearchError, setKrogerSearchError] = useState<string | null>(
    null,
  );
  const [lastSearchedKrogerTerm, setLastSearchedKrogerTerm] = useState<
    string | null
  >(null);
  const [selectedKrogerProduct, setSelectedKrogerProduct] =
    useState<SelectedKrogerProduct | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const disabled = isSubmitting || !unitReady || units.length === 0;

  useEffect(() => {
    if (initialValues) return;

    let ignore = false;
    async function loadMappedStores(): Promise<void> {
      try {
        const stores = await listStoreLocations();
        if (ignore) return;
        const mappedStores = stores.filter((store) => store.krogerLocationId);
        setKrogerStores(mappedStores);
        if (mappedStores[0]) {
          setSelectedKrogerStoreId(mappedStores[0].storeLocationId);
        }
      } catch (error) {
        if (ignore) return;
        setKrogerStoreError(
          error instanceof Error
            ? error.message
            : 'Unable to load mapped Kroger stores.',
        );
      } finally {
        if (!ignore) setIsLoadingKrogerStores(false);
      }
    }

    void loadMappedStores();
    return () => {
      ignore = true;
    };
  }, [initialValues]);

  useEffect(() => {
    const term = productName.trim();
    const selectedStore = krogerStores.find(
      (store) => store.storeLocationId === selectedKrogerStoreId,
    );
    if (
      initialValues ||
      selectedKrogerProduct ||
      !selectedStore?.krogerLocationId ||
      term.length < 2
    ) {
      return;
    }

    let ignore = false;
    const timeoutId = window.setTimeout(async () => {
      setIsSearchingKroger(true);
      setKrogerSearchError(null);
      setLastSearchedKrogerTerm(null);
      try {
        const results = await searchKrogerProducts(
          term,
          selectedStore.krogerLocationId!,
        );
        if (!ignore) {
          setKrogerSuggestions(results);
          setLastSearchedKrogerTerm(term);
        }
      } catch (error) {
        if (!ignore) {
          setKrogerSuggestions([]);
          setLastSearchedKrogerTerm(null);
          setKrogerSearchError(
            error instanceof Error
              ? error.message
              : 'Unable to search Kroger products.',
          );
        }
      } finally {
        if (!ignore) setIsSearchingKroger(false);
      }
    }, 300);

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    initialValues,
    krogerStores,
    productName,
    selectedKrogerProduct,
    selectedKrogerStoreId,
  ]);

  function resetForm() {
    setProductName('');
    setBrand('');
    setPackageQuantity('');
    setSelectedUnitId('');
    setUpc('');
    setSelectedKrogerProduct(null);
    setFormError(null);
  }

  function selectKrogerProduct(product: KrogerProductSuggestion): void {
    const store = krogerStores.find(
      (candidate) => candidate.storeLocationId === selectedKrogerStoreId,
    );
    if (!store) return;

    setProductName(product.productName.slice(0, 150));
    setBrand(product.brand ?? '');
    setUpc(product.upc ?? '');
    if (product.packageSize) {
      const packageDetails = parsePackageSize(product.packageSize, units);
      if (packageDetails) {
        setPackageQuantity(packageDetails.quantity);
        setSelectedUnitId(
          packageDetails.unitId === null ? '' : String(packageDetails.unitId),
        );
      }
    }
    setSelectedKrogerProduct({ product, store });
    setKrogerSuggestions([]);
    setLastSearchedKrogerTerm(null);
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (disabled) return;

    setFormError(null);

    const trimmedName = productName.trim();
    const quantity = packageQuantity.trim();

    if (!trimmedName) {
      setFormError('Enter a product name.');
      return;
    }

    // Match the backend's positive decimal format.
    if (!/^\d{1,8}(?:\.\d{1,4})?$/.test(quantity) || !/[1-9]/.test(quantity)) {
      setFormError(
        'Enter a positive quantity with up to 8 digits before ' +
          'the decimal and 4 after it.',
      );
      return;
    }

    const selectedUnit = units.find(
      (unit) => unit.unitId === Number(selectedUnitId),
    );

    if (!selectedUnit) {
      setFormError('Select a package unit.');
      return;
    }

    setIsSubmitting(true);

    try {
      const krogerPrice = selectedKrogerProduct?.product.currentPrice
        ? {
            storeLocationId: selectedKrogerProduct.store.storeLocationId,
            price: selectedKrogerProduct.product.currentPrice,
          }
        : undefined;

      await onSubmit(
        {
          ingredientId,
          productName: trimmedName,
          brand: brand.trim() || null,
          packageQuantity: quantity,
          packageUnitId: selectedUnit.unitId,
          upc: upc.trim() || null,
        },
        krogerPrice,
      );

      if (!initialValues) {
        resetForm();
      }
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to save the product.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      {!unitReady && (
        <p role="status" className="text-sm text-muted">
          Loading package units...
        </p>
      )}

      {unitReady && units.length === 0 && (
        <p role="alert" className="text-sm text-red-700">
          No package units are available.
        </p>
      )}

      <fieldset disabled={disabled} className="space-y-4">
        {!initialValues && (
          <section className="space-y-3 rounded-lg border border-border p-4">
            <div>
              <h3 className="font-semibold text-text">Find a Kroger product</h3>
              <p className="text-sm text-muted">
                Search your selected store to fill in product details and its
                current price.
              </p>
            </div>

            {isLoadingKrogerStores ? (
              <p role="status" className="text-sm text-muted">
                Loading mapped Kroger stores...
              </p>
            ) : krogerStoreError ? (
              <p role="status" className="text-sm text-muted">
                {krogerStoreError}
              </p>
            ) : krogerStores.length === 0 ? (
              <p className="text-sm text-muted">
                Map one of your saved store locations to Kroger to get product
                recommendations and prices.
              </p>
            ) : (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm">Kroger store</span>
                  <select
                    value={selectedKrogerStoreId}
                    onChange={(event) => {
                      setSelectedKrogerStoreId(event.target.value);
                      setSelectedKrogerProduct(null);
                      setKrogerSuggestions([]);
                      setKrogerSearchError(null);
                      setLastSearchedKrogerTerm(null);
                      setIsSearchingKroger(false);
                    }}
                    className={inputClassName}
                  >
                    {krogerStores.map((store) => (
                      <option
                        key={store.storeLocationId}
                        value={store.storeLocationId}
                      >
                        {store.retailer.name}: {store.addressLine1},{' '}
                        {store.city}
                        {store.stateCode ? `, ${store.stateCode}` : ''}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedKrogerProduct && (
                  <p role="status" className="text-sm text-text">
                    Using {selectedKrogerProduct.store.retailer.name} data for{' '}
                    {selectedKrogerProduct.store.addressLine1}.{' '}
                    {selectedKrogerProduct.product.currentPrice
                      ? `The $${selectedKrogerProduct.product.currentPrice} package price will be recorded when you save.`
                      : 'Kroger did not return a current price for this item.'}
                  </p>
                )}
              </>
            )}
          </section>
        )}

        <div className="block">
          <label htmlFor={productNameId} className="mb-1 block text-sm">
            Product name
          </label>
          <input
            id={productNameId}
            required
            type="text"
            maxLength={150}
            placeholder="e.g. 2% Milk"
            value={productName}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={krogerSuggestions.length > 0 || isSearchingKroger}
            aria-controls={suggestionsId}
            onChange={(event) => {
              setProductName(event.target.value);
              setSelectedKrogerProduct(null);
              setKrogerSuggestions([]);
              setKrogerSearchError(null);
              setLastSearchedKrogerTerm(null);
              setIsSearchingKroger(false);
            }}
            className={inputClassName}
          />
          {isSearchingKroger && (
            <span role="status" className="mt-1 block text-sm text-muted">
              Searching Kroger...
            </span>
          )}
          {krogerSearchError && (
            <span role="status" className="mt-1 block text-sm text-muted">
              {krogerSearchError}
            </span>
          )}
          {krogerSuggestions.length > 0 && (
            <ul
              id={suggestionsId}
              role="listbox"
              className="mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
            >
              {krogerSuggestions.map((suggestion, index) => (
                <li key={`${suggestion.upc ?? suggestion.productName}-${index}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    onClick={() => selectKrogerProduct(suggestion)}
                    className="w-full border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                  >
                    <span className="block font-medium text-text">
                      {suggestion.productName}
                    </span>
                    <span className="block text-sm text-muted">
                      {[suggestion.brand, suggestion.packageSize]
                        .filter(Boolean)
                        .join(' · ') || 'Package details unavailable'}
                    </span>
                    <span className="block text-sm text-text">
                      {suggestion.currentPrice
                        ? suggestion.promoPrice
                          ? `Sale $${suggestion.promoPrice} · regular $${suggestion.regularPrice ?? '—'}`
                          : `$${suggestion.currentPrice}`
                        : 'Price unavailable'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {lastSearchedKrogerTerm === productName.trim() &&
            krogerSuggestions.length === 0 &&
            !isSearchingKroger && (
              <span className="mt-1 block text-sm text-muted">
                No Kroger products found for this search.
              </span>
            )}
        </div>

        <label className="block">
          <span className="mb-1 block text-sm">Brand (optional)</span>
          <input
            type="text"
            maxLength={100}
            value={brand}
            placeholder="e.g. Fairlife"
            onChange={(event) => {
              setBrand(event.target.value);
              setSelectedKrogerProduct(null);
            }}
            className={inputClassName}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block min-w-0">
            <span className="mb-1 block text-sm">Package quantity</span>
            <input
              required
              type="text"
              inputMode="decimal"
              maxLength={13}
              value={packageQuantity}
              placeholder="e.g. 1"
              onChange={(event) => {
                setPackageQuantity(event.target.value);
                setSelectedKrogerProduct(null);
              }}
              className={inputClassName}
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-1 block text-sm">Package unit</span>
            <select
              required
              value={selectedUnitId}
              onChange={(event) => {
                setSelectedUnitId(event.target.value);
                setSelectedKrogerProduct(null);
              }}
              className={inputClassName}
            >
              <option value="">Select a unit</option>

              {units.map((unit) => (
                <option key={unit.unitId} value={unit.unitId}>
                  {unit.name} ({unit.abbreviation})
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm">UPC (optional)</span>
          <input
            type="text"
            maxLength={20}
            value={upc}
            placeholder="e.g. 012345678905"
            onChange={(event) => {
              setUpc(event.target.value);
              setSelectedKrogerProduct(null);
            }}
            className={inputClassName}
          />
        </label>
      </fieldset>

      {formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-6 -mb-6 flex flex-wrap justify-end gap-3 rounded-b-xl border-t border-border bg-surface px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={disabled}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
