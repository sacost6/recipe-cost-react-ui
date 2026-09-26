import { useId, useState } from 'react';
import type { SubmitEvent } from 'react';
import Button from '../../../components/Button';
import type { CreateProductPriceInput } from '../types/productPriceTypes';
import type { StoreLocation } from '../types/storeLocationTypes';
import { inputClassName } from '../utils/classNames';

interface ProductPriceFormProps {
  productId: string;
  stores: StoreLocation[];
  title?: string;
  onSubmit: (input: CreateProductPriceInput) => Promise<void>;
  onCancel?: () => void;
}

export default function ProductPriceForm({
  productId,
  stores,
  title = 'Add price',
  onSubmit,
  onCancel,
}: ProductPriceFormProps) {
  const headingId = useId();
  const [price, setPrice] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD');
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
    const normalizedCurrencyCode = currencyCode.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(normalizedCurrencyCode)) {
      setFormError('Enter a three-letter currency code, such as USD or CAD.');
      return;
    }

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
        currencyCode: normalizedCurrencyCode,
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
      aria-labelledby={headingId}
      className="space-y-4 rounded-lg border border-border p-4"
    >
      <h3 id={headingId} className="font-semibold text-text">
        {title}
      </h3>

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
            onChange={(event) =>
              setPrice(event.target.value.replace(/\$/g, ''))
            }
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-text">Currency</span>
          <input
            required
            type="text"
            minLength={3}
            maxLength={3}
            pattern="[A-Za-z]{3}"
            placeholder="USD"
            value={currencyCode}
            onChange={(event) =>
              setCurrencyCode(event.target.value.toUpperCase())
            }
            className={inputClassName}
          />
          <span className="mt-1 block text-sm text-muted">
            For example, USD for US dollars or CAD for Canadian dollars.
          </span>
        </label>

        <p className="text-sm text-muted">
          Enter the price of one whole package, without a currency symbol.
        </p>
      </fieldset>

      {formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
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
          {isSubmitting ? 'Saving...' : 'Save price'}
        </Button>
      </div>
    </form>
  );
}
