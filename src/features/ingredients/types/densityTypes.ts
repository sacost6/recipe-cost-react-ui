export interface IngredientDensity {
  densityId: string;
  ingredientId: string;
  userId: string;
  densityGramsPerMl: string;
  fdcId: number;
  dataType: string;
  foodDescription: string;
  portionId: number;
  portionAmount: string;
  portionDescription: string;
  measureUnit: string;
  gramWeight: string;
  confirmedAt: string;
}

export interface UsdaFoodSearchResult {
  fdcId: number;
  dataType: string;
  description: string;
  brandOwner?: string | null;
}

export interface UsdaDensitySuggestion {
  fdcId: number;
  dataType: string;
  foodDescription: string;
  portionId: number;
  portionAmount: string;
  portionDescription: string;
  measureUnit: string;
  gramWeight: string;
  densityGramsPerMl: string;
}
