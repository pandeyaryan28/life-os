import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type MobileTab = 'dashboard' | 'goals' | 'quests' | 'economy' | 'profile';

interface MobileNavContextType {
    activeTab: MobileTab;
    setActiveTab: (tab: MobileTab) => void;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

export const MobileNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<MobileTab>('dashboard');
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setWindowWidth(window.innerWidth);
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeout);
        };
    }, []);

    const isMobile = windowWidth <= 767;
    const isTablet = windowWidth >= 768 && windowWidth <= 1023;
    const isDesktop = windowWidth >= 1024;

    return (
        <MobileNavContext.Provider value={{ activeTab, setActiveTab, isMobile, isTablet, isDesktop }}>
            {children}
        </MobileNavContext.Provider>
    );
};

export const useMobileNav = () => {
    const context = useContext(MobileNavContext);
    if (context === undefined) {
        throw new Error('useMobileNav must be used within a MobileNavProvider');
    }
    return context;
};

// Hook for detecting online/offline status
export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};

/**
 * Detect if app is running in installed/standalone mode.
 * Covers both Android (display-mode: standalone) and iOS (navigator.standalone).
 */
function detectInstalledMode(): boolean {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if ((navigator as any).standalone === true) return true;
    return false;
}

/**
 * Hook for PWA install prompt.
 * 
 * ALWAYS captures the beforeinstallprompt event (regardless of device type).
 * The component rendering the CTA is responsible for checking isMobile
 * to decide whether to show the UI.
 * 
 * Returns isInstallable (event captured), isInstalled (standalone mode),
 * and promptInstall function.
 */
export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(() => detectInstalledMode());

    useEffect(() => {
        // If already installed, nothing to do
        if (detectInstalledMode()) {
            setIsInstalled(true);
            return;
        }

        const handleBeforeInstall = (e: Event) => {
            // Prevent Chrome's automatic mini-infobar
            e.preventDefault();
            // Store the event so it can be triggered later
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) return false;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsInstallable(false);
        return outcome === 'accepted';
    }, [deferredPrompt]);

    return { isInstallable, isInstalled, promptInstall };
};
