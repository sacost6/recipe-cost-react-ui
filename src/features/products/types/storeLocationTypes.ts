export interface StoreLocation {
  storeLocationId: string;
  retailerId: string;
  storeNumber: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateCode: string;
  postalCode: string;
  countryCode: string;
}

export interface CreateStoreLocationInput {
  retailerId: string;
  storeNumber?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateCode: string;
  postalCode: string;
  countryCode: string;
}
