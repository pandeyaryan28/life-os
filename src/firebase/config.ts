import { initializeApp, type FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

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
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let analyticsInstance: Analytics | null = null;
let analyticsInitPromise: Promise<Analytics | null> | null = null;

/**
 * CORE INITIALIZER (LAZY)
 * Avoids any Firebase initialization until a service is actually requested.
 * This ensures the initial paint never blocks on Firebase overhead.
 */
export const getApp = (): FirebaseApp => {
    if (!appInstance) {
        appInstance = initializeApp(firebaseConfig);
    }
    return appInstance;
};

export const getAuthService = async (): Promise<Auth> => {
    if (!authInstance) {
        const { getAuth } = await import("firebase/auth");
        authInstance = getAuth(getApp());
    }
    return authInstance;
};

export const getFirestoreService = async (): Promise<Firestore> => {
    if (!dbInstance) {
        const { getFirestore } = await import("firebase/firestore");
        dbInstance = getFirestore(getApp());
    }
    return dbInstance;
};

/**
 * Analytics is high-latency and non-critical.
 * Only loads after the app is stable via IdleCallback.
 */
export const initAnalytics = async (): Promise<Analytics | null> => {
    if (analyticsInstance) return analyticsInstance;
    if (analyticsInitPromise) return analyticsInitPromise;

    analyticsInitPromise = (async () => {
        try {
            const { getAnalytics } = await import('firebase/analytics');
            analyticsInstance = getAnalytics(getApp());
            return analyticsInstance;
        } catch (err) {
            console.error("Analytics load failed:", err);
            return null;
        }
    })();

    return analyticsInitPromise;
};

// Start Analytics only during idle time to maximize TTI
if (typeof window !== 'undefined') {
    const w = window as any;
    const startAnalytics = () => {
        void initAnalytics();
    };

    if ('requestIdleCallback' in w) {
        w.requestIdleCallback(() => void initAnalytics(), { timeout: 10000 });
    } else {
        w.addEventListener('load', startAnalytics, { once: true });
    }
}

// Export legacy-compatible getters to avoid breaking imports immediately
// but update them to use the lazy system. Note: these will be used by 
// top-level imports and might still trigger some bundling, but helps migration.
export const app = getApp();
// auth and db cannot be exported as constants now if we want true lazy route-level splitting
// we will update db.ts and AuthContext.tsx to use the new getters.
