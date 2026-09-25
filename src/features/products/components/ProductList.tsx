import { useId } from 'react';
import Button from '../../../components/Button';
import type { Product, Unit } from '../types/productTypes';
import ProductRow from './ProductRow';

export interface ProductListProps {
  products: Product[];
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void | Promise<void>;
  onEdit?: (product: Product) => void;
  onDelete?: (id: Product['productId']) => Promise<void>;
  onViewPrices?: (product: Product) => void;
}

export default function ProductList({
  products,
  units,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onViewPrices,
}: ProductListProps) {
  const headingId = useId();
  const showActions = Boolean(onEdit || onDelete || onViewPrices);

  const unitLabels = new Map(
    units.map((unit) => [unit.unitId, unit.abbreviation]),
  );

  return (
    <section className="space-y-3" aria-labelledby={headingId}>
      <div>
        <h2 id={headingId} className="text-lg font-semibold text-text">
          Products
        </h2>
        {!isLoading && !error && (
          <p className="text-sm text-muted">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      {error && (
        <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-4">
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
          <Button disabled={isLoading} onClick={() => void onRetry()}>
            Try again
          </Button>
        </div>
      )}

      {isLoading ? (
        <p
          role="status"
          className="rounded-lg border border-border bg-surface p-6 text-sm text-muted"
        >
          Loading products...
        </p>
      ) : products.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Package
                </th>
                {showActions && (
                  <th
                    scope="col"
                    className="px-4 py-3 text-right font-semibold"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product.productId}
                  product={product}
                  unitLabel={
                    unitLabels.get(product.packageUnitId) ?? 'Unknown unit'
                  }
                  showActions={showActions}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewPrices={onViewPrices}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">
          <p>No products for this ingredient yet.</p>
          <p className="mt-1">Use Add product to record a package.</p>
        </div>
      ) : null}
    </section>
  );
}
