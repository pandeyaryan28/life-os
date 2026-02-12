import React from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useSubscription } from '../../context/SubscriptionContext';
import { ExpensesPanel } from '../ExpensesPanel';
import { ManualAdjustmentPanel } from '../ManualAdjustmentPanel';
import { SystemOverlay } from '../SystemOverlay';
import { SubscribeModal } from '../SubscribeModal';
import { SyncOverlay } from '../shared/SyncOverlay';

export const EconomyPage: React.FC = () => {
    const {
        gameState,
        notifications,
        isSyncing,
        addExpense,
        applyManualAdjustment,
        payExpense
    } = useGameEngine();

    const { requireSubscription, showSubscribeModal, subscribeModalFeature, closeSubscribeModal } = useSubscription();

    const gatedAddExpense = (expenseData: Parameters<typeof addExpense>[0]) => {
        if (requireSubscription('Add Expense')) addExpense(expenseData);
    };
    const gatedApplyAdjustment = (adj: Parameters<typeof applyManualAdjustment>[0]) => {
        if (requireSubscription('Apply Adjustment')) applyManualAdjustment(adj);
    };
    const gatedPayExpense = (expenseId: string) => {
        if (requireSubscription('Pay Expense')) payExpense(expenseId);
    };

    return (
        <>
            <SystemOverlay notifications={notifications} />
            <SubscribeModal isOpen={showSubscribeModal} onClose={closeSubscribeModal} featureName={subscribeModalFeature} />
            <SyncOverlay isSyncing={isSyncing} />

            <div className="space-y-3">
                <div className="min-h-[350px]">
                    <ExpensesPanel
                        credits={gameState.player.credits}
                        expenseHistory={gameState.expenseHistory}
                        recurringExpenses={gameState.expenses}
                        onAddExpense={gatedAddExpense}
                        onPayExpense={gatedPayExpense}
                    />
                </div>
                <div className="min-h-[200px]">
                    <ManualAdjustmentPanel
                        history={gameState.manualAdjustments}
                        onApplyAdjustment={gatedApplyAdjustment}
                    />
                </div>
            </div>
        </>
    );
};
