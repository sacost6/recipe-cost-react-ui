import {type Ingredient} from './ingredient'


export interface IngredientsContextType {
    ingredients: Ingredient[]; 
    addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
    deleteIngredient: (id: string) => void; 
}
