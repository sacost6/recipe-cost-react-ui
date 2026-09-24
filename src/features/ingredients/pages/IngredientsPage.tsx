import { listIngredientCategories } from '../api';
import IngredientForm, {
  type IngredientSaveIntent,
} from '../components/IngredientForm';
import IngredientList from '../components/IngredientList';
import CreateProductPanel from '../../products/components/CreateProductPane';
import ProductList from '../../products/components/ProductList';
import { useProductContext } from '../../products/ProductContext';
import { useIngredientContext } from '../IngredientsContext';
import type {
  IngredientCategory,
  CreateIngredientInput,
  Ingredient,
} from '../types';
import { useState, useEffect } from 'react';

export default function IngredientsPage() {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null,
  );
  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryLoadAttempt, setCategoryLoadAttempt] = useState(0);
  const [productIngredient, setProductIngredient] = useState<Ingredient | null>(
    null,
  );
  const [productMessage, setProductMessage] = useState<string | null>(null);
  const {
    ingredients,
    addIngredient,
    deleteIngredient,
    isLoading,
    error,
    refreshIngredients,
    updateIngredient,
  } = useIngredientContext();
  const {
    products,
    units,
    isLoading: isLoadingProducts,
    error: productError,
    refreshProducts,
    deleteProduct,
  } = useProductContext();

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const loadedCategories = await listIngredientCategories();
        if (!ignore) setCategories(loadedCategories);
      } catch (error) {
        if (!ignore) {
          setCategoryError(
            error instanceof Error
              ? error.message
              : 'Unable to load categories.',
          );
        }
      } finally {
        if (!ignore) setIsLoadingCategories(false);
      }
    }

    void loadCategories();

    return () => {
      ignore = true;
    };
  }, [categoryLoadAttempt]);

  const retryCategories = () => {
    setIsLoadingCategories(true);
    setCategoryError(null);
    setCategoryLoadAttempt((current) => current + 1);
  };

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
  };

  const handleSubmit = async (
    ingredient: CreateIngredientInput,
    intent: IngredientSaveIntent,
  ): Promise<void> => {
    const saved = editingIngredient
      ? await updateIngredient(editingIngredient.ingredientId, {
          ...ingredient,
          version: editingIngredient.version,
        })
      : await addIngredient(ingredient);

    setEditingIngredient(null);
    setProductMessage(null);

    if (intent === 'save-and-product') {
      setProductIngredient(saved);
    }
  };

  return (
    <main className="space-y-8 p-6">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-text">Ingredients</h1>
          <p className="text-sm text-muted">
            Track purchase prices and unit costs for your recipe ingredients.
          </p>
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void refreshIngredients()}
              className="mt-2 font-medium underline"
            >
              Try again
            </button>
          </div>
        )}

        {isLoadingCategories && (
          <p role="status" className="text-sm text-muted">
            Loading categories...
          </p>
        )}

        {categoryError && (
          <div className="text-sm text-red-700">
            <p role="alert">{categoryError}</p>
            <button
              type="button"
              onClick={retryCategories}
              className="underline"
            >
              Try again
            </button>
          </div>
        )}

        {productMessage && (
          <p role="status" className="text-sm text-text">
            {productMessage}
          </p>
        )}

        {productIngredient ? (
          <section
            className="space-y-4"
            aria-labelledby="create-product-heading"
          >
            <h2 id="create-product-heading" className="text-lg font-semibold">
              Add a product for {productIngredient.name}
            </h2>
            <CreateProductPanel
              key={productIngredient.ingredientId}
              ingredientId={productIngredient.ingredientId}
              onCreated={(product) => {
                setProductMessage(
                  `Saved ${product.productName} for ${productIngredient.name}.`,
                );
                setProductIngredient(null);
              }}
              onCancel={() => setProductIngredient(null)}
            />
          </section>
        ) : (
          <IngredientForm
            key={
              editingIngredient
                ? `${editingIngredient.ingredientId}:${editingIngredient.version}`
                : 'new'
            }
            initialValues={editingIngredient ?? undefined}
            onSubmit={handleSubmit}
            categories={categories}
            categoriesReady={!isLoadingCategories && categoryError === null}
            onCancel={
              editingIngredient ? () => setEditingIngredient(null) : undefined
            }
            submitLabel={editingIngredient ? 'Save Changes' : 'Add Ingredient'}
          />
        )}
      </section>
      {isLoading ? (
        <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">
          Loading ingredients...
        </div>
      ) : (
        <IngredientList
          ingredients={ingredients}
          categories={categories}
          onDelete={productIngredient ? undefined : deleteIngredient}
          onEdit={productIngredient ? undefined : handleEdit}
        />
      )}
      <ProductList
        products={products}
        ingredients={ingredients}
        units={units}
        isLoading={isLoadingProducts || isLoading}
        error={productError}
        onRetry={refreshProducts}
        onDelete={productIngredient ? undefined : deleteProduct}
      />
    </main>
  );
}
