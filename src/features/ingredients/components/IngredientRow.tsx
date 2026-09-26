import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button.tsx';
import DeleteButton from '../../../components/DeleteButton';
import type { Ingredient } from '../types.ts';

type IngredientRowProps = {
  ingredient: Ingredient;
  showActions: boolean;
  hidden?: boolean;
  disabled?: boolean;
  productCountLabel: string;
  showAddProductHint?: boolean;
  onEdit?: (ingredient: Ingredient) => void;
  onDelete?: (id: string) => Promise<void>;
};

export default function IngredientRow({
  ingredient,
  showActions,
  productCountLabel,
  showAddProductHint = false,
  hidden = false,
  disabled = false,
  onEdit,
  onDelete,
}: IngredientRowProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const isDisabled = disabled || isDeleting;

  const handleDelete = async () => {
    if (!onDelete || disabled || isDeleting) return;

    setIsDeleting(true);

    try {
      await onDelete(ingredient.ingredientId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr
      hidden={hidden}
      onClick={(event) => {
        if (
          isDisabled ||
          event.defaultPrevented ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey ||
          (event.target instanceof Element &&
            event.target.closest('button, a, input, select, textarea, dialog'))
        ) {
          return;
        }

        navigate(`/ingredients/${ingredient.ingredientId}`);
      }}
      className={`border-t border-border transition-colors ${
        isDisabled
          ? ''
          : 'cursor-pointer hover:bg-green-50 focus-within:bg-green-50'
      }`}
    >
      <td className="px-4 py-3">
        <Button
          to={`/ingredients/${ingredient.ingredientId}`}
          variant="plain"
          disabled={isDisabled}
          className="inline-flex min-h-9 items-center gap-2 rounded text-left font-medium text-primary hover:underline"
        >
          {ingredient.name}
          <span aria-hidden="true">→</span>
        </Button>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-text">
          {ingredient.category?.name ?? '-'}
        </div>
      </td>
      <td className="px-4 py-3 text-muted">
        {productCountLabel}
        {showAddProductHint && !isDisabled && (
          <span className="mt-0.5 block text-sm text-muted">
            Open to add a product
          </span>
        )}
      </td>
      {showActions && (
        <td className="w-px whitespace-nowrap px-4 py-3">
          <div className="flex items-center justify-end gap-3">
            {onEdit && (
              <Button
                type="button"
                variant="plain"
                className="inline-flex min-h-9 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-text"
                aria-label={`Edit ${ingredient.name}`}
                disabled={disabled || isDeleting}
                onClick={() => onEdit(ingredient)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <div className={onEdit ? 'border-l border-border pl-3' : ''}>
                <DeleteButton
                  itemName={ingredient.name}
                  disabled={disabled || isDeleting}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
