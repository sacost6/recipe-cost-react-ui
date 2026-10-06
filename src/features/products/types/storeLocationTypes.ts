export interface StoreLocation {
  storeLocationId: string;
  retailerId: string;
  retailer: { name: string };
  storeNumber: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateCode: string | null;
  postalCode: string | null;
  countryCode: string;
}

export interface CreateStoreLocationInput {
  retailerId: string;
  storeNumber?: string | null;
  streetName: string;
  city: string;
  stateCode: string;
}

export interface Retailer {
  retailerId: string;
  name: string;
  websiteUrl: string | null;
}
