export interface Product {
  productId: string;
  ingredientId: string;
  packageUnitId: string;
  brand: string | null;
  productName: string;
  packageQuantity: string;
  upc: string | null;
  userId: string;
  version: number;
}

export interface CreateProductInput {
  ingredientId: string;
  packageUnitId: string;
  brand: string | null;
  productName: string;
  packageQuantity: string;
  upc: string | null;
}

export type UpdateProductInput = Partial<CreateProductInput> & {
  version: number;
};
