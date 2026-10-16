// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchKrogerLocations } from '../api/store_locations_api';
import type { KrogerLocation } from '../types/storeLocationTypes';
import KrogerLocationSearch from './KrogerLocationSearch';

vi.mock('../api/store_locations_api', () => ({
  searchKrogerLocations: vi.fn(),
}));

afterEach(cleanup);

const location: KrogerLocation = {
  locationId: '01400390',
  name: 'Kroger Marketplace',
  chain: 'KROGER',
  storeNumber: '00390',
  addressLine1: '123 Main St',
  addressLine2: null,
  city: 'Maineville',
  stateCode: 'OH',
  postalCode: '45039',
};

describe('KrogerLocationSearch', () => {
  it('searches by ZIP and radius and returns the selected location', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    vi.mocked(searchKrogerLocations).mockResolvedValue([location]);

    render(<KrogerLocationSearch onSelect={onSelect} />);
    await user.type(screen.getByRole('textbox', { name: 'ZIP code' }), '45044');
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Search radius' }),
      '25',
    );
    await user.click(screen.getByRole('button', { name: 'Search stores' }));

    await waitFor(() => {
      expect(searchKrogerLocations).toHaveBeenCalledWith('45044', 25);
    });
    await user.click(
      screen.getByRole('button', { name: /kroger marketplace/i }),
    );
    expect(onSelect).toHaveBeenCalledWith(location);
  });
});
