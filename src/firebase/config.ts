import { type FirebaseApp } from "firebase/app";
import { type Auth } from "firebase/auth";
import { type Firestore } from "firebase/firestore";
import { type Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA7TsPpHECarAKheUtepciuaP5TtLfhUxo",
    authDomain: "life-os-1e607.firebaseapp.com",
    projectId: "life-os-1e607",
    storageBucket: "life-os-1e607.firebasestorage.app",
    messagingSenderId: "799950917786",
    appId: "1:799950917786:web:c9ef99fa2b86e0f7664f23",
    measurementId: "G-QG09YN7SDV"
};

// Singleton instances
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | null | undefined;

/**
 * Initializes Firebase and its services.
 * This function should be called only when needed to avoid blocking critical rendering.
 */
export const initFirebase = async () => {
    if (app && auth && db) {
        return { app, auth, db, analytics };
    }

    const { initializeApp } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const { getFirestore } = await import("firebase/firestore");
    const { getAnalytics } = await import("firebase/analytics");

    if (!app) {
        app = initializeApp(firebaseConfig);
    }
    
    if (!auth) {
        auth = getAuth(app);
    }
    
    if (!db) {
        db = getFirestore(app);
    }
    
    if (typeof window !== 'undefined' && !analytics) {
        analytics = getAnalytics(app);
    }

    return { app, auth, db, analytics };
};

// Export typed getters for usage after initialization
export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
