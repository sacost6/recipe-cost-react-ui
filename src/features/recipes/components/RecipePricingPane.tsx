import { useEffect, useId, useState } from 'react';
import Button from '../../../components/Button';
import { listStoreLocations } from '../../products/api/store_locations_api';
import type { StoreLocation } from '../../products/types/storeLocationTypes';
import { getRecipePricing } from '../api';
import type { Recipe, RecipePricing } from '../types';

interface RecipePricingPaneProps {
  recipe: Recipe;
}

const issueLabels = {
  missing_product: 'No product is linked to this ingredient.',
  missing_price: 'No price is recorded for this store.',
  missing_conversion: 'The recipe amount cannot be converted to a package unit.',
};

function storeLabel(store: StoreLocation): string {
  const address = [store.addressLine1, store.city, store.stateCode]
    .filter(Boolean)
    .join(', ');
  return `${store.retailer.name} · ${address}`;
}

function formatCost(amount: string | null, currency: string | null): string {
  if (amount === null) return 'Incomplete';
  return currency ? `${currency} ${amount}` : amount;
}

export default function RecipePricingPane({ recipe }: RecipePricingPaneProps) {
  const headingId = useId();
  const storeSelectId = useId();
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [storeLocationId, setStoreLocationId] = useState('');
  const [pricing, setPricing] = useState<RecipePricing | null>(null);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    void listStoreLocations()
      .then((loadedStores) => {
        if (ignore) return;
        setStores(loadedStores);
        setStoreLocationId((current) => current || loadedStores[0]?.storeLocationId || '');
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load store locations.',
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoadingStores(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function handleCalculate() {
    if (!storeLocationId || isCalculating) return;
    setPricingError(null);
    setIsCalculating(true);
    try {
      setPricing(await getRecipePricing(recipe.recipeId, storeLocationId));
    } catch (error) {
      setPricing(null);
      setPricingError(
        error instanceof Error
          ? error.message
          : 'Unable to calculate recipe costs.',
      );
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <section
      aria-labelledby={headingId}
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      <div>
        <h2 id={headingId} className="text-lg font-semibold text-text">
          Recipe cost
        </h2>
        <p className="mt-1 text-sm text-muted">
          Costs use the latest recorded price for each product at the selected
          store. Missing prices or conversions are shown per ingredient.
        </p>
      </div>

      {isLoadingStores ? (
        <p role="status" className="text-sm text-muted">
          Loading store locations...
        </p>
      ) : loadError ? (
        <p role="alert" className="text-sm text-red-700">{loadError}</p>
      ) : stores.length === 0 ? (
        <p className="text-sm text-muted">
          Add a store location and record product prices to calculate this
          recipe.
        </p>
      ) : (
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xl">
            <label
              htmlFor={storeSelectId}
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Store location
            </label>
            <select
              id={storeSelectId}
              value={storeLocationId}
              disabled={isCalculating}
              onChange={(event) => {
                setStoreLocationId(event.target.value);
                setPricing(null);
                setPricingError(null);
              }}
              className="w-full rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm text-text"
            >
              {stores.map((store) => (
                <option key={store.storeLocationId} value={store.storeLocationId}>
                  {storeLabel(store)}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            disabled={!storeLocationId || isCalculating}
            onClick={() => void handleCalculate()}
          >
            {isCalculating ? 'Calculating...' : 'Calculate cost'}
          </Button>
        </div>
      )}

      {pricingError && (
        <p role="alert" className="text-sm text-red-700">{pricingError}</p>
      )}

      {pricing && (
        <div className="space-y-4">
          <dl className="grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-muted">Known subtotal</dt>
              <dd className="font-semibold text-text">
                {formatCost(pricing.knownSubtotal, pricing.currencyCode)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Full recipe cost</dt>
              <dd className="font-semibold text-text">
                {formatCost(pricing.totalCost, pricing.currencyCode)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Cost per serving</dt>
              <dd className="font-semibold text-text">
                {formatCost(pricing.costPerServing, pricing.currencyCode)}
              </dd>
            </div>
          </dl>

          {!pricing.isComplete && (
            <p role="status" className="text-sm text-muted">
              The full cost is unavailable until every ingredient has a usable
              product price and unit conversion.
            </p>
          )}

          <ul className="divide-y divide-border rounded-lg border border-border">
            {pricing.lines.map((line) => (
              <li
                key={line.recipeIngredientId}
                className="flex flex-col gap-1 p-3 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-medium text-text">
                    {line.ingredientName}
                    <span className="ml-2 text-sm font-normal text-muted">
                      {line.quantity} {line.unit}
                    </span>
                  </p>
                  {line.productName && (
                    <p className="text-sm text-muted">{line.productName}</p>
                  )}
                  {line.issue && (
                    <p className="text-sm text-amber-800">
                      {issueLabels[line.issue]}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-text">
                  {line.cost === null
                    ? '—'
                    : formatCost(line.cost, pricing.currencyCode)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
