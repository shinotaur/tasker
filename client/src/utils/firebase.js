// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY, 
  authDomain: "tasker-dd2a1.firebaseapp.com",
  projectId: "tasker-dd2a1",
  storageBucket: "tasker-dd2a1.appspot.com",
  messagingSenderId: "28053299614",
  appId: "1:28053299614:web:2d38f5db48087c1cfcb68f",
  measurementId: "G-69RC43BQND"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
