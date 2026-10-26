// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ProductForm from './ProductForm';
import type { Unit } from '../types/productTypes';

afterEach(cleanup);

const units: Unit[] = [
  {
    unitId: 1,
    name: 'each',
    abbreviation: 'ea',
    unitType: 'count',
    conversionToBase: '1',
    createdAt: '2026-10-15T00:00:00.000Z',
  },
];

describe('ProductForm', () => {
  it('submits product details and UPC without enabling price syncing', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ProductForm
        ingredientId="1"
        units={units}
        unitReady
        onSubmit={onSubmit}
      />,
    );

    expect(
      screen.queryByRole('checkbox', { name: /sync prices from kroger/i }),
    ).toBeNull();

    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Milk',
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Package quantity' }),
      '1',
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Package unit' }),
      '1',
    );
    const upc = screen.getByRole('textbox', { name: 'UPC (optional)' });
    await user.type(upc, '012345678905');
    await user.click(screen.getByRole('button', { name: 'Save Product' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          upc: '012345678905',
        }),
      );
    });
  });
});
