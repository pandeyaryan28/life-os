import React, { useState, lazy, Suspense } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useSubscription } from '../../context/SubscriptionContext';
import { useMobileNav } from '../../context/MobileNavContext';
import { StatusWindow } from '../StatusWindow';
import { QuestLog } from '../QuestLog';
import { GoalsPanel } from '../GoalsPanel';
import { QuestCreationModal } from '../QuestCreationModal';
import { ExpensesPanel } from '../ExpensesPanel';
import { ManualAdjustmentPanel } from '../ManualAdjustmentPanel';
import { MigrationModal } from '../MigrationModal';
import { SubscribeBanner } from '../SubscribeBanner';
import { SubscribeModal } from '../SubscribeModal';
import { CompactPlayerCard } from '../CompactPlayerCard';
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

export const DashboardPage: React.FC = () => {
    const {
        gameState,
        notifications,
        isMigrationPending,
        isSyncing,
        performMigration,
        cancelMigration,
        addQuest,
        completeQuest,
        failQuest,
        advanceStage,
        updateSettings,
        addExpense,
        applyManualAdjustment,
        addGoal,
        linkQuestToGoal,
        unlinkQuestFromGoal,
        deleteQuest,
        payExpense,
        deleteGoal
    } = useGameEngine();

    const { requireSubscription, showSubscribeModal, subscribeModalFeature, closeSubscribeModal } = useSubscription();
    const { isMobile } = useMobileNav();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [preSelectedGoalId, setPreSelectedGoalId] = useState<string | undefined>(undefined);
    const [isStageOverviewOpen, setIsStageOverviewOpen] = useState(false);
    const [summaryType, setSummaryType] = useState<'WEEKLY' | 'MONTHLY' | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Wrap actions with subscription check
    const gatedAddQuest = (questData: Parameters<typeof addQuest>[0]) => {
        if (requireSubscription('Create Quest')) addQuest(questData);
    };
    const gatedCompleteQuest = (questId: string) => {
        if (requireSubscription('Complete Quest')) completeQuest(questId);
    };
    const gatedFailQuest = (questId: string) => {
        if (requireSubscription('Fail Quest')) failQuest(questId);
    };
    const gatedAddGoal = (goalData: Parameters<typeof addGoal>[0]) => {
        if (requireSubscription('Create Goal')) addGoal(goalData);
    };
    const gatedAddExpense = (expenseData: Parameters<typeof addExpense>[0]) => {
        if (requireSubscription('Add Expense')) addExpense(expenseData);
    };
    const gatedApplyAdjustment = (adj: Parameters<typeof applyManualAdjustment>[0]) => {
        if (requireSubscription('Apply Adjustment')) applyManualAdjustment(adj);
    };
    const gatedPayExpense = (expenseId: string) => {
        if (requireSubscription('Pay Expense')) payExpense(expenseId);
    };

    // ── MOBILE LAYOUT ──
    if (isMobile) {
        return (
            <>
                <SystemOverlay notifications={notifications} />
                <SubscribeModal isOpen={showSubscribeModal} onClose={closeSubscribeModal} featureName={subscribeModalFeature} />
                <MigrationModal isOpen={isMigrationPending} onConfirm={performMigration} onCancel={cancelMigration} />
                <SyncOverlay isSyncing={isSyncing} />
                <SubscribeBanner />

                <div className="mb-3">
                    <CompactPlayerCard
                        player={gameState.player}
                        onViewStage={() => setIsStageOverviewOpen(true)}
                    />
                </div>

                <div className="space-y-3">
                    <div className="min-h-[300px]">
                        <GoalsPanel
                            goals={gameState.goals}
                            quests={gameState.quests}
                            onAddGoal={gatedAddGoal}
                            onLinkQuest={linkQuestToGoal}
                            onUnlinkQuest={unlinkQuestFromGoal}
                            onDeleteGoal={deleteGoal}
                            onDeleteQuest={deleteQuest}
                            onTriggerNewQuest={(goalId) => {
                                if (requireSubscription('Create Quest')) {
                                    setPreSelectedGoalId(goalId);
                                    setIsCreateModalOpen(true);
                                }
                            }}
                        />
                    </div>
                    <div className="min-h-[300px]">
                        <QuestLog
                            quests={gameState.quests}
                            onComplete={gatedCompleteQuest}
                            onFail={gatedFailQuest}
                            onDelete={deleteQuest}
                            onCreateQuest={() => {
                                if (requireSubscription('Create Quest')) setIsCreateModalOpen(true);
                            }}
                        />
                    </div>
                </div>

                <QuestCreationModal
                    isOpen={isCreateModalOpen}
                    onClose={() => { setIsCreateModalOpen(false); setPreSelectedGoalId(undefined); }}
                    onCreateQuest={gatedAddQuest}
                    goals={gameState.goals}
                    initialGoalId={preSelectedGoalId}
                />

                <Suspense fallback={<LazyFallback />}>
                    {isStageOverviewOpen && (
                        <StageOverview isOpen={isStageOverviewOpen} onClose={() => setIsStageOverviewOpen(false)} player={gameState.player} onAdvance={advanceStage} />
                    )}
                    {isGuideOpen && (
                        <SystemGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
                    )}
                    {summaryType && (
                        <MetaSummaries isOpen={!!summaryType} onClose={() => setSummaryType(null)} gameState={gameState} type={summaryType || 'WEEKLY'} />
                    )}
                </Suspense>
            </>
        );
    }

    // ── DESKTOP/TABLET LAYOUT ──
    return (
        <>
            <SystemOverlay notifications={notifications} />
            <SubscribeModal isOpen={showSubscribeModal} onClose={closeSubscribeModal} featureName={subscribeModalFeature} />
            <MigrationModal isOpen={isMigrationPending} onConfirm={performMigration} onCancel={cancelMigration} />
            <SyncOverlay isSyncing={isSyncing} />
            <SubscribeBanner />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full pb-6">
                {/* Column 1: Identity & Penalties */}
                <div className="xl:col-span-3 space-y-4 flex flex-col">
                    <StatusWindow player={gameState.player} onViewStage={() => setIsStageOverviewOpen(true)} />
                    <div className="flex-1 min-h-[300px]">
                        <ManualAdjustmentPanel history={gameState.manualAdjustments} onApplyAdjustment={gatedApplyAdjustment} />
                    </div>
                </div>

                {/* Column 2: Execution Engine (Goals & Quests) */}
                <div className="xl:col-span-6 space-y-4 flex flex-col">
                    <div className="h-[40%] min-h-[300px]">
                        <GoalsPanel
                            goals={gameState.goals}
                            quests={gameState.quests}
                            onAddGoal={gatedAddGoal}
                            onLinkQuest={linkQuestToGoal}
                            onUnlinkQuest={unlinkQuestFromGoal}
                            onDeleteGoal={deleteGoal}
                            onDeleteQuest={deleteQuest}
                            onTriggerNewQuest={(goalId) => {
                                if (requireSubscription('Create Quest')) {
                                    setPreSelectedGoalId(goalId);
                                    setIsCreateModalOpen(true);
                                }
                            }}
                        />
                    </div>
                    <div className="h-[60%] min-h-[400px]">
                        <QuestLog
                            quests={gameState.quests}
                            onComplete={gatedCompleteQuest}
                            onFail={gatedFailQuest}
                            onDelete={deleteQuest}
                            onCreateQuest={() => {
                                if (requireSubscription('Create Quest')) setIsCreateModalOpen(true);
                            }}
                        />
                    </div>
                </div>

                {/* Column 3: Economy & System Operations */}
                <div className="xl:col-span-3 space-y-4 flex flex-col">
                    <div className="h-[55%] min-h-[350px]">
                        <ExpensesPanel
                            credits={gameState.player.credits}
                            expenseHistory={gameState.expenseHistory}
                            recurringExpenses={gameState.expenses}
                            onAddExpense={gatedAddExpense}
                            onPayExpense={gatedPayExpense}
                        />
                    </div>
                    <SystemStatusPanel
                        gameState={gameState}
                        updateSettings={updateSettings}
                        onOpenGuide={() => setIsGuideOpen(true)}
                        onSetSummaryType={setSummaryType}
                    />
                </div>
            </div>

            <QuestCreationModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setPreSelectedGoalId(undefined); }}
                onCreateQuest={gatedAddQuest}
                goals={gameState.goals}
                initialGoalId={preSelectedGoalId}
            />

            <Suspense fallback={<LazyFallback />}>
                {isStageOverviewOpen && (
                    <StageOverview isOpen={isStageOverviewOpen} onClose={() => setIsStageOverviewOpen(false)} player={gameState.player} onAdvance={advanceStage} />
                )}
                {isGuideOpen && (
                    <SystemGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
                )}
                {summaryType && (
                    <MetaSummaries isOpen={!!summaryType} onClose={() => setSummaryType(null)} gameState={gameState} type={summaryType || 'WEEKLY'} />
                )}
            </Suspense>
        </>
    );
};
