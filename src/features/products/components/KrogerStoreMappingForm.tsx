import { useState } from 'react';
import type { SubmitEvent } from 'react';
import Button from '../../../components/Button';
import { updateStoreLocation } from '../api/store_locations_api';
import type { StoreLocation } from '../types/storeLocationTypes';
import { inputClassName } from '../utils/classNames';
import KrogerLocationSearch from './KrogerLocationSearch';

interface KrogerStoreMappingFormProps {
  store: StoreLocation;
  onSaved: (store: StoreLocation) => void;
  onCancel: () => void;
}

export default function KrogerStoreMappingForm({
  store,
  onSaved,
  onCancel,
}: KrogerStoreMappingFormProps) {
  const [krogerLocationId, setKrogerLocationId] = useState(
    store.krogerLocationId ?? '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState('');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    setIsSubmitting(true);

    try {
      const updatedStore = await updateStoreLocation(store.storeLocationId, {
        krogerLocationId: krogerLocationId.trim() || null,
      });
      onSaved({ ...store, ...updatedStore, retailer: store.retailer });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to save the Kroger store mapping.',
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
      <h3 className="font-semibold text-text">
        Map {store.retailer.name} store
      </h3>
      <p className="text-sm text-muted">
        {store.addressLine1}, {store.city}
        {store.stateCode ? `, ${store.stateCode}` : ''}
      </p>

      <KrogerLocationSearch
        initialZipCode={store.postalCode ?? ''}
        onSelect={(location) => {
          setKrogerLocationId(location.locationId);
          setSelectedLocationName(`${location.name} (${location.chain})`);
        }}
      />

      {selectedLocationName && (
        <p role="status" className="text-sm text-muted">
          Selected Kroger location: {selectedLocationName}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block text-sm">Kroger location ID</span>
        <input
          autoFocus
          type="text"
          maxLength={30}
          value={krogerLocationId}
          placeholder="Enter the location ID used by Kroger"
          onChange={(event) => setKrogerLocationId(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
        <span className="mt-1 block text-sm text-muted">
          Leave blank to remove this store mapping.
        </span>
      </label>

      {formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save mapping'}
        </Button>
      </div>
    </form>
  );
}
