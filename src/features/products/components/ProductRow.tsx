import { useState } from 'react';
import Button from '../../../components/Button';
import DeleteButton from '../../../components/DeleteButton';
import ExpandableRowToggleButton from '../../../components/ExpandableRowToggleButton';
import type { Product } from '../types/productTypes';
import { getExpandableTableRowProps } from '../../../lib/expandableTableRow';
export interface ProductRowProps {
  product: Product;
  showActions: boolean;
  isExpanded: boolean;
  panelId: string;
  hidden?: boolean;
  disabled?: boolean;
  unitLabel: string;
  onProductToggle: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: Product['productId']) => Promise<void>;
}

export default function ProductRow({
  product,
  unitLabel,
  showActions,
  isExpanded,
  panelId,
  hidden = false,
  disabled = false,
  onEdit,
  onDelete,
  onProductToggle,
}: ProductRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isDisabled = disabled || isDeleting;

  async function handleDelete() {
    if (!onDelete || isDisabled) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(product.productId);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <tr
        hidden={hidden}
        {...getExpandableTableRowProps({
          disabled: isDisabled,
          isExpanded,
          onToggle: onProductToggle,
        })}
      >
        <td className="px-4 py-3">
          <ExpandableRowToggleButton
            isExpanded={isExpanded}
            panelId={panelId}
            label={`details for ${product.productName}`}
            disabled={isDisabled}
            onToggle={onProductToggle}
          >
            <span>
              <span className="block font-medium text-text">
                {product.productName}
              </span>
              <span className="block text-sm text-muted">
                {product.brand ?? 'No brand specified'}
              </span>
            </span>
          </ExpandableRowToggleButton>
        </td>

        <td className="px-4 py-3 text-muted">
          {product.packageQuantity} {unitLabel}
        </td>

        <td className="px-4 py-3 text-muted">
          <dd className="text-muted">{product.upc ?? 'Not provided'}</dd>
        </td>

        {showActions && (
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-3">
              {onEdit && (
                <Button
                  type="button"
                  variant="plain"
                  className="inline-flex min-h-9 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-text"
                  disabled={isDeleting}
                  aria-label={`Edit ${product.productName}`}
                  onClick={() => onEdit(product)}
                >
                  Edit
                </Button>
              )}

              {onDelete && (
                <div className={onEdit ? 'border-l border-border pl-3' : ''}>
                  <DeleteButton
                    itemName={product.productName}
                    disabled={isDeleting}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
          </td>
        )}
      </tr>
    </>
  );
}
