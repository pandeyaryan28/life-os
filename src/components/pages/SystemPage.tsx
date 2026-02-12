import React, { useState, lazy, Suspense } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { SystemOverlay } from '../SystemOverlay';
import { SystemStatusPanel } from '../shared/SystemStatusPanel';
import { SyncOverlay } from '../shared/SyncOverlay';

const MetaSummaries = lazy(() => import('../MetaSummaries').then(m => ({ default: m.MetaSummaries })));
const SystemGuide = lazy(() => import('../SystemGuide').then(m => ({ default: m.SystemGuide })));

const LazyFallback = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
);

export const SystemPage: React.FC = () => {
    const { gameState, notifications, isSyncing, updateSettings } = useGameEngine();

    const [summaryType, setSummaryType] = useState<'WEEKLY' | 'MONTHLY' | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    return (
        <>
            <SystemOverlay notifications={notifications} />
            <SyncOverlay isSyncing={isSyncing} />

            <SystemStatusPanel
                gameState={gameState}
                updateSettings={updateSettings}
                onOpenGuide={() => setIsGuideOpen(true)}
                onSetSummaryType={setSummaryType}
            />

            <Suspense fallback={<LazyFallback />}>
                {isGuideOpen && (
                    <SystemGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
                )}
                {summaryType && (
                    <MetaSummaries
                        isOpen={!!summaryType}
                        onClose={() => setSummaryType(null)}
                        gameState={gameState}
                        type={summaryType || 'WEEKLY'}
                    />
                )}
            </Suspense>
        </>
    );
};
