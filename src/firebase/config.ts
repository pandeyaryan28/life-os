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
        // High-priority for user session
        const { getAuth, setPersistence, browserLocalPersistence } = await import("firebase/auth");
        const instance = getAuth(getApp());
        await setPersistence(instance, browserLocalPersistence);
        authInstance = instance;
    }
    return authInstance;
};

export const getFirestoreService = async (): Promise<Firestore> => {
    if (!dbInstance) {
        // Firestore is heavy, load only when needed
        const { getFirestore, enableIndexedDbPersistence } = await import("firebase/firestore");
        const instance = getFirestore(getApp());

        // Optional: Enable offline persistence for better mobile UX
        try {
            await enableIndexedDbPersistence(instance);
        } catch (err) {
            console.warn("Firestore persistence failed:", err);
        }

        dbInstance = instance;
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

    const delayedInit = () => {
        // Only trigger initialization after the main thread is free
        if ('requestIdleCallback' in w) {
            w.requestIdleCallback(() => void initAnalytics(), { timeout: 15000 });
        } else {
            setTimeout(() => void initAnalytics(), 10000);
        }
    };

    if (document.readyState === 'complete') {
        delayedInit();
    } else {
        window.addEventListener('load', delayedInit, { once: true });
    }
}

// Removed legacy exports that trigger early bundling
// Use getApp(), getAuthService(), getFirestoreService() instead.
