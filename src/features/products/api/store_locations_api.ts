import { apiRequest } from '../../../lib/http';
import { endpoints } from '../../../lib/endpoints';
import type {
  StoreLocation,
  CreateStoreLocationInput,
  Retailer,
  UpdateStoreLocationInput,
  KrogerLocation,
} from '../types/storeLocationTypes';

export function listStoreLocations(): Promise<StoreLocation[]> {
  return apiRequest<StoreLocation[]>(endpoints.storeLocations.list);
}

export function getStoreLocation(
  storeLocationId: string,
): Promise<StoreLocation> {
  return apiRequest<StoreLocation>(
    endpoints.storeLocations.detail(storeLocationId),
  );
}

export function createStoreLocation(
  input: CreateStoreLocationInput,
): Promise<StoreLocation> {
  return apiRequest<StoreLocation>(endpoints.storeLocations.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateStoreLocation(
  storeLocationId: string,
  input: UpdateStoreLocationInput,
): Promise<StoreLocation> {
  return apiRequest<StoreLocation>(
    endpoints.storeLocations.detail(storeLocationId),
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
}

export function searchKrogerLocations(
  zipCode: string,
  radiusInMiles: number,
): Promise<KrogerLocation[]> {
  const query = new URLSearchParams({
    zipCode,
    radiusInMiles: String(radiusInMiles),
  });
  return apiRequest<KrogerLocation[]>(
    endpoints.storeLocations.krogerSearch(query.toString()),
  );
}

export function listRetailers(): Promise<Retailer[]> {
  return apiRequest<Retailer[]>(endpoints.retailers.list);
}
