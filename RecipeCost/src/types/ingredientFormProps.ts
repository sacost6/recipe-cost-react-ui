import {type Ingredient} from './ingredient';

export interface IngredientFormProps {
    onSubmit: (ingredient: Omit<Ingredient, 'id'>) => void; 
    initialValues?: Partial<Ingredient>;
    submitLabel?: string;
    onCancel?: () => void;
}