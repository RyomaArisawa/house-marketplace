// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAPLsqCfrolRaL0UMlLgYPSLwSLrgntR14',
  authDomain: 'house-marketplace-app-c371a.firebaseapp.com',
  projectId: 'house-marketplace-app-c371a',
  storageBucket: 'house-marketplace-app-c371a.appspot.com',
  messagingSenderId: '687733848804',
  appId: '1:687733848804:web:d86eb25b1e2ba8a90ccaf1',
  measurementId: 'G-DLVW55Z7ZV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
