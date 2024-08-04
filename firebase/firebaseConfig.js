
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {getStorage} from "firebase/storage"
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-nVz_wQ-5GJU4B7I2DtL87Sg_QSO3gHU",
  authDomain: "stminakouf-6e574.firebaseapp.com",
  projectId: "stminakouf-6e574",
  storageBucket: "stminakouf-6e574.appspot.com",
  messagingSenderId: "1012859410979",
  appId: "1:1012859410979:web:26df89dbc2be0f0ba6ef96"
};
      
      // Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


