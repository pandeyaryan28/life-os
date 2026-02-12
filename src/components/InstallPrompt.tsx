import React, { useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import { useInstallPrompt, useMobileNav } from '../context/MobileNavContext';

export const InstallPrompt: React.FC = () => {
    const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();
    const { isMobile } = useMobileNav();
    const [dismissed, setDismissed] = useState(false);

    // Only show on mobile, when installable, not already installed, and not dismissed
    if (!isMobile || !isInstallable || isInstalled || dismissed) return null;

    return (
        <div className="install-prompt">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-system-blue/20 rounded-md flex-shrink-0">
                    {isIOS ? <Share size={18} className="text-system-blue" /> : <Download size={18} className="text-system-blue" />}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-white uppercase tracking-wide">Install LIFE OS</p>
                    {isIOS ? (
                        <p className="text-[10px] font-mono text-system-text/60 mt-0.5 leading-relaxed">
                            Tap <Share size={10} className="inline text-system-blue" /> then <span className="text-white font-bold">"Add to Home Screen"</span>
                        </p>
                    ) : (
                        <p className="text-[10px] font-mono text-system-text/60 uppercase mt-0.5">Add to home screen</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={() => setDismissed(true)}
                    className="p-2 text-system-text/50 active:text-white transition-colors tap-feedback"
                    aria-label="Dismiss install prompt"
                >
                    <X size={16} />
                </button>
                {!isIOS && (
                    <button
                        onClick={promptInstall}
                        className="px-4 py-2 bg-system-blue text-white text-[10px] font-black uppercase tracking-widest rounded-sm tap-feedback shadow-[0_0_15px_rgba(0,170,255,0.3)]"
                    >
                        Install
                    </button>
                )}
            </div>
        </div>
    );
};
