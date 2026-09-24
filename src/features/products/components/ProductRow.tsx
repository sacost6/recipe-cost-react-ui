import { useState } from 'react';
import Button from '../../../components/Button';
import type { Product } from '../types';

export interface ProductRowProps {
  product: Product;
  ingredientName: string;
  unitLabel: string;
  showActions: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: Product['productId']) => Promise<void>;
}

export default function ProductRow({
  product,
  ingredientName,
  unitLabel,
  showActions,
  onEdit,
  onDelete,
}: ProductRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!onDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onDelete(product.productId);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Unable to delete this product.',
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3">
        <div className="font-medium text-text">{product.productName}</div>

        <div className="text-sm text-muted">
          {product.brand ?? 'No brand specified'}
        </div>
      </td>

      <td className="px-4 py-3 text-muted">{ingredientName}</td>

      <td className="px-4 py-3 text-muted">
        {product.packageQuantity} {unitLabel}
      </td>

      <td className="px-4 py-3 text-muted">{product.upc ?? '-'}</td>

      {showActions && (
        <td className="px-4 py-3">
          <div className="flex justify-end gap-2">
            {onEdit && (
              <Button
                type="button"
                variant="secondary"
                disabled={isDeleting}
                aria-label={`Edit ${product.productName}`}
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
            )}

            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
                aria-label={`Delete ${product.productName}`}
                onClick={() => void handleDelete()}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>

          {deleteError && (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {deleteError}
            </p>
          )}
        </td>
      )}
    </tr>
  );
}
