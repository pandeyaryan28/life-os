import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * PERF v1.8: Analytics is deferred — loaded only after user interaction or idle.
 * This removes firebase/analytics from the critical path and initial bundle.
 */
let analyticsInstance: Analytics | null = null;
let analyticsInitPromise: Promise<Analytics | null> | null = null;

export const initAnalytics = (): Promise<Analytics | null> => {
    if (analyticsInstance) return Promise.resolve(analyticsInstance);
    if (analyticsInitPromise) return analyticsInitPromise;

    analyticsInitPromise = import('firebase/analytics').then(({ getAnalytics }) => {
        analyticsInstance = getAnalytics(app);
        return analyticsInstance;
    }).catch((err) => {
        console.error("Analytics failed to load:", err);
        analyticsInitPromise = null;
        return null;
    });

    return analyticsInitPromise;
};

// PERF v1.8: Initialize analytics after idle or user interaction
if (typeof window !== 'undefined') {
    // Cast window to any to avoid strict type issues with event listeners in some envs
    const w = window as any;

    const startAnalytics = () => {
        void initAnalytics();
        // Clean up listeners after first trigger
        w.removeEventListener('click', startAnalytics);
        w.removeEventListener('scroll', startAnalytics);
        w.removeEventListener('keydown', startAnalytics);
    };

    if ('requestIdleCallback' in w) {
        w.requestIdleCallback(() => void initAnalytics(), { timeout: 5000 });
    } else {
        // Fallback: load on first user interaction
        w.addEventListener('click', startAnalytics, { once: true, passive: true });
        w.addEventListener('scroll', startAnalytics, { once: true, passive: true });
        w.addEventListener('keydown', startAnalytics, { once: true, passive: true });
    }
}

export { app, auth, db };
