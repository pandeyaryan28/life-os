import React, { useState } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import { Layout } from './Layout';
import { StatusWindow } from './StatusWindow';
import { QuestLog } from './QuestLog';
import { SystemOverlay } from './SystemOverlay';
import { QuestCreationModal } from './QuestCreationModal';
import { StageOverview } from './StageOverview';
import { FocusModeOverlay } from './FocusModeOverlay';
import { MetaSummaries } from './MetaSummaries';
import { ExpensesPanel } from './ExpensesPanel';
import { ManualAdjustmentPanel } from './ManualAdjustmentPanel';
import { GoalsPanel } from './GoalsPanel';
import { MigrationModal } from './MigrationModal';
import { Zap, Terminal, Settings as SettingsIcon, BarChart3, RefreshCw, XCircle, Calendar as CalendarIcon, Cloud } from 'lucide-react';

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
        toggleFocusMode,
        advanceStage,
        updateSettings,
        addExpense,
        applyManualAdjustment,
        addGoal,
        linkQuestToGoal,
        unlinkQuestFromGoal,
        deleteQuest,
        deleteGoal
    } = useGameEngine();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [preSelectedGoalId, setPreSelectedGoalId] = useState<string | undefined>(undefined);
    const [isStageOverviewOpen, setIsStageOverviewOpen] = useState(false);
    const [summaryType, setSummaryType] = useState<'WEEKLY' | 'MONTHLY' | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <Layout>
            <SystemOverlay notifications={notifications} />

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

            <FocusModeOverlay
                isActive={gameState.player.focusMode.isActive}
                onExit={toggleFocusMode}
                durationSeconds={gameState.player.focusMode.dailyTotalSeconds}
            />

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
                            onApplyAdjustment={applyManualAdjustment}
                        />
                    </div>
                </div>

                {/* Column 2: Execution Engine (Goals & Quests) */}
                <div className="xl:col-span-6 space-y-4 flex flex-col">
                    <div className="h-[40%] min-h-[300px]">
                        <GoalsPanel
                            goals={gameState.goals}
                            quests={gameState.quests}
                            onAddGoal={addGoal}
                            onLinkQuest={linkQuestToGoal}
                            onUnlinkQuest={unlinkQuestFromGoal}
                            onDeleteGoal={deleteGoal}
                            onDeleteQuest={deleteQuest}
                            onTriggerNewQuest={(goalId) => {
                                setPreSelectedGoalId(goalId);
                                setIsCreateModalOpen(true);
                            }}
                        />
                    </div>
                    <div className="h-[60%] min-h-[400px]">
                        <QuestLog
                            quests={gameState.quests}
                            onComplete={completeQuest}
                            onFail={failQuest}
                            onDelete={deleteQuest}
                            onCreateQuest={() => setIsCreateModalOpen(true)}
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
                            onAddExpense={addExpense}
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
                                    onClick={toggleFocusMode}
                                    className={`w-full py-3 border flex items-center justify-center gap-3 transition-all active:scale-95 group relative overflow-hidden
                                        ${gameState.player.focusMode.isActive
                                            ? 'border-system-blue bg-system-blue/10 text-system-blue shadow-[0_0_15px_rgba(0,170,255,0.2)]'
                                            : 'border-system-border hover:border-system-blue/50 text-system-text/60 hover:text-white'}`}
                                >
                                    <Zap size={14} className={gameState.player.focusMode.isActive ? 'animate-pulse' : 'opacity-40 group-hover:opacity-100'} />
                                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em]">Focus Mode</span>
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
                onSubmit={addQuest}
                availableGoals={gameState.goals}
                initialGoalId={preSelectedGoalId}
            />

            <StageOverview
                isOpen={isStageOverviewOpen}
                onClose={() => setIsStageOverviewOpen(false)}
                player={gameState.player}
                onAdvance={advanceStage}
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

