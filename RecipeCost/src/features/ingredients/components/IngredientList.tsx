import { type Ingredient } from '../types.ts';
import IngredientRow from './IngredientRow';
import IngredientEmptyState from './IngredientEmptyState';

export interface IngredientListProps {
    ingredients: Ingredient[];
    onDelete? : (id: string) => Promise<void>;
    onEdit? : (ingredient: Ingredient) => void;
}

export default function IngredientList({
    ingredients, 
    onDelete, 
    onEdit
} : IngredientListProps) {

    if (ingredients.length === 0) {
        return (
            <IngredientEmptyState/>
        );
    }

    const showActions = Boolean(onEdit || onDelete);

    return (
        <section className="w-full" aria-label="ingredients-heading">
            <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                    <h2 id="ingredients-heading" className="text-lg font-semibold text-text">
                        Ingredients
                    </h2>
                    <p className="text-sm text-muted">
                        {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-background text-xs uppercase text-muted">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Ingredient</th> 
                            <th className="px-4 py-3 font-semibold">Amount Purchased</th>
                            <th className="px-4 py-3 font-semibold">Purchase Price</th>
                            <th className="px-4 py-3 font-semibold">Cost Per Unit</th>
                            {showActions && (<th className="px-4 py-3 font-semibold">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {ingredients.map((ingredient) => (
                            <IngredientRow 
                                key={ingredient.id}
                                ingredient={ingredient}
                                showActions={showActions}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );}