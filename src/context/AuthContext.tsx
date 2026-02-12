import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInAnonymously,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    type Auth,
    type User
} from 'firebase/auth';
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
        // PERF 1.8.2: Lazy load Firebase Auth only when provider mounts
        const initAuth = async () => {
            const authService = await getAuthService();
            setAuth(authService);

            return onAuthStateChanged(authService, (user) => {
                setUser(user);
                setLoading(false);
            });
        };

        const authPromise = initAuth();

        return () => {
            authPromise.then(unsubscribe => unsubscribe?.());
        };
    }, []);

    const loginAnonymously = async () => {
        if (!auth) throw new Error("Auth not initialized");
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        if (!auth) throw new Error("Auth not initialized");
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing in with email:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string) => {
        if (!auth) throw new Error("Auth not initialized");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing up with email:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        if (!auth) throw new Error("Auth not initialized");
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        if (!auth) throw new Error("Auth not initialized");
        try {
            await firebaseSignOut(auth);
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
