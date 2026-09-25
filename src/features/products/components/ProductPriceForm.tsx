import { useState } from 'react';
import type { SubmitEvent } from 'react';
import Button from '../../../components/Button';
import type { CreateProductPriceInput } from '../types/productPriceTypes';
import type { StoreLocation } from '../types/storeLocationTypes';
import { inputClassName } from '../utils/classNames';

interface ProductPriceFormProps {
  productId: string;
  stores: StoreLocation[];
  onSubmit: (input: CreateProductPriceInput) => Promise<void>;
}

export default function ProductPriceForm({
  productId,
  stores,
  onSubmit,
}: ProductPriceFormProps) {
  const [price, setPrice] = useState('');
  const [selectedStoreLocationId, setSelectedStoreLocationId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const disabled = isSubmitting || stores.length === 0;

  function resetForm(): void {
    setPrice('');
    setSelectedStoreLocationId('');
    setFormError(null);
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (disabled) return;

    setFormError(null);

    const selectedStore = stores.find(
      (store) => store.storeLocationId === selectedStoreLocationId,
    );

    if (!selectedStore) {
      setFormError('Select a store location.');
      return;
    }

    const trimmedPrice = price.trim();

    // check if the price matches backend's nonnegative decimal format
    if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(trimmedPrice)) {
      setFormError(
        'Enter a nonnegative price with up to 10 digits before ' +
          'the decimal and 2 after it.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        productId,
        storeLocationId: selectedStore.storeLocationId,
        price: trimmedPrice,
        currencyCode: 'USD',
      });

      resetForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to record the price.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-border p-4"
    >
      <h3 className="font-semibold text-text">Record a price</h3>

      {stores.length === 0 && (
        <p role="status" className="text-sm text-muted">
          Add a store location before recording a price.
        </p>
      )}

      <fieldset disabled={disabled} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm text-text">Store location</span>

          <select
            required
            value={selectedStoreLocationId}
            onChange={(event) => setSelectedStoreLocationId(event.target.value)}
            className={inputClassName}
          >
            <option value="">Select a store</option>

            {stores.map((store) => (
              <option key={store.storeLocationId} value={store.storeLocationId}>
                {store.addressLine1}
                {store.addressLine2 ? `, ${store.addressLine2}` : ''}
                {`, ${store.city}, ${store.stateCode} ${store.postalCode}`}
                {store.storeNumber ? ` — Store ${store.storeNumber}` : ''}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-text">Package price</span>

          <input
            required
            type="text"
            inputMode="decimal"
            maxLength={13}
            placeholder="0.00"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClassName}
          />
        </label>

        <p className="text-sm text-muted">
          Enter the price of one whole package, without a dollar sign.
        </p>
      </fieldset>

      {formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          {isSubmitting ? 'Saving...' : 'Record price'}
        </Button>
      </div>
    </form>
  );
}
