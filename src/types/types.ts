import { DocumentData, FieldValue } from 'firebase/firestore';

export interface FormData {
  name?: string;
  email: string;
  password: string;
  timestamp?: FieldValue;
}

export interface Listing {
  id: string;
  data: DocumentData;
}

export interface ListingItemProps extends Listing {
  onDelete?: (id: string, data: DocumentData) => void;
}
