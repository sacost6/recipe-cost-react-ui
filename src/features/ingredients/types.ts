export type IngredientUnit = 'lbs' | 'oz' | 'kg' | 'g' | 'gal' | 'units';

export interface Ingredient {
    id: string; 
    name: string; 
    category?: string;  
    unit: IngredientUnit; 
    packageSize: number;
    packageCost: number; 
    costPerUnit: number;
}

export type CreateIngredientInput = Omit<Ingredient, 'id' | 'costPerUnit'>;
export type UpdateIngredientInput = Partial<CreateIngredientInput>;