import { useState } from 'react';
import Button from '../../../components/Button.tsx';
import type { Ingredient } from '../types.ts';

type IngredientRowProps = {
  ingredient: Ingredient;
  showActions: boolean;
  isExpanded: boolean;
  panelId: string;
  hidden?: boolean;
  disabled?: boolean;
  productCountLabel: string;
  onToggle: () => void;
  onEdit?: (ingredient: Ingredient) => void;
  onDelete?: (id: string) => Promise<void>;
};

export default function IngredientRow({
  ingredient,
  showActions,
  isExpanded,
  panelId,
  productCountLabel,
  hidden = false,
  disabled = false,
  onToggle,
  onEdit,
  onDelete,
}: IngredientRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);

    try {
      await onDelete(ingredient.ingredientId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr hidden={hidden} className="border-t border-border">
      <td className="px-4 py-3">
        <Button
          type="button"
          variant="plain"
          aria-expanded={isExpanded}
          aria-controls={panelId}
          disabled={disabled || isDeleting}
          onClick={onToggle}
          className="inline-flex items-center gap-2 rounded text-left font-medium text-text"
        >
          <span aria-hidden="true">{isExpanded ? '▾' : '▸'}</span>
          {ingredient.name}
        </Button>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-text">
          {ingredient.category?.name ?? '-'}
        </div>
      </td>
      <td className="px-4 py-3 text-muted">{productCountLabel}</td>
      {showActions && (
        <td className="w-px whitespace-nowrap px-4 py-3">
          <div className="flex justify-end gap-2">
            {onEdit && (
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2 text-sm"
                aria-label={`Edit ${ingredient.name}`}
                disabled={disabled || isDeleting}
                onClick={() => onEdit(ingredient)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                disabled={disabled || isDeleting}
                aria-label={`Delete ${ingredient.name}`}
                onClick={handleDelete}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
