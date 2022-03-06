import { DocumentData, FieldValue } from 'firebase/firestore';

export interface UserFormData {
  name?: string;
  email: string;
  password: string;
  timestamp?: FieldValue;
}

export interface ListingFormData {
  type: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice: number;
  images: [];
  latitude: number;
  longitude: number;
  userRef?: string;
  imgUrls?: [];
  geolocation?: Geolocation;
  location?: string;
  timestamp?: FieldValue;
}

export interface Listing {
  id: string;
  data: DocumentData;
}

export interface ListingItemProps extends Listing {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface Geolocation {
  lat: number;
  lng: number;
}

export interface Address {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Geocodeing {
  address_components: Address[];
  formatted_address: string;
  geometry: {
    bounds: {
      northeast: Geolocation;
      southwest: Geolocation;
    };
    location: Geolocation;
    location_type: string;
    viewport: {
      northeast: Geolocation;
      southwest: Geolocation;
    };
  };
  place_id: string;
  types: string[];
}

export interface GeocodingResponse {
  results?: Geocodeing[];
  status: string;
}
