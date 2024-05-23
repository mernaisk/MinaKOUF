import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId:process.env.REACT_APP_APP_ID
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


