// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createStoreLocation,
  listRetailers,
  searchKrogerLocations,
} from '../api/store_locations_api';
import type {
  KrogerLocation,
  StoreLocation,
} from '../types/storeLocationTypes';
import StoreLocationForm from './StoreLocationForm';

vi.mock('../api/store_locations_api', () => ({
  createStoreLocation: vi.fn(),
  listRetailers: vi.fn(),
  searchKrogerLocations: vi.fn(),
}));

afterEach(cleanup);

const krogerLocation: KrogerLocation = {
  locationId: '01400390',
  name: 'Kroger Marketplace',
  chain: 'KROGER',
  storeNumber: '00390',
  addressLine1: '123 Main St',
  addressLine2: 'Suite 2',
  city: 'Maineville',
  stateCode: 'OH',
  postalCode: '45039',
};

const savedLocation: StoreLocation = {
  storeLocationId: '8',
  retailerId: '2',
  retailer: { name: 'Kroger' },
  storeNumber: '00390',
  krogerLocationId: '01400390',
  addressLine1: '123 Main St',
  addressLine2: 'Suite 2',
  city: 'Maineville',
  stateCode: 'OH',
  postalCode: '45039',
  countryCode: 'US',
};

describe('StoreLocationForm Kroger search', () => {
  it('fills and saves the selected Kroger location', async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();
    vi.mocked(listRetailers).mockResolvedValue([
      { retailerId: '2', name: 'Kroger', websiteUrl: null },
    ]);
    vi.mocked(searchKrogerLocations).mockResolvedValue([krogerLocation]);
    vi.mocked(createStoreLocation).mockResolvedValue(savedLocation);

    render(<StoreLocationForm onCreated={onCreated} onCancel={vi.fn()} />);
    await screen.findByRole('option', { name: 'Kroger' });

    await user.type(
      screen.getAllByRole('textbox', { name: 'ZIP code' })[0],
      '45044',
    );
    await user.click(screen.getByRole('button', { name: 'Search stores' }));
    await user.click(
      screen.getByRole('button', { name: /kroger marketplace/i }),
    );

    expect(
      (screen.getByRole('textbox', { name: 'Street' }) as HTMLInputElement)
        .value,
    ).toBe('123 Main St');
    expect(
      (screen.getByRole('combobox', { name: 'Retailer' }) as HTMLSelectElement)
        .value,
    ).toBe('2');

    await user.click(screen.getByRole('button', { name: 'Save location' }));
    await waitFor(() => {
      expect(createStoreLocation).toHaveBeenCalledWith({
        retailerId: '2',
        storeNumber: '00390',
        streetName: '123 Main St',
        addressLine2: 'Suite 2',
        city: 'Maineville',
        stateCode: 'OH',
        postalCode: '45039',
        krogerLocationId: '01400390',
      });
      expect(onCreated).toHaveBeenCalledWith(savedLocation);
    });
  });
});
