import Button from '../../../components/Button';
import type { Product, Unit } from '../types/productTypes';
import ProductRow from './ProductRow';

export interface ProductListProps {
  products: Product[];
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  expandedProductId: string | null;
  disabled?: boolean;
  onRetry: () => void | Promise<void>;
  onProductToggle: (productId: string) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: Product['productId']) => Promise<void>;
}

export default function ProductList({
  products,
  units,
  isLoading,
  error,
  disabled = false,
  expandedProductId,
  onRetry,
  onEdit,
  onDelete,
  onProductToggle,
}: ProductListProps) {
  const showActions = Boolean(onEdit || onDelete);

  const unitLabels = new Map(
    units.map((unit) => [unit.unitId, unit.abbreviation]),
  );

  return (
    <div className="w-full min-w-0 max-w-full space-y-3">
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
        <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Product
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Package
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  UPC
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
              {products.map((product) => {
                return (
                  <ProductRow
                    key={product.productId}
                    product={product}
                    unitLabel={
                      unitLabels.get(product.packageUnitId) ?? 'Unknown unit'
                    }
                    showActions={showActions}
                    isExpanded={expandedProductId === product.productId}
                    panelId={`product-details-${product.productId}`}
                    disabled={disabled}
                    onProductToggle={() => onProductToggle(product.productId)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">
          <p>No products for this ingredient yet.</p>
          <p className="mt-1">Use Add product to record a package.</p>
        </div>
      ) : null}
    </div>
  );
}
