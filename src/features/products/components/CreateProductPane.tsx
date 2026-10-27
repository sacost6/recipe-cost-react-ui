import Button from '../../../components/Button';
import ProductForm from './ProductForm';
import { useProductContext } from '../ProductContext';
import { createProductPrice } from '../api/product_price_api';
import type {
  CreateProductInput,
  KrogerPriceSelection,
  Product,
} from '../types/productTypes';

interface CreateProductPanelProps {
  ingredientId: string;
  onCreated: (product: Product, priceMessage?: string) => void;
  onCancel?: () => void;
}

export default function CreateProductPanel({
  ingredientId,
  onCreated,
  onCancel,
}: CreateProductPanelProps) {
  const { units, isLoading, error, refreshProducts, addProduct } =
    useProductContext();

  async function handleSubmit(
    input: CreateProductInput,
    krogerPrice?: KrogerPriceSelection,
  ): Promise<void> {
    const saved = await addProduct(input);
    if (!krogerPrice) {
      onCreated(saved);
      return;
    }

    try {
      await createProductPrice({
        productId: saved.productId,
        storeLocationId: krogerPrice.storeLocationId,
        price: krogerPrice.price,
        currencyCode: 'USD',
        source: 'kroger',
      });
      onCreated(saved, `Kroger price $${krogerPrice.price} recorded.`);
    } catch {
      onCreated(
        saved,
        'The product was added, but its Kroger price could not be recorded. You can add it from the price panel.',
      );
    }
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>

        <Button onClick={() => void refreshProducts()}>Try again</Button>

        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    );
  }

  return (
    <ProductForm
      key={ingredientId}
      ingredientId={ingredientId}
      units={units}
      unitReady={!isLoading}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
}
