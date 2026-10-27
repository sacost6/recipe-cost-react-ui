export interface Product {
  productId: string;
  ingredientId: string;
  packageUnitId: number;
  brand: string | null;
  productName: string;
  packageQuantity: string;
  upc: string | null;
  krogerSyncEnabled: boolean;
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
  createdAt: string;
}

export interface KrogerProductSuggestion {
  upc: string | null;
  productName: string;
  brand: string | null;
  packageSize: string | null;
  regularPrice: string | null;
  promoPrice: string | null;
  currentPrice: string | null;
}

export interface KrogerPriceSelection {
  storeLocationId: string;
  price: string;
}
