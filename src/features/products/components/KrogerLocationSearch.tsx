import { useState } from 'react';
import Button from '../../../components/Button';
import { searchKrogerLocations } from '../api/store_locations_api';
import type { KrogerLocation } from '../types/storeLocationTypes';
import { inputClassName } from '../utils/classNames';

interface KrogerLocationSearchProps {
  initialZipCode?: string;
  onSelect: (location: KrogerLocation) => void;
}

export default function KrogerLocationSearch({
  initialZipCode = '',
  onSelect,
}: KrogerLocationSearchProps) {
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [radiusInMiles, setRadiusInMiles] = useState('10');
  const [locations, setLocations] = useState<KrogerLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function handleSearch() {
    if (isSearching) return;
    const normalizedZip = zipCode.trim();
    if (!/^\d{5}(?:-\d{4})?$/.test(normalizedZip)) {
      setSearchError('Enter a valid US ZIP code.');
      setLocations([]);
      return;
    }

    setSearchError(null);
    setLocations([]);
    setIsSearching(true);
    try {
      setLocations(
        await searchKrogerLocations(normalizedZip, Number(radiusInMiles)),
      );
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : 'Unable to search Kroger locations.',
      );
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section className="space-y-3 rounded-lg border border-border p-4">
      <div>
        <h4 className="font-semibold text-text">Find a Kroger-family store</h4>
        <p className="text-sm text-muted">
          Search Kroger and its affiliated chains by ZIP code. Select a result
          to fill in the location and Kroger ID.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto]">
        <label className="block">
          <span className="mb-1 block text-sm">ZIP code</span>
          <input
            required
            type="text"
            inputMode="numeric"
            pattern="\d{5}(?:-\d{4})?"
            maxLength={10}
            value={zipCode}
            placeholder="e.g. 45044"
            onChange={(event) => setZipCode(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleSearch();
              }
            }}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Search radius</span>
          <select
            value={radiusInMiles}
            onChange={(event) => setRadiusInMiles(event.target.value)}
            className={inputClassName}
          >
            {[5, 10, 25, 50, 100].map((miles) => (
              <option key={miles} value={miles}>
                {miles} miles
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <Button
            type="button"
            disabled={isSearching}
            onClick={() => void handleSearch()}
          >
            {isSearching ? 'Searching...' : 'Search stores'}
          </Button>
        </div>
      </div>

      {searchError && (
        <p role="alert" className="text-sm text-red-700">
          {searchError}
        </p>
      )}
      {locations.length === 0 && !isSearching && !searchError && (
        <p className="text-sm text-muted">
          Search to see nearby Kroger-family locations.
        </p>
      )}
      {locations.length > 0 && (
        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {locations.map((location) => (
            <li key={location.locationId}>
              <button
                type="button"
                onClick={() => onSelect(location)}
                className="w-full rounded-lg border border-border p-3 text-left transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="block font-medium text-text">
                  {location.name}
                </span>
                <span className="block text-sm text-muted">
                  {location.chain} · {location.addressLine1}, {location.city},{' '}
                  {location.stateCode} {location.postalCode ?? ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {locations.length === 200 && (
        <p className="text-sm text-muted">
          Showing the API maximum of 200 results. Try a smaller radius to narrow
          your search.
        </p>
      )}
    </section>
  );
}
