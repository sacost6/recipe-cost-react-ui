import type { IngredientUnit } from '../types';

const unitAliases: Record<string, IngredientUnit> = {
    lbs: 'lbs',
    lb: 'lbs',
    pound: 'lbs',
    pounds: 'lbs',

    oz: 'oz',
    ounce: 'oz',
    ounces: 'oz',

    kg: 'kg',
    kilo: 'kg',
    kilogram: 'kg',
    kilograms: 'kg',

    g: 'g',
    gram: 'g',
    grams: 'g',

    gal: 'gal',
    gallon: 'gal',
    gallons: 'gal',

    unit: 'units',
    units: 'units',
    each: 'units',
    ea: 'units',
}

export function parseIngredientUnit(value: string): IngredientUnit | null {
    return unitAliases[value.toLowerCase()] ?? null;
}