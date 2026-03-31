'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { initFirebase } from '../firebase/config';

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

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const initializeAuthListener = async () => {
            try {
                // Initialise Firebase only when needed (on mount here to check session)
                const { auth } = await initFirebase();
                const { onAuthStateChanged } = await import('firebase/auth');

                if (auth) {
                    unsubscribe = onAuthStateChanged(auth, (user) => {
                        setUser(user);
                        setLoading(false);
                    });
                }
            } catch (error) {
                console.error("Failed to initialize Firebase Auth listener:", error);
                setLoading(false);
            }
        };

        initializeAuthListener();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const loginAnonymously = async () => {
        try {
            const { auth } = await initFirebase();
            const { signInAnonymously } = await import('firebase/auth');
            if (auth) {
                await signInAnonymously(auth);
            }
        } catch (error) {
            console.error("Error signing in anonymously:", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            const { auth } = await initFirebase();
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            if (auth) {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            console.error("Error signing in with email:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, password: string) => {
        try {
            const { auth } = await initFirebase();
            const { createUserWithEmailAndPassword } = await import('firebase/auth');
            if (auth) {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            console.error("Error signing up with email:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const { auth } = await initFirebase();
            const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
            if (auth) {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const { auth } = await initFirebase();
            const { signOut } = await import('firebase/auth');
            if (auth) {
                await signOut(auth);
            }
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
