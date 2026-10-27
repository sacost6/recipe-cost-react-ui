// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { updateStoreLocation } from '../../api/store_locations_api';
import type { StoreLocation } from '../../types/storeLocationTypes';
import KrogerStoreMappingForm from '../KrogerStoreMappingForm';

vi.mock('../../api/store_locations_api', () => ({
  updateStoreLocation: vi.fn(),
}));

afterEach(cleanup);

const store: StoreLocation = {
  storeLocationId: '3',
  retailerId: '2',
  retailer: { name: 'Kroger' },
  storeNumber: null,
  krogerLocationId: null,
  addressLine1: '100 Main St',
  addressLine2: null,
  city: 'Chicago',
  stateCode: 'IL',
  postalCode: '60601',
  countryCode: 'US',
};

describe('KrogerStoreMappingForm', () => {
  it('saves a Kroger location ID and keeps store details in the callback', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    vi.mocked(updateStoreLocation).mockResolvedValue({
      ...store,
      krogerLocationId: '12345',
    });

    render(
      <KrogerStoreMappingForm
        store={store}
        onSaved={onSaved}
        onCancel={vi.fn()}
      />,
    );

    await user.type(
      screen.getByRole('textbox', { name: /kroger location id/i }),
      '12345',
    );
    await user.click(screen.getByRole('button', { name: 'Save mapping' }));

    await waitFor(() => {
      expect(updateStoreLocation).toHaveBeenCalledWith('3', {
        krogerLocationId: '12345',
      });
      expect(onSaved).toHaveBeenCalledWith({
        ...store,
        krogerLocationId: '12345',
      });
    });
  });
});
