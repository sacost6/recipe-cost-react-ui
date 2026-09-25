import { useId } from 'react';
import type { ProductPrice } from '../types/productPriceTypes';
import type { StoreLocation } from '../types/storeLocationTypes';

interface ProductPriceListProps {
  prices: ProductPrice[];
  stores: StoreLocation[];
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatPrice(observation: ProductPrice): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: observation.currencyCode,
    currencyDisplay: 'code',
  }).format(Number(observation.price));
}

export default function ProductPriceList({
  prices,
  stores,
}: ProductPriceListProps) {
  const headingId = useId();

  const storesById = new Map(
    stores.map((store) => [store.storeLocationId, store]),
  );

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h3 id={headingId} className="font-semibold text-text">
        Price history
      </h3>

      {prices.length === 0 ? (
        <p className="text-sm text-muted">No prices recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">
              {' '}
              record package prices by store and date
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
              {prices.map((observation) => {
                const store = storesById.get(observation.storeLocationId);

                return (
                  <tr
                    key={observation.priceId}
                    className="border-t border-border"
                  >
                    <td className="px-4 py-3 font-medium text-text">
                      {formatPrice(observation)}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      {store ? (
                        <>
                          <div>
                            {store.addressLine1}
                            {store.addressLine2
                              ? `, ${store.addressLine2}`
                              : ''}
                          </div>

                          <div>
                            {store.city}, {store.stateCode} {store.postalCode}
                          </div>

                          {store.storeNumber && (
                            <div>Store {store.storeNumber}</div>
                          )}
                        </>
                      ) : (
                        'Store location unavailable'
                      )}
                    </td>

                    <td className="px-4 py-3 text-muted">
                      <time dateTime={observation.recordedAt}>
                        {dateFormatter.format(new Date(observation.recordedAt))}
                      </time>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
