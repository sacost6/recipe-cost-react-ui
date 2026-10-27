export interface ProductPrice {
  priceId: string;
  productId: string;
  storeLocationId: string;
  price: string;
  source?: 'manual' | 'kroger';
  currencyCode: string;
  recordedAt: string;
}

export interface CreateProductPriceInput {
  productId: string;
  price: string;
  storeLocationId: string;
  currencyCode: string;
  source?: 'manual' | 'kroger';
}
