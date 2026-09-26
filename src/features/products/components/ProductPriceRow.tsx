import type { ProductPrice } from '../types/productPriceTypes';
import type { StoreLocation } from '../types/storeLocationTypes';

interface ProductPriceRowProps {
  price: ProductPrice;
  store?: StoreLocation;
  isLatest?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatPrice(observation: ProductPrice): string {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(Number(observation.price));
}

export default function ProductPriceRow({
  price,
  store,
  isLatest = false,
}: ProductPriceRowProps) {
  return (
    <tr key={price.priceId} className="border-t border-border">
      <td className="px-4 py-3 font-medium text-text">
        <span className="whitespace-nowrap">
          {price.currencyCode} {formatPrice(price)}
        </span>
        {isLatest && (
          <span className="mt-1 block text-xs font-medium text-primary">
            Latest recorded price
          </span>
        )}
      </td>

      <td className="px-4 py-3 text-muted">
        {store ? (
          <>
            <div>
              {store.addressLine1}
              {store.addressLine2 ? `, ${store.addressLine2}` : ''}
            </div>

            <div>
              {store.city}, {store.stateCode} {store.postalCode}
            </div>

            {store.storeNumber && <div>Store {store.storeNumber}</div>}
          </>
        ) : (
          'Store location unavailable'
        )}
      </td>

      <td className="px-4 py-3 text-muted">
        <time dateTime={price.recordedAt}>
          {dateFormatter.format(new Date(price.recordedAt))}
        </time>
      </td>
    </tr>
  );
}
