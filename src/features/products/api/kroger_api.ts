import { endpoints } from '../../../lib/endpoints';
import { apiRequest } from '../../../lib/http';
import type { KrogerProductSuggestion } from '../types/productTypes';

export function searchKrogerProducts(
  term: string,
  locationId: string,
): Promise<KrogerProductSuggestion[]> {
  const query = new URLSearchParams({ term, locationId });
  return apiRequest<KrogerProductSuggestion[]>(
    endpoints.kroger.productSearch(query.toString()),
  );
}
