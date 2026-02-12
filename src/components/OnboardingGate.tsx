import React from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import { OnboardingScreen } from './OnboardingScreen';
import { useAuth } from '../context/AuthContext';

interface OnboardingGateProps {
    children: React.ReactNode;
}

/**
 * Checks if user needs onboarding (first-time setup).
 * If yes, shows OnboardingScreen. Otherwise renders children.
 */
export const OnboardingGate: React.FC<OnboardingGateProps> = ({ children }) => {
    const { user } = useAuth();
    const { gameState, updateProfile, isSyncing } = useGameEngine();

    // While game state is syncing, show loading
    if (user && isSyncing) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Check if needs onboarding
    const needsOnboarding = !gameState.player.firstName || gameState.player.firstName === 'Player';
    if (needsOnboarding) {
        return (
            <OnboardingScreen
                onComplete={(data) => {
                    updateProfile(data);
                }}
            />
        );
    }

    return <>{children}</>;
};
