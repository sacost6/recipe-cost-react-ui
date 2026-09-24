import { useState } from 'react';
import type { SubmitEvent } from 'react';
import Button from '../../../components/Button';
import type { CreateProductInput, Unit } from '../types';

export interface ProductFormProps {
  ingredientId: string;
  onSubmit: (product: CreateProductInput) => void | Promise<void>;
  units: Unit[];
  unitReady: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

const inputClassName =
  'w-full rounded-lg border border-border bg-white px-3 py-2 text-text';

export default function ProductForm({
  ingredientId,
  onSubmit,
  units,
  unitReady,
  submitLabel = 'Save Product',
  onCancel,
}: ProductFormProps) {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [packageQuantity, setPackageQuantity] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [upc, setUpc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const disabled = isSubmitting || !unitReady || units.length === 0;

  function resetForm() {
    setProductName('');
    setBrand('');
    setPackageQuantity('');
    setSelectedUnitId('');
    setUpc('');
    setFormError(null);
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (disabled) return;

    setFormError(null);

    const trimmedName = productName.trim();
    const quantity = packageQuantity.trim();

    if (!trimmedName) {
      setFormError('Enter a product name.');
      return;
    }

    // Match the backend's positive decimal format.
    if (!/^\d{1,8}(?:\.\d{1,4})?$/.test(quantity) || !/[1-9]/.test(quantity)) {
      setFormError(
        'Enter a positive quantity with up to 8 digits before ' +
          'the decimal and 4 after it.',
      );
      return;
    }

    const selectedUnit = units.find(
      (unit) => unit.unitId === Number(selectedUnitId),
    );

    if (!selectedUnit) {
      setFormError('Select a package unit.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ingredientId,
        productName: trimmedName,
        brand: brand.trim() || null,
        packageQuantity: quantity,
        packageUnitId: selectedUnit.unitId,
        upc: upc.trim() || null,
      });

      resetForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to save the product.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      {!unitReady && (
        <p role="status" className="text-sm text-muted">
          Loading package units...
        </p>
      )}

      {unitReady && units.length === 0 && (
        <p role="alert" className="text-sm text-red-700">
          No package units are available.
        </p>
      )}

      <fieldset disabled={disabled} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm">Product name</span>
          <input
            required
            type="text"
            maxLength={150}
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Brand (optional)</span>
          <input
            type="text"
            maxLength={100}
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Package quantity</span>
          <input
            required
            type="text"
            inputMode="decimal"
            maxLength={13}
            value={packageQuantity}
            onChange={(event) => setPackageQuantity(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Package unit</span>
          <select
            required
            value={selectedUnitId}
            onChange={(event) => setSelectedUnitId(event.target.value)}
            className={inputClassName}
          >
            <option value="">Select a unit</option>

            {units.map((unit) => (
              <option key={unit.unitId} value={unit.unitId}>
                {unit.name} ({unit.abbreviation})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">UPC (optional)</span>
          <input
            type="text"
            maxLength={20}
            value={upc}
            onChange={(event) => setUpc(event.target.value)}
            className={inputClassName}
          />
        </label>
      </fieldset>

      {formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={disabled}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
