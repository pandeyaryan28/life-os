import React, { useState } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useSubscription } from '../../context/SubscriptionContext';
import { QuestLog } from '../QuestLog';
import { QuestCreationModal } from '../QuestCreationModal';
import { SystemOverlay } from '../SystemOverlay';
import { SubscribeModal } from '../SubscribeModal';
import { SyncOverlay } from '../shared/SyncOverlay';

export const QuestsPage: React.FC = () => {
    const {
        gameState,
        notifications,
        isSyncing,
        addQuest,
        completeQuest,
        failQuest,
        deleteQuest
    } = useGameEngine();

    const { requireSubscription, showSubscribeModal, subscribeModalFeature, closeSubscribeModal } = useSubscription();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const gatedAddQuest = (questData: Parameters<typeof addQuest>[0]) => {
        if (requireSubscription('Create Quest')) addQuest(questData);
    };
    const gatedCompleteQuest = (questId: string) => {
        if (requireSubscription('Complete Quest')) completeQuest(questId);
    };
    const gatedFailQuest = (questId: string) => {
        if (requireSubscription('Fail Quest')) failQuest(questId);
    };

    return (
        <>
            <SystemOverlay notifications={notifications} />
            <SubscribeModal isOpen={showSubscribeModal} onClose={closeSubscribeModal} featureName={subscribeModalFeature} />
            <SyncOverlay isSyncing={isSyncing} />

            <div className="min-h-[400px]">
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

            <QuestCreationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateQuest={gatedAddQuest}
                goals={gameState.goals}
            />
        </>
    );
};
