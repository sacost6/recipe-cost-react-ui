import { useId } from 'react';
import type { ProductPrice } from '../types/productPriceTypes';
import type { StoreLocation } from '../types/storeLocationTypes';
import ProductPriceRow from './ProductPriceRow';

interface ProductPriceListProps {
  prices: ProductPrice[];
  stores: StoreLocation[];
}

export default function ProductPriceList({
  prices,
  stores,
}: ProductPriceListProps) {
  const headingId = useId();
  const sortedPrices = [...prices].sort(
    (first, second) =>
      new Date(second.recordedAt).getTime() -
      new Date(first.recordedAt).getTime(),
  );

  const storesById = new Map(
    stores.map((store) => [store.storeLocationId, store]),
  );

  return (
    <section
      aria-labelledby={headingId}
      className="w-full min-w-0 max-w-full space-y-3"
    >
      <div>
        <h3 id={headingId} className="font-semibold text-text">
          Price history
        </h3>
        {prices.length > 0 && (
          <p className="text-sm text-muted">Newest observations first.</p>
        )}
      </div>

      {prices.length === 0 ? (
        <p className="text-sm text-muted">No prices recorded yet.</p>
      ) : (
        <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">
              Recorded package prices by store and date, newest first
            </caption>

            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Package Price
                </th>
                <th scope="col" className="px-4 py-3">
                  Store Location
                </th>
                <th scope="col" className="px-4 py-3">
                  Recorded
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedPrices.map((price, index) => (
                <ProductPriceRow
                  key={price.priceId}
                  price={price}
                  store={storesById.get(price.storeLocationId)}
                  isLatest={index === 0}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
