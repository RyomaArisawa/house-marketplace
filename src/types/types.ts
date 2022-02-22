import { FieldValue } from 'firebase/firestore';

export interface FormData {
  name?: string;
  email: string;
  password: string;
  timestamp?: FieldValue;
}
