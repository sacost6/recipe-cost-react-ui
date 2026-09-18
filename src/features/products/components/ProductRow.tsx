import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import type { Product, CreateProductInput } from '../types';
import type { IngredientFormProps } from '../../ingredients/components/IngredientForm';

export interface ProductFormProps {
  onSubmit: (ingredient: CreateProductInput) => void | Promise<void>;
  initialValues?: Partial<Product>;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function ProductForm({
  onSubmit,
  initialValues,
  onCancel,
}: IngredientFormProps) {}
