'use client';
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
 */
function detectInstalledMode(): boolean {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
    if ((navigator as any).standalone === true) return true;
    return false;
}

/**
 * Detect iOS (Safari) browser.
 */
function isIOSSafari(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    // Check it's not Chrome/Firefox on iOS
    const isSafari = !(/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua));
    return isIOS && isSafari;
}

/**
 * Hook for PWA install prompt.
 *
 * On Android Chrome: captures beforeinstallprompt, shows "Install" button.
 * On iOS Safari: beforeinstallprompt never fires, so we show
 * "Add to Home Screen" instructions instead.
 * On desktop: event is captured but InstallPrompt component gates display to mobile only.
 */
export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(() => detectInstalledMode());
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Already running as installed app — hide everything
        if (detectInstalledMode()) {
            setIsInstalled(true);
            return;
        }

        // iOS Safari: no beforeinstallprompt support, show manual instructions
        if (isIOSSafari()) {
            setIsIOS(true);
            setIsInstallable(true); // Mark as installable to show the CTA
            return;
        }

        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
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

    return { isInstallable, isInstalled, isIOS, promptInstall };
};
