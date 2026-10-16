export interface StoreLocation {
  storeLocationId: string;
  retailerId: string;
  retailer: { name: string };
  storeNumber: string | null;
  krogerLocationId: string | null;
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
  addressLine2?: string | null;
  city: string;
  stateCode: string;
  postalCode?: string | null;
  krogerLocationId?: string | null;
}

export interface UpdateStoreLocationInput {
  krogerLocationId: string | null;
}

export interface KrogerLocation {
  locationId: string;
  name: string;
  chain: string;
  storeNumber: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateCode: string;
  postalCode: string | null;
}

export interface Retailer {
  retailerId: string;
  name: string;
  websiteUrl: string | null;
}
