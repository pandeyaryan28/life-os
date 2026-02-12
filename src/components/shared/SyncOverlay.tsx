import React from 'react';
import { Cloud } from 'lucide-react';

interface SyncOverlayProps {
    isSyncing: boolean;
}

export const SyncOverlay: React.FC<SyncOverlayProps> = ({ isSyncing }) => {
    if (!isSyncing) return null;

    return (
        <div className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                    <Cloud size={12} /> Syncing Neural Link...
                </div>
            </div>
        </div>
    );
};
