import React, { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useSubscription } from '../../context/SubscriptionContext';
import { GoalsPanel } from '../GoalsPanel';
import { QuestCreationModal } from '../QuestCreationModal';
import { SystemOverlay } from '../SystemOverlay';
import { SubscribeModal } from '../SubscribeModal';
import { SyncOverlay } from '../shared/SyncOverlay';

export const GoalsPage: React.FC = () => {
    const {
        gameState,
        notifications,
        isSyncing,
        addQuest,
        addGoal,
        linkQuestToGoal,
        unlinkQuestFromGoal,
        deleteQuest,
        deleteGoal
    } = useGameEngine();

    const { requireSubscription, showSubscribeModal, subscribeModalFeature, closeSubscribeModal } = useSubscription();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [preSelectedGoalId, setPreSelectedGoalId] = useState<string | undefined>(undefined);

    const gatedAddQuest = (questData: Parameters<typeof addQuest>[0]) => {
        if (requireSubscription('Create Quest')) addQuest(questData);
    };
    const gatedAddGoal = (goalData: Parameters<typeof addGoal>[0]) => {
        if (requireSubscription('Create Goal')) addGoal(goalData);
    };

    return (
        <>
            <SystemOverlay notifications={notifications} />
            <SubscribeModal isOpen={showSubscribeModal} onClose={closeSubscribeModal} featureName={subscribeModalFeature} />
            <SyncOverlay isSyncing={isSyncing} />

            <div className="min-h-[400px]">
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

            <QuestCreationModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setPreSelectedGoalId(undefined); }}
                onCreateQuest={gatedAddQuest}
                goals={gameState.goals}
                initialGoalId={preSelectedGoalId}
            />
        </>
    );
};
