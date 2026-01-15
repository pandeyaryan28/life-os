import React, { useState } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import { useSubscription } from '../context/SubscriptionContext';
import { Layout } from './Layout';
import { StatusWindow } from './StatusWindow';
import { QuestLog } from './QuestLog';
import { SystemOverlay } from './SystemOverlay';
import { QuestCreationModal } from './QuestCreationModal';
import { StageOverview } from './StageOverview';
import { MetaSummaries } from './MetaSummaries';
import { ExpensesPanel } from './ExpensesPanel';
import { ManualAdjustmentPanel } from './ManualAdjustmentPanel';
import { GoalsPanel } from './GoalsPanel';
import { MigrationModal } from './MigrationModal';
import { SubscribeBanner } from './SubscribeBanner';
import { SubscribeModal } from './SubscribeModal';
import { Terminal, Settings as SettingsIcon, BarChart3, RefreshCw, XCircle, Calendar as CalendarIcon, Cloud, BookOpen } from 'lucide-react';
import { SystemGuide } from './SystemGuide';

export const Dashboard: React.FC = () => {
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

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [preSelectedGoalId, setPreSelectedGoalId] = useState<string | undefined>(undefined);
    const [isStageOverviewOpen, setIsStageOverviewOpen] = useState(false);
    const [summaryType, setSummaryType] = useState<'WEEKLY' | 'MONTHLY' | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Wrap actions with subscription check
    const gatedAddQuest = (questData: Parameters<typeof addQuest>[0]) => {
        if (requireSubscription('Create Quest')) {
            addQuest(questData);
        }
    };

    const gatedCompleteQuest = (questId: string) => {
        if (requireSubscription('Complete Quest')) {
            completeQuest(questId);
        }
    };

    const gatedFailQuest = (questId: string) => {
        if (requireSubscription('Fail Quest')) {
            failQuest(questId);
        }
    };

    const gatedAddGoal = (goalData: Parameters<typeof addGoal>[0]) => {
        if (requireSubscription('Create Goal')) {
            addGoal(goalData);
        }
    };

    const gatedAddExpense = (expenseData: Parameters<typeof addExpense>[0]) => {
        if (requireSubscription('Add Expense')) {
            addExpense(expenseData);
        }
    };

    const gatedApplyAdjustment = (adj: Parameters<typeof applyManualAdjustment>[0]) => {
        if (requireSubscription('Apply Adjustment')) {
            applyManualAdjustment(adj);
        }
    };

    const gatedPayExpense = (expenseId: string) => {
        if (requireSubscription('Pay Expense')) {
            payExpense(expenseId);
        }
    };

    return (
        <Layout>
            <SystemOverlay notifications={notifications} />

            {/* Subscribe Modal for feature gating */}
            <SubscribeModal
                isOpen={showSubscribeModal}
                onClose={closeSubscribeModal}
                featureName={subscribeModalFeature}
            />

            <MigrationModal
                isOpen={isMigrationPending}
                onConfirm={performMigration}
                onCancel={cancelMigration}
            />

            {isSyncing && (
                <div className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                            <Cloud size={12} /> Syncing Neural Link...
                        </div>
                    </div>
                </div>
            )}

            {/* Subscribe Banner for non-subscribers */}
            <SubscribeBanner />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-full pb-6">
                {/* Column 1: Identity & Penalties */}
                <div className="xl:col-span-3 space-y-4 flex flex-col">
                    <StatusWindow
                        player={gameState.player}
                        onViewStage={() => setIsStageOverviewOpen(true)}
                    />
                    <div className="flex-1 min-h-[300px]">
                        <ManualAdjustmentPanel
                            history={gameState.manualAdjustments}
                            onApplyAdjustment={gatedApplyAdjustment}
                        />
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
                                if (requireSubscription('Create Quest')) {
                                    setIsCreateModalOpen(true);
                                }
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

                    <div className="bg-system-panel border border-system-border p-4 rounded-sm flex-1 space-y-4 shadow-xl">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-system-text/40 uppercase tracking-widest">
                                <Terminal size={12} /> System Status
                            </div>
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className={`p-1.5 rounded-sm transition-colors ${isSettingsOpen ? 'bg-system-blue text-white' : 'bg-system-dark/50 text-system-text/40 hover:text-white'}`}
                            >
                                <SettingsIcon size={14} />
                            </button>
                        </div>

                        {isSettingsOpen ? (
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-[9px] font-mono text-system-text/60 group-hover:text-white transition-colors flex items-center gap-2 uppercase">
                                            <RefreshCw size={10} /> Auto-Renew Dailies
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={gameState.settings.autoRenewDailies}
                                            onChange={(e) => updateSettings({ autoRenewDailies: e.target.checked })}
                                            className="accent-system-blue"
                                        />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-[9px] font-mono text-system-text/60 group-hover:text-white transition-colors flex items-center gap-2 uppercase">
                                            <XCircle size={10} /> Auto-Failure Detect
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={gameState.settings.autoFailureDetection}
                                            onChange={(e) => updateSettings({ autoFailureDetection: e.target.checked })}
                                            className="accent-system-blue"
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">

                                <button
                                    onClick={() => setIsGuideOpen(true)}
                                    className="w-full py-3 border border-system-blue/30 hover:border-system-blue bg-system-blue/5 text-system-blue/60 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 group"
                                >
                                    <BookOpen size={14} />
                                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">System Guide</span>
                                </button>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setSummaryType('WEEKLY')}
                                        className="bg-system-dark/50 border border-system-border p-2 rounded-sm hover:border-system-gold/50 transition-colors flex flex-col items-start gap-1"
                                    >
                                        <BarChart3 size={12} className="text-system-gold opacity-50" />
                                        <div className="text-[9px] font-bold text-white font-mono uppercase">Weekly</div>
                                    </button>
                                    <button
                                        onClick={() => setSummaryType('MONTHLY')}
                                        className="bg-system-dark/50 border border-system-border p-2 rounded-sm hover:border-system-blue/50 transition-colors flex flex-col items-start gap-1"
                                    >
                                        <CalendarIcon size={12} className="text-system-blue opacity-50" />
                                        <div className="text-[9px] font-bold text-white font-mono uppercase">Monthly</div>
                                    </button>
                                </div>

                                <div className="bg-system-dark/30 border border-system-border/30 p-2 rounded-sm flex justify-between items-center">
                                    <div className="text-[9px] text-system-text/40 font-mono uppercase">Streak</div>
                                    <div className="text-sm font-bold text-system-gold">{gameState.player.streak}D 🔥</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <QuestCreationModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setPreSelectedGoalId(undefined);
                }}
                onCreateQuest={gatedAddQuest}
                goals={gameState.goals}
                initialGoalId={preSelectedGoalId}
            />

            <StageOverview
                isOpen={isStageOverviewOpen}
                onClose={() => setIsStageOverviewOpen(false)}
                player={gameState.player}
                onAdvance={advanceStage}
            />

            <SystemGuide
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />

            <MetaSummaries
                isOpen={!!summaryType}
                onClose={() => setSummaryType(null)}
                gameState={gameState}
                type={summaryType || 'WEEKLY'}
            />
        </Layout>
    );
};
