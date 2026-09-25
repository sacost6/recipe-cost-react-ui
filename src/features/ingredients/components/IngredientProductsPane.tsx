import { useState } from 'react';
import Button from '../../../components/Button';
import type { Ingredient } from '../types';
import { useProductContext } from '../../products/ProductContext';
import type {
  CreateProductInput,
  Product,
} from '../../products/types/productTypes';
import ProductList from '../../products/components/ProductList';
import ProductForm from '../../products/components/ProductForm';
import CreateProductPanel from '../../products/components/CreateProductPane';
import ProductPricesPane from '../../products/components/ProductPricesPane';

type ProductAction =
  | null
  | { type: 'create' }
  | { type: 'edit'; product: Product }
  | { type: 'prices'; productId: string };

interface IngredientProductsPaneProps {
  ingredient: Ingredient;
}

export default function IngredientProductsPane({
  ingredient,
}: IngredientProductsPaneProps) {
  const {
    products,
    units,
    isLoading,
    error,
    refreshProducts,
    deleteProduct,
    updateProduct,
  } = useProductContext();

  const [action, setAction] = useState<ProductAction>(null);
  const [message, setMessage] = useState<string | null>(null);

  const ingredientProducts = products.filter(
    (product) => product.ingredientId === ingredient.ingredientId,
  );

  const priceProduct =
    action?.type === 'prices'
      ? ingredientProducts.find(
          (product) => product.productId === action.productId,
        )
      : undefined;

  const canStartAction = action === null && !isLoading && error === null;

  function openAction(next: ProductAction): void {
    setMessage(null);
    setAction(next);
  }

  async function handleUpdate(input: CreateProductInput): Promise<void> {
    if (action?.type !== 'edit') {
      throw new Error('Select a product to edit.');
    }

    await updateProduct(action.product.productId, {
      ...input,
      ingredientId: ingredient.ingredientId,
      version: action.product.version,
    });

    setAction(null);
    setMessage('Product updated.');
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-text">
          Your products for {ingredient.name}
        </h3>

        <Button
          type="button"
          disabled={!canStartAction}
          onClick={() => openAction({ type: 'create' })}
        >
          Add product
        </Button>
      </div>

      {ingredient.description && (
        <p className="text-sm text-muted">{ingredient.description}</p>
      )}

      {message && (
        <p role="status" className="text-sm text-text">
          {message}
        </p>
      )}

      <ProductList
        products={ingredientProducts}
        units={units}
        isLoading={isLoading}
        error={error}
        onRetry={refreshProducts}
        onEdit={
          canStartAction
            ? (product) => openAction({ type: 'edit', product })
            : undefined
        }
        onDelete={canStartAction ? deleteProduct : undefined}
        onViewPrices={
          canStartAction
            ? (product) =>
                openAction({
                  type: 'prices',
                  productId: product.productId,
                })
            : undefined
        }
      />

      {action?.type === 'create' && (
        <CreateProductPanel
          ingredientId={ingredient.ingredientId}
          onCreated={(product) => {
            setAction(null);
            setMessage(`Added ${product.productName}.`);
          }}
          onCancel={() => setAction(null)}
        />
      )}

      {action?.type === 'edit' && (
        <ProductForm
          key={`${action.product.productId}:${action.product.version}`}
          ingredientId={ingredient.ingredientId}
          initialValues={action.product}
          units={units}
          unitReady={!isLoading && error === null}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          onCancel={() => setAction(null)}
        />
      )}

      {action?.type === 'prices' &&
        (priceProduct ? (
          <ProductPricesPane
            key={priceProduct.productId}
            product={priceProduct}
            onClose={() => setAction(null)}
          />
        ) : (
          <div className="space-y-2">
            <p>This product is no longer available.</p>
            <Button onClick={() => setAction(null)}>Back to products</Button>
          </div>
        ))}
    </section>
  );
}
