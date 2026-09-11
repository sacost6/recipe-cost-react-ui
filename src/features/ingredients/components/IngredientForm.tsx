import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import type { Ingredient, CreateIngredientInput, IngredientUnit } from '../types'; 

export interface IngredientFormProps {
    onSubmit: (ingredient: CreateIngredientInput) => void | Promise<void>; 
    initialValues?: Partial<Ingredient>;
    submitLabel?: string;
    onCancel?: () => void;
}

const unitOptions: IngredientUnit[] = ['lbs', 'oz', 'kg', 'g', 'gal', 'units'];

export default function IngredientForm({
    onSubmit, 
    initialValues, 
    submitLabel = 'Add Ingredient',
    onCancel,
} : IngredientFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [category, setCategory] = useState(initialValues?.category || ''); 
    const [unit, setUnit] = useState<Ingredient['unit']>(initialValues?.unit || 'g');
    const [packageCost, setPackageCost] = useState(initialValues?.packageCost?.toString() || '');
    const [packageSize, setPackageSize] = useState(initialValues?.packageSize?.toString() || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setName('');
        setCategory('');
        setUnit('g');
        setPackageCost('');
        setPackageSize('');
    };

    useEffect(() => {
        setName(initialValues?.name ?? '');
        setCategory(initialValues?.category ?? '');
        setUnit(initialValues?.unit ?? 'g');
        setPackageCost(initialValues?.packageCost?.toString() ?? '');
        setPackageSize(initialValues?.packageSize?.toString() ?? '');
    }, [initialValues]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
 
        const parsedPackageSize = Number(packageSize);
        const parsedPackageCost = Number(packageCost);

        if (
            !name.trim() ||
            !Number.isFinite(parsedPackageSize) ||
            parsedPackageSize <= 0 ||
            !Number.isFinite(parsedPackageCost) ||
            parsedPackageCost <= 0
        ) {
            return;
        } 
        setIsSubmitting(true);

        try {

            await onSubmit({
                name: name.trim(), 
                category: category.trim(),  
                unit,
                packageCost: parsedPackageCost,
                packageSize: parsedPackageSize,
            });

            // Reset for new item
            if(!initialValues) {
                resetForm();
            } 
        }
        finally {
            setIsSubmitting(false);
        }
    } 

    return (
        <div className="w-full max-w-md mx-auto bg-surface p-6 rounded-xl border border-border shadow-sm text-left">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label 
                        htmlFor="name"
                        className="block text-sm font-medium text-muted mb-1.5"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}    
                        disabled={isSubmitting}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
                    />
                </div>
                <div>
                    <label 
                        htmlFor="category"
                        className="block text-sm font-medium text-muted mb-1.5"
                    >
                        Category
                    </label>
                    <input
                        type="text"
                        id="category"
                        value={category}    
                        disabled={isSubmitting}  
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
                    />
                </div>
                    <div className="grid grid-cols-[1fr_120px] gap-3">
                        <div>
                        <label
                            htmlFor="packageSize"
                            className="block text-sm font-medium text-muted mb-1.5"
                        >
                            Amount Purchased
                        </label> 
                        <input
                            type="number"
                            min="0"
                            step="any"
                            id="packageSize"
                            value={packageSize}    
                            disabled={isSubmitting}
                            onChange={(e) => setPackageSize(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
                        />
                    </div> 
                    <div>
                        <label 
                            htmlFor="unit"
                            className="block text-sm font-medium text-muted mb-1.5       "
                        >
                            Unit
                        </label>
                        <select
                            id="unit"
                            value={unit}
                            disabled={isSubmitting}
                            onChange={(e) => setUnit(e.target.value as Ingredient['unit'])}
                            className="w-full px-3.5 py-2 text-sm text-center rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary transition-colors" 
                        >
                            {unitOptions.map((unitOption) => (
                                <option key={unitOption} value={unitOption}>
                                    {unitOption}
                                </option>
                            ))}
                        </select>
                    </div>
                </div> 
                <div>
                    <label 
                        htmlFor="packageCost"
                        className="block text-sm font-medium text-muted mb-1.5       "
                    >
                        Purchase Price
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        id="packageCost"
                        value={packageCost}
                        disabled={isSubmitting}
                        onChange={(e) => setPackageCost(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors"
                    />
                </div>
                <div className="pt-3 flex justify-end gap-3">
                    <Button 
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        {submitLabel}
                    </Button>
                    {onCancel && (
                        <Button 
                            type="button" 
                            onClick={onCancel}
                            variant="secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
            </div>

        );
}
