import React, {createContext, useContext, useState, useEffect} from 'react';
import {type Ingredient} from '../types/ingredient'
import { type IngredientsContextType } from '../types/ingredientsContextType';

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export function IngredientsProvider({children}: {children: React.ReactNode}) {
    // 1. Initialize state from localStorage (or fallback to defaults)
    const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
        const saved = localStorage.getItem('recipe_cost_ingredients');
        if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
        }
        return [
        { id: '1', name: 'Whole Milk', category: 'Dairy', quantity: 1, unit: 'gal', cost: 3.49 },
        { id: '2', name: 'Granulated Sugar', category: 'Pantry', quantity: 5, unit: 'lbs', cost: 4.29 },
        ];
    });

    // 2. Sync state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('recipe_cost_ingredients', JSON.stringify(ingredients));
    }, [ingredients]);

    const addIngredient = (newItem: Omit<Ingredient, 'id'>) => {
        const ingredientWithId: Ingredient = { ...newItem, id: Date.now().toString() };
        setIngredients((prev) => [ingredientWithId, ...prev]);
    };

    const deleteIngredient = (id: string) => {
        setIngredients((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <IngredientsContext.Provider value={{ ingredients, addIngredient, deleteIngredient }}>
        {children}
        </IngredientsContext.Provider>
    );
    
}


// Custom hook for consuming context
export function useIngredients() {
    const context = useContext(IngredientsContext);

    if(!context) {
        throw new Error('useIngredients must be used within an IngredientsProvider');
    }

    return context; 
}