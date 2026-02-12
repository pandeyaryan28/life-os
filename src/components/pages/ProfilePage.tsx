import React, { useState, lazy, Suspense } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { StatusWindow } from '../StatusWindow';
import { SystemOverlay } from '../SystemOverlay';
import { SystemStatusPanel } from '../shared/SystemStatusPanel';
import { SyncOverlay } from '../shared/SyncOverlay';

const StageOverview = lazy(() => import('../StageOverview').then(m => ({ default: m.StageOverview })));
const MetaSummaries = lazy(() => import('../MetaSummaries').then(m => ({ default: m.MetaSummaries })));
const SystemGuide = lazy(() => import('../SystemGuide').then(m => ({ default: m.SystemGuide })));

const LazyFallback = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
);

export const ProfilePage: React.FC = () => {
    const {
        gameState,
        notifications,
        isSyncing,
        advanceStage,
        updateSettings
    } = useGameEngine();

    const [isStageOverviewOpen, setIsStageOverviewOpen] = useState(false);
    const [summaryType, setSummaryType] = useState<'WEEKLY' | 'MONTHLY' | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    return (
        <>
            <SystemOverlay notifications={notifications} />
            <SyncOverlay isSyncing={isSyncing} />

            <div className="space-y-3">
                <StatusWindow
                    player={gameState.player}
                    onViewStage={() => setIsStageOverviewOpen(true)}
                />
                <SystemStatusPanel
                    gameState={gameState}
                    updateSettings={updateSettings}
                    onOpenGuide={() => setIsGuideOpen(true)}
                    onSetSummaryType={setSummaryType}
                />
            </div>

            <Suspense fallback={<LazyFallback />}>
                {isStageOverviewOpen && (
                    <StageOverview
                        isOpen={isStageOverviewOpen}
                        onClose={() => setIsStageOverviewOpen(false)}
                        player={gameState.player}
                        onAdvance={advanceStage}
                    />
                )}
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
