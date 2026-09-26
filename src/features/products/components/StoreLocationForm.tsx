import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import Button from '../../../components/Button';
import { createStoreLocation, listRetailers } from '../api/store_locations_api';
import type {
  CreateStoreLocationInput,
  Retailer,
  StoreLocation,
} from '../types/storeLocationTypes';
import { inputClassName } from '../utils/classNames';

interface StoreLocationFormProps {
  onCreated: (location: StoreLocation) => void;
  onCancel: () => void;
}

export default function StoreLocationForm({
  onCreated,
  onCancel,
}: StoreLocationFormProps) {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailerId, setSelectedRetailerId] = useState('');
  const [storeNumber, setStoreNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [isLoadingRetailers, setIsLoadingRetailers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void listRetailers()
      .then((loadedRetailers) => {
        if (!cancelled) setRetailers(loadedRetailers);
      })
      .catch((error) => {
        if (!cancelled) {
          setFormError(
            error instanceof Error
              ? error.message
              : 'Unable to load retailers.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRetailers(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setFormError(null);
    setIsSubmitting(true);

    const input: CreateStoreLocationInput = {
      retailerId: selectedRetailerId,
      streetName: streetName.trim(),
      city: city.trim(),
    };

    try {
      const location = await createStoreLocation(input);
      onCreated(location);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to add this store.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-text">Add store location</h3>

      {isLoadingRetailers && (
        <p role="status" className="text-sm text-muted">
          Loading retailers...
        </p>
      )}

      {!isLoadingRetailers && retailers.length === 0 && !formError && (
        <p role="status" className="text-sm text-muted">
          No retailers are available yet.
        </p>
      )}

      <fieldset
        disabled={isLoadingRetailers || retailers.length === 0 || isSubmitting}
        className="grid gap-3 sm:grid-cols-2"
      >
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm">Retailer</span>
          <select
            required
            value={selectedRetailerId}
            onChange={(event) => setSelectedRetailerId(event.target.value)}
            className={inputClassName}
          >
            <option value="">Select a retailer</option>
            {retailers.map((retailer) => (
              <option key={retailer.retailerId} value={retailer.retailerId}>
                {retailer.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm">Street</span>
          <input
            required
            maxLength={150}
            value={streetName}
            placeholder="e.g. Michigan Ave"
            onChange={(event) => setStreetName(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">City</span>
          <input
            required
            maxLength={100}
            value={city}
            placeholder="e.g. Chicago"
            onChange={(event) => setCity(event.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm">Store number (optional)</span>
          <input
            maxLength={50}
            value={storeNumber}
            placeholder="1"
            onChange={(event) => setStoreNumber(event.target.value)}
            className={inputClassName}
          />
        </label>
      </fieldset>

      {formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isLoadingRetailers || retailers.length === 0 || isSubmitting
          }
        >
          {isSubmitting ? 'Saving...' : 'Save location'}
        </Button>
      </div>
    </form>
  );
}
