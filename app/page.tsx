'use client';

import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { useGameEngine } from '@/hooks/useGameEngine';
import Script from 'next/script';
import dynamic from 'next/dynamic';

// Dynamic Imports with Lazy Loading
const Dashboard = dynamic(() => import('@/components/Dashboard').then(mod => mod.Dashboard), { ssr: false });
const Login = dynamic(() => import('@/components/Login').then(mod => mod.Login), { ssr: false });
const OnboardingScreen = dynamic(() => import('@/components/OnboardingScreen').then(mod => mod.OnboardingScreen), { ssr: false });

const LoadingSpinner = () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
);

function AppContent() {
    const { user, loading } = useAuth();
    const { gameState, updateProfile, isSyncing } = useGameEngine();

    // Show loading while auth or game sync is loading
    if (loading || (user && isSyncing)) {
        return <LoadingSpinner />;
    }

    // Not logged in - show login
    if (!user) {
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <Login />
            </Suspense>
        );
    }

    // Needs onboarding
    const needsOnboarding = !gameState.player.firstName || gameState.player.firstName === 'Player';
    if (needsOnboarding) {
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <OnboardingScreen
                    onComplete={(data) => {
                        updateProfile(data);
                    }}
                />
            </Suspense>
        );
    }

    // Show dashboard for all users (freemium - features are gated inside)
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
        </Suspense>
    );
}

export default function Home() {
    return (
        <>
            <AuthProvider>
                <SubscriptionProvider>
                    <AppContent />
                </SubscriptionProvider>
            </AuthProvider>

            {/* Deferred Scripts for Performance */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-QG09YN7SDV"
                strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QG09YN7SDV');
        `}
            </Script>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />
        </>
    );
}
