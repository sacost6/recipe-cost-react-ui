import { useEffect, useId, useState } from 'react';
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
  null | { type: 'create' } | { type: 'edit'; product: Product };

interface IngredientProductsPaneProps {
  ingredient: Ingredient;
}

export default function IngredientProductsPane({
  ingredient,
}: IngredientProductsPaneProps) {
  const headingId = useId();
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

  const [expandingProductId, setExpandingProductId] = useState<string | null>(
    null,
  );

  const showProductForm = action?.type === 'create' || action?.type === 'edit';

  useEffect(() => {
    if (!message) return;

    const timeoutId = window.setTimeout(() => setMessage(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const ingredientProducts = products.filter(
    (product) => product.ingredientId === ingredient.ingredientId,
  );

  const priceProduct = ingredientProducts.find(
    (product) => product.productId === expandingProductId,
  );
  const canStartAction = action === null && !isLoading && error === null;

  function openAction(next: ProductAction): void {
    setMessage(null);
    setExpandingProductId(null);
    setAction(next);
  }

  async function handleDelete(productId: string): Promise<void> {
    setMessage(null);
    setExpandingProductId(null);
    await deleteProduct(productId);
  }

  async function handleUpdate(input: CreateProductInput): Promise<void> {
    if (action?.type !== 'edit') {
      throw new Error('Select a product to edit.');
    }

    setExpandingProductId(null);

    await updateProduct(action.product.productId, {
      ...input,
      ingredientId: ingredient.ingredientId,
      version: action.product.version,
    });

    setAction(null);
    setMessage('Product updated.');
  }

  function handleProductToggle(productId: string) {
    if (showProductForm || isLoading || error !== null) return;

    setExpandingProductId((current) =>
      current === productId ? null : productId,
    );
  }
  return (
    <section className="space-y-4" aria-labelledby={headingId}>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id={headingId} className="mb-0 text-base font-semibold text-text">
          Your Products for {ingredient.name}
        </h2>

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
        disabled={showProductForm || isLoading || error !== null}
        expandedProductId={expandingProductId}
        onRetry={refreshProducts}
        onEdit={
          canStartAction
            ? (product) => openAction({ type: 'edit', product })
            : undefined
        }
        onDelete={canStartAction ? handleDelete : undefined}
        onProductToggle={handleProductToggle}
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

      {priceProduct && !showProductForm && (
        <div
          id={`product-details-${priceProduct.productId}`}
          className="w-full min-w-0"
        >
          <ProductPricesPane
            key={priceProduct.productId}
            product={priceProduct}
            onClose={() => setExpandingProductId(null)}
          />
        </div>
      )}
    </section>
  );
}
