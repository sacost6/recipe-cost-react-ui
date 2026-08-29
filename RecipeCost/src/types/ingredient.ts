export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'lbs' | 'oz' | 'kg' | 'g' | 'gal' | 'units';
  cost: number;
}

// Omit 'id' for forms creating brand new ingredients before an ID exists
export type NewIngredientInput = Omit<Ingredient, 'id'>;