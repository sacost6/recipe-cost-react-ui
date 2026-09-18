import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import type {
  Ingredient,
  CreateIngredientInput,
  IngredientCategory,
} from '../types';

export interface IngredientFormProps {
  onSubmit: (ingredient: CreateIngredientInput) => void | Promise<void>;
  initialValues?: Partial<Ingredient>;
  categories: IngredientCategory[];
  categoriesReady: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function IngredientForm({
  onSubmit,
  initialValues,
  categories,
  categoriesReady,
  submitLabel = 'Save Ingredient',
  onCancel,
}: IngredientFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialValues?.categoryId?.toString() ?? '',
  );

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedCategoryId('');
    setFormError(null);
  };

  useEffect(() => {
    setName(initialValues?.name ?? '');
    setDescription(initialValues?.description ?? '');
    setSelectedCategoryId(initialValues?.categoryId?.toString() ?? '');
    setFormError(null);
  }, [initialValues]);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || !categoriesReady) return;

    setFormError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setFormError('Enter an ingredient name.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: trimmedName,
        description: description.trim() || null,
        categoryId:
          selectedCategoryId === '' ? null : Number(selectedCategoryId),
      });

      if (!initialValues) {
        resetForm();
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to save the ingredient.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-surface p-6 rounded-xl border border-border shadow-sm text-left">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-muted mb-1.5"
          >
            Name
          </label>
          <input
            required
            type="text"
            id="name"
            value={name}
            maxLength={100}
            disabled={isSubmitting}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-muted mb-1.5"
          >
            Category (optional)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            disabled={isSubmitting || !categoriesReady}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option
                key={category.categoryId}
                value={category.categoryId.toString()}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-muted mb-1.5"
          >
            Description (optional)
          </label>

          <textarea
            id="description"
            name="description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-text"
          />
        </div>

        {formError && (
          <p role="alert" className="text-sm text-red-700">
            {formError}
          </p>
        )}

        <div className="pt-3 flex justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          >
            Save & Create Product
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
