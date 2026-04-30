export type PropertyItem = {
  _id?: string;
  id?: string;
  listingType?: string;
  type?: string;
  segment?: string;
  transactionType?: string;
  address?: {
    locality?: string;
    society?: string;
    city?: string;
    floor?: string | number;
  };
  configuration?: {
    bedrooms?: number | string | null;
    bathrooms?: number | string | null;
  };
  area?: {
    superBuiltup?: number;
    carpet?: number;
    plot?: number;
    unit?: string;
  };
  financial?: {
    price?: number;
    rent?: number;
    maintenance?: number;
    bookingAmount?: number;
  };
  building?: {
    totalFloors?: number | string;
    propertyAge?: number | string;
    facing?: string;
    roadWidth?: number | string;
    furnishing?: string;
  };
  amenities?: {
    lift?: boolean;
    parking?: boolean;
    gated?: boolean;
    corner?: boolean;
  };
  condition?: {
    renovated?: boolean;
    newlyBuilt?: boolean;
  };
  plotDetails?: Record<string, unknown>;
  sourceMeta?: {
    brokerName?: string;
    phone?: string;
  };
  contact?: {
    phone?: string;
  };
};
