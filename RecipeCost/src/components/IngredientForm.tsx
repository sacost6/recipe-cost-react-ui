import React, { useState } from 'react';
import Button from './Button';
import {type Ingredient } from '../types/ingredient'
import {type IngredientFormProps} from '../types/ingredientFormProps';

export default function IngredientForm({
    onSubmit, 
    initialValues, 
    submitLabel = 'Add Ingredient',
    onCancel,
} : IngredientFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [category, setCategory] = useState(initialValues?.category || '');
    const [quantity, setQuantity] = useState(initialValues?.quantity?.toString() || '');
    const [unit, setUnit] = useState(initialValues?.unit || 'lbs');
    const [cost, setCost] = useState(initialValues?.cost?.toString() || '');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if(!name || !quantity || !cost) {
            return; 
        }

        onSubmit({
            name, 
            category, 
            quantity: parseFloat(quantity),
            unit, 
            cost: parseFloat(cost),
        });

        // Reset for new item
        if(!initialValues) {
            setName('');
            setQuantity('');
            setCost('');
        }
    } 
}
