import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7TsPpHECarAKheUtepciuaP5TtLfhUxo",
    authDomain: "life-os-1e607.firebaseapp.com",
    projectId: "life-os-1e607",
    storageBucket: "life-os-1e607.firebasestorage.app",
    messagingSenderId: "799950917786",
    appId: "1:799950917786:web:c9ef99fa2b86e0f7664f23",
    measurementId: "G-QG09YN7SDV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, auth, db, analytics };
