import { useState } from 'react';
import Button from '../../../components/Button.tsx';
import type { Ingredient } from '../types.ts';

type IngredientRowProps = {
  ingredient: Ingredient;
  showActions: boolean;
  onEdit?: (ingredient: Ingredient) => void;
  onDelete?: (id: string) => Promise<void>;
};

export default function IngredientRow({
  ingredient,
  showActions,
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
    <tr className="border-t border-border">
      <td className="px-4 py-3">
        <div className="font-medium text-text">{ingredient.name}</div>
      </td>

      <td className="px-4 py-3 text-muted">{ingredient.description ?? '—'}</td>
      {showActions && (
        <td className="px-4 py-3">
          <div className="flex justify-end gap-2">
            {onEdit && (
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2 text-sm"
                aria-label={`Edit ${ingredient.name}`}
                onClick={() => onEdit(ingredient)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting}
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
