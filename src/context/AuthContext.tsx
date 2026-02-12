import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Auth } from 'firebase/auth';
import { getAuthService } from '../firebase/config';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInAnonymously: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState<Auth | null>(null);

    useEffect(() => {
        /**
         * PERF v1.8.3: Defer Auth initialization until after first paint.
         * This allows the app shell to render immediately without waiting for Firebase.
         */
        const initAuthDeferred = async () => {
            try {
                const [authService, { onAuthStateChanged }] = await Promise.all([
                    getAuthService(),
                    import("firebase/auth")
                ]);

                setAuth(authService);

                return onAuthStateChanged(authService, (user) => {
                    setUser(user);
                    setLoading(false);
                });
            } catch (err) {
                console.error("Auth init failed:", err);
                setLoading(false);
            }
        };

        let unsubscribe: (() => void) | undefined;

        // Use requestIdleCallback to avoid blocking the main thread during initial load
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                initAuthDeferred().then(unsub => {
                    if (unsub) unsubscribe = unsub;
                });
            });
        } else {
            // Fallback for older browsers
            setTimeout(() => {
                initAuthDeferred().then(unsub => {
                    if (unsub) unsubscribe = unsub;
                });
            }, 1000);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const loginAnonymously = async () => {
        const authService = auth || await getAuthService();
        const { signInAnonymously } = await import("firebase/auth");
        try {
            await signInAnonymously(authService);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        const authService = auth || await getAuthService();
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        try {
            await signInWithEmailAndPassword(authService, email, password);
        } catch (error) {
            console.error("Error signing in with email:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string) => {
        const authService = auth || await getAuthService();
        const { createUserWithEmailAndPassword } = await import("firebase/auth");
        try {
            await createUserWithEmailAndPassword(authService, email, password);
        } catch (error) {
            console.error("Error signing up with email:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        const authService = auth || await getAuthService();
        const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(authService, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        const authService = auth || await getAuthService();
        const { signOut } = await import("firebase/auth");
        try {
            await signOut(authService);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signInAnonymously: loginAnonymously,
            signInWithEmail: loginWithEmail,
            signUpWithEmail: registerWithEmail,
            signInWithGoogle: loginWithGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
