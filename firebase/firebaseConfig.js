
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
 
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


