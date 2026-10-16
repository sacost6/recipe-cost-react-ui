import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import Button from '../../../components/Button';
import { createStoreLocation, listRetailers } from '../api/store_locations_api';
import type {
  CreateStoreLocationInput,
  KrogerLocation,
  Retailer,
  StoreLocation,
} from '../types/storeLocationTypes';
import { inputClassName } from '../utils/classNames';
import KrogerLocationSearch from './KrogerLocationSearch';

const US_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
] as const;

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
  const [streetName, setStreetName] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [storeNumber, setStoreNumber] = useState('');
  const [krogerLocationId, setKrogerLocationId] = useState('');
  const [isLoadingRetailers, setIsLoadingRetailers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const selectedRetailer = retailers.find(
    (retailer) => retailer.retailerId === selectedRetailerId,
  );
  const isKroger = selectedRetailer?.name.toLowerCase() === 'kroger';

  function handleKrogerLocationSelect(location: KrogerLocation): void {
    setStreetName(location.addressLine1);
    setAddressLine2(location.addressLine2 ?? '');
    setCity(location.city);
    setStateCode(location.stateCode);
    setPostalCode(location.postalCode ?? '');
    setStoreNumber(location.storeNumber ?? '');
    setKrogerLocationId(location.locationId);
    const normalizedChain = location.chain
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const matchingRetailer = retailers.find(
      (retailer) =>
        retailer.name.toLowerCase().replace(/[^a-z0-9]/g, '') ===
        normalizedChain,
    );
    const krogerRetailer = retailers.find(
      (retailer) => retailer.name.toLowerCase() === 'kroger',
    );
    setSelectedRetailerId(
      matchingRetailer?.retailerId ?? krogerRetailer?.retailerId ?? '',
    );
  }

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
      storeNumber: storeNumber.trim() || null,
      streetName: streetName.trim(),
      addressLine2: addressLine2.trim() || null,
      city: city.trim(),
      stateCode,
      postalCode: postalCode.trim() || null,
      ...(krogerLocationId.trim()
        ? { krogerLocationId: krogerLocationId.trim() }
        : {}),
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

      <KrogerLocationSearch onSelect={handleKrogerLocationSelect} />
      {krogerLocationId && (
        <p role="status" className="text-sm text-muted">
          Selected Kroger location ID: {krogerLocationId}
        </p>
      )}

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
            onChange={(event) => {
              setSelectedRetailerId(event.target.value);
              setKrogerLocationId('');
            }}
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
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm">Address line 2 (optional)</span>
          <input
            maxLength={150}
            value={addressLine2}
            placeholder="Suite, apartment, etc."
            onChange={(event) => setAddressLine2(event.target.value)}
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

        <label className="block">
          <span className="mb-1 block text-sm">State</span>
          <select
            required
            value={stateCode}
            onChange={(event) => setStateCode(event.target.value)}
            className={inputClassName}
          >
            <option value="">Select a state</option>
            {US_STATES.map((abbreviation) => (
              <option key={abbreviation} value={abbreviation}>
                {abbreviation}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">ZIP code</span>
          <input
            type="text"
            maxLength={20}
            value={postalCode}
            placeholder="e.g. 45044"
            onChange={(event) => setPostalCode(event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Store number (optional)</span>
          <input
            type="text"
            maxLength={50}
            value={storeNumber}
            onChange={(event) => setStoreNumber(event.target.value)}
            className={inputClassName}
          />
        </label>
        {isKroger && (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm">
              Kroger location ID (optional)
            </span>
            <input
              type="text"
              maxLength={30}
              value={krogerLocationId}
              placeholder="Enter the location ID used by Kroger"
              onChange={(event) => setKrogerLocationId(event.target.value)}
              className={inputClassName}
            />
            <span className="mt-1 block text-sm text-muted">
              Map this address to a Kroger store to make it eligible for price
              syncing.
            </span>
          </label>
        )}
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
