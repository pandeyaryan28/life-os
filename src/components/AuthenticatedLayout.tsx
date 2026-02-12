import React, { useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMobileNav, useOnlineStatus } from '../context/MobileNavContext';
import { LogOut, WifiOff } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { OfflineIndicator } from './OfflineIndicator';
import { InstallPrompt } from './InstallPrompt';

/**
 * Layout wrapper for all authenticated routes.
 * Contains the top bar, background effects, bottom nav, and scrollable content area.
 * Uses React Router's <Outlet /> to render the active page component.
 */
export const AuthenticatedLayout: React.FC = () => {
    const { logout } = useAuth();
    const { isMobile } = useMobileNav();
    const isOnline = useOnlineStatus();
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Add noindex meta tag for authenticated routes
    useEffect(() => {
        let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'robots';
            document.head.appendChild(meta);
        }
        meta.content = 'noindex, nofollow';
        return () => {
            if (meta && meta.parentNode) {
                meta.parentNode.removeChild(meta);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-system-dark text-system-text font-sans selection:bg-system-blue selection:text-white overflow-hidden relative">
            <a href="#main-content" className="skip-to-main">
                Skip to Main Content
            </a>
            {/* Offline Indicator */}
            <OfflineIndicator />

            {/* Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{ backgroundImage: 'linear-gradient(var(--system-border) 1px, transparent 1px), linear-gradient(90deg, var(--system-border) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Scanline Effect — hidden on mobile for performance */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
            )}

            <div className="relative z-10 container mx-auto px-3 md:px-4 h-screen flex flex-col">
                {/* Header — Responsive */}
                <header className={`flex justify-between items-center border-b border-system-border flex-shrink-0 ${isMobile ? 'py-2 mb-3' : 'py-4 mb-6'}`}>
                    <h1 className={`font-mono font-bold text-system-blue tracking-wider uppercase text-glow ${isMobile ? 'text-base' : 'text-2xl'}`}>
                        Life OS <span className="text-xs text-system-blue opacity-50 font-bold bg-system-blue/10 px-1 rounded-sm ml-1">v1.8.1</span>
                    </h1>
                    <div className="flex gap-2 md:gap-4 items-center">
                        {/* Connection Status — Compact on mobile */}
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded-sm ${isOnline ? 'bg-system-blue/10 border-system-blue/20' : 'bg-system-danger/10 border-system-danger/20'}`}>
                            {isOnline ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            ) : (
                                <WifiOff size={10} className="text-system-danger" />
                            )}
                            {!isMobile && (
                                <span className={`text-[10px] font-mono uppercase ${isOnline ? 'text-system-blue' : 'text-system-danger'}`}>
                                    {isOnline ? 'Neural Link: Online' : 'Offline'}
                                </span>
                            )}
                        </div>

                        {/* Sync Status — Desktop only */}
                        {!isMobile && isOnline && (
                            <div className="text-xs font-mono text-system-gold animate-pulse uppercase">
                                Core Sync Active
                            </div>
                        )}

                        {/* Sign Out — always visible but compact on mobile */}
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-1.5 px-2 md:px-3 py-1 bg-system-danger/10 hover:bg-system-danger/20 border border-system-danger/30 rounded-sm text-[10px] font-mono text-system-danger uppercase tracking-widest transition-all tap-feedback"
                            aria-label="Sign Out"
                        >
                            <LogOut size={12} />
                            {!isMobile && <span>Sign Out</span>}
                        </button>
                    </div>
                </header>

                {/*
                  Main Content Area.
                  On mobile: pb-[100px] clears the 64px nav + safe area + breathing room.
                */}
                <main
                    id="main-content"
                    className="flex-1 overflow-y-auto overscroll-contain"
                    style={{
                        paddingBottom: isMobile ? '100px' : '24px'
                    }}
                >
                    <Outlet />
                </main>

                {/* Global Footer */}
                <footer className="flex-shrink-0 py-3 border-t border-system-border/30 flex justify-between items-center text-[9px] font-mono text-system-text/30 uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                        <Link to="/support" className="hover:text-system-blue transition-colors">Support</Link>
                        <span className="text-system-border/30">|</span>
                        <Link to="/privacy" className="hover:text-system-blue transition-colors">Privacy</Link>
                    </div>
                    <span>v1.8.2</span>
                </footer>
            </div>

            {/* Bottom Navigation — Mobile only */}
            <BottomNav />

            {/* Install Prompt — Mobile only (gated inside component) */}
            <InstallPrompt />
        </div>
    );
};
