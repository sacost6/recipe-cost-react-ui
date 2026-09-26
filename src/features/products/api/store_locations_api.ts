import { apiRequest } from '../../../lib/http';
import { endpoints } from '../../../lib/endpoints';
import type {
  StoreLocation,
  CreateStoreLocationInput,
  Retailer,
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

export function listRetailers(): Promise<Retailer[]> {
  return apiRequest<Retailer[]>(endpoints.retailers.list);
}
