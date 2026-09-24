export interface Product {
  productId: string;
  ingredientId: string;
  packageUnitId: number;
  brand: string | null;
  productName: string;
  packageQuantity: string;
  upc: string | null;
  userId: string;
  version: number;
}

export interface CreateProductInput {
  ingredientId: string;
  packageUnitId: number;
  brand: string | null;
  productName: string;
  packageQuantity: string;
  upc: string | null;
}

export type UpdateProductInput = Partial<CreateProductInput> & {
  ingredientId: string;
  version: number;
};

export type UnitType = 'weight' | 'volume' | 'count';

export interface Unit {
  unitId: number;
  name: string;
  abbreviation: string;
  unitType: UnitType;
  conversionToBase: string;
  createdAt: Date;
}
