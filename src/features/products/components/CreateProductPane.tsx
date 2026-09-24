import Button from '../../../components/Button';
import ProductForm from './ProductForm';
import { useProductContext } from '../ProductContext';
import type { CreateProductInput, Product } from '../types';

interface CreateProductPanelProps {
  ingredientId: string;
  onCreated: (product: Product) => void;
  onCancel?: () => void;
}

export default function CreateProductPanel({
  ingredientId,
  onCreated,
  onCancel,
}: CreateProductPanelProps) {
  const { units, isLoading, error, refreshProducts, addProduct } =
    useProductContext();

  async function handleSubmit(input: CreateProductInput): Promise<void> {
    const saved = await addProduct(input);
    onCreated(saved);
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
