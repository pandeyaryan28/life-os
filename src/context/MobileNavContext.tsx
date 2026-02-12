import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type MobileTab = 'dashboard' | 'goals' | 'quests' | 'economy' | 'profile';

interface MobileNavContextType {
    activeTab: MobileTab;
    setActiveTab: (tab: MobileTab) => void;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isMobileDevice: boolean;
}

const MobileNavContext = createContext<MobileNavContextType | undefined>(undefined);

/**
 * Detect if the device is truly a mobile/tablet device using
 * a combination of viewport width, user agent, and touch capability.
 * This is more reliable than viewport alone since desktop windows can be resized.
 */
function detectMobileDevice(): boolean {
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent || '';
    const hasMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallViewport = window.innerWidth <= 1023;

    // Must have touch AND (mobile UA OR small viewport) to be considered mobile device
    // This avoids treating desktop browsers with touch screens as mobile
    return hasTouchScreen && (hasMobileUA || isSmallViewport);
}

export const MobileNavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<MobileTab>('dashboard');
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const [isMobileDevice, setIsMobileDevice] = useState(() => detectMobileDevice());

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setWindowWidth(window.innerWidth);
                setIsMobileDevice(detectMobileDevice());
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
        <MobileNavContext.Provider value={{ activeTab, setActiveTab, isMobile, isTablet, isDesktop, isMobileDevice }}>
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

    // Standard check — Chrome, Edge, Firefox
    if (window.matchMedia('(display-mode: standalone)').matches) return true;

    // iOS Safari fallback — (navigator as any).standalone is iOS-specific
    if ((navigator as any).standalone === true) return true;

    return false;
}

// Hook for PWA install prompt — MOBILE ONLY
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

        // If NOT a mobile device, do not show custom install UI
        // Desktop users can still install via browser menu
        if (!detectMobileDevice()) {
            return;
        }

        const handleBeforeInstall = (e: Event) => {
            // Prevent the automatic mini-infobar from appearing
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

    return { isInstallable, isInstalled, promptInstall };
};
