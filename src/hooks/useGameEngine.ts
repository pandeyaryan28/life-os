import { useState, useEffect, useCallback } from 'react';
import type { GameState, Stats, Quest, Notification, Expense, Goal, ManualAdjustment, PlayerProfile, LogEntry } from '../types';
import { INITIAL_STATE } from '../data/initialState';
import { STAGES } from '../data/stages';
import { useAuth } from '../context/AuthContext';
import * as dbService from '../firebase/db';

const OLD_STORAGE_KEY = 'life-os-save-v1.3.1';

export const useGameEngine = () => {
    const { user } = useAuth();
    const [gameState, setGameState] = useState<GameState>({ ...INITIAL_STATE, version: '1.5.1' });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isMigrationPending, setIsMigrationPending] = useState(false);
    const [isSyncing, setIsSyncing] = useState(true);

    // Sync safety timeout
    useEffect(() => {
        if (!isSyncing) return;
        const timer = setTimeout(() => {
            console.log('Sync timeout reached, forcing entry...');
            setIsSyncing(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, [isSyncing]);

    // Load local storage if exists for migration check
    useEffect(() => {
        if (!user) return;

        const checkMigration = async () => {
            const hasLocalData = localStorage.getItem(OLD_STORAGE_KEY) ||
                localStorage.getItem('life-os-save-v1.3') ||
                localStorage.getItem('life-os-save-v1.2');

            if (hasLocalData) {
                setIsMigrationPending(true);
            }
        };

        checkMigration();
    }, [user]);

    // Firestore Integration
    useEffect(() => {
        if (!user) return;

        // Initialize user profile if new
        dbService.initializeUserProfile(user.uid, INITIAL_STATE.player);

        // Sync Profile
        const unsubProfile = dbService.syncDocument<PlayerProfile>(user.uid, "profile", "data", (profile) => {
            if (profile) {
                setGameState(prev => ({ ...prev, player: { ...prev.player, ...profile } }));
            }
            setIsSyncing(false);
        });

        // Sync Stats
        const unsubStats = dbService.syncDocument<Stats>(user.uid, "stats", "current", (stats) => {
            if (stats) {
                setGameState(prev => ({ ...prev, player: { ...prev.player, stats } }));
            }
        });

        // Sync Quests
        const unsubQuests = dbService.syncCollection<Quest>(user.uid, "quests", (quests) => {
            setGameState(prev => ({ ...prev, quests }));
        });

        // Sync Goals
        const unsubGoals = dbService.syncCollection<Goal>(user.uid, "goals", (goals) => {
            setGameState(prev => ({ ...prev, goals }));
        });

        // Sync Expenses
        const unsubExpenses = dbService.syncCollection<Expense>(user.uid, "economy", (expenses) => {
            setGameState(prev => ({ ...prev, expenses }));
        });

        // Sync Ledger
        const unsubLedger = dbService.syncCollection<Expense>(user.uid, "ledger", (expenseHistory) => {
            setGameState(prev => ({ ...prev, expenseHistory }));
        });

        // Sync Settings
        const unsubSettings = dbService.syncDocument<GameState['settings']>(user.uid, "system", "settings", (settings) => {
            if (settings) {
                setGameState(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }));
            }
        });

        // Sync Adjustments (Penalties)
        const unsubAdjustments = dbService.syncCollection<ManualAdjustment>(user.uid, "adjustments", (manualAdjustments) => {
            setGameState(prev => ({ ...prev, manualAdjustments }));
        });

        return () => {
            unsubProfile();
            unsubStats();
            unsubQuests();
            unsubGoals();
            unsubExpenses();
            unsubExpenses();
            unsubLedger();
            unsubSettings();
            unsubAdjustments();
        };
    }, [user]);

    const performMigration = async () => {
        if (!user) return;

        const localData = localStorage.getItem(OLD_STORAGE_KEY) ||
            localStorage.getItem('life-os-save-v1.3') ||
            localStorage.getItem('life-os-save-v1.2');

        if (localData) {
            const parsed = JSON.parse(localData);
            const legacyState: GameState = {
                ...INITIAL_STATE,
                ...parsed,
                player: {
                    ...INITIAL_STATE.player,
                    ...parsed.player,
                    credits: parsed.player.credits || parsed.player.coins || 0
                }
            };

            await dbService.migrateLocalStorageToFirestore(user.uid, legacyState);

            // Clear all legacy storage
            localStorage.removeItem(OLD_STORAGE_KEY);
            localStorage.removeItem('life-os-save-v1.3');
            localStorage.removeItem('life-os-save-v1.2');
            localStorage.removeItem('life-os-save-v1.1');

            setIsMigrationPending(false);
            addNotification('MIGRATION COMPLETE: System data synchronized to cloud.', 'SUCCESS');
        }
    };

    const cancelMigration = () => {
        localStorage.removeItem(OLD_STORAGE_KEY);
        localStorage.removeItem('life-os-save-v1.3');
        localStorage.removeItem('life-os-save-v1.2');
        setIsMigrationPending(false);
        addNotification('Migration bypassed. Local data cleared.', 'WARNING');
    };

    // Delete Old Persistence Effect

    // System Time Engine (Daily Resets & Recurring Expenses)
    useEffect(() => {
        if (!user || isSyncing) return;

        const checkSystemResets = async () => {
            const now = new Date();
            const lastLoginDate = new Date(gameState.player.lastLogin);

            // Local day comparison
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const lastLoginDay = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate()).getTime();

            if (today > lastLoginDay) {
                // New day detected
                const batchUpdates: Promise<any>[] = [];
                let anyDailyMissed = false;

                // Reset Daily Quests
                gameState.quests.forEach(q => {
                    if (q.type === 'DAILY') {
                        if (q.status === 'ACTIVE') {
                            anyDailyMissed = true;
                        }

                        const wasCompleted = q.status === 'COMPLETED';
                        const newStreak = wasCompleted ? (q.streak || 0) : 0;

                        batchUpdates.push(dbService.upsertDocument(user.uid, "quests", {
                            ...q,
                            status: 'ACTIVE',
                            streak: newStreak,
                            lastCompletedAt: wasCompleted ? q.lastCompletedAt : (q.lastCompletedAt || gameState.player.lastLogin)
                        }));
                    }
                });

                // Update Profile Last Login and Streak
                const { stats: _, ...pLat } = gameState.player;
                const newPlayerStreak = anyDailyMissed ? 0 : gameState.player.streak;

                batchUpdates.push(dbService.upsertDocument(user.uid, "profile", {
                    ...pLat,
                    id: 'data',
                    lastLogin: now.toISOString(),
                    streak: newPlayerStreak
                }));

                await Promise.all(batchUpdates);

                if (anyDailyMissed) {
                    addLog('System Calibration: Streak reset due to missed objectives.', 'WARNING');
                }
                addLog('Neural Synchronization: Daily cycles recalibrated.', 'SYSTEM');
                addNotification('NEW CYCLE DETECTED', 'INFO');
            }

            // Recurring Expenses Logic
            processRecurringExpenses();
        };

        const processRecurringExpenses = async () => {
            const now = new Date();
            const batchUpdates: Promise<any>[] = [];

            for (const exp of gameState.expenses) {
                if (exp.type === 'RECURRING' && exp.frequency) {
                    const lastProcessed = exp.lastProcessed ? new Date(exp.lastProcessed) : new Date(exp.timestamp);
                    let shouldProcess = false;

                    if (exp.frequency === 'DAILY') {
                        shouldProcess = now.getTime() - lastProcessed.getTime() >= 24 * 60 * 60 * 1000;
                    } else if (exp.frequency === 'WEEKLY') {
                        shouldProcess = now.getTime() - lastProcessed.getTime() >= 7 * 24 * 60 * 60 * 1000;
                    } else if (exp.frequency === 'MONTHLY') {
                        shouldProcess = now.getUTCMonth() !== lastProcessed.getUTCMonth() || now.getUTCFullYear() !== lastProcessed.getUTCFullYear();
                    }

                    if (shouldProcess && !exp.pendingPayment) {
                        // Only mark as pending. Do NOT deduct automatically.
                        batchUpdates.push(dbService.upsertDocument(user.uid, "economy", { ...exp, pendingPayment: true }));
                        addNotification(`BILL DUE: ${exp.name}`, 'WARNING');
                    }
                }
            }

            if (batchUpdates.length > 0) {
                await Promise.all(batchUpdates);
            }
        };

        const timer = setInterval(checkSystemResets, 60000);
        checkSystemResets();
        return () => clearInterval(timer);
    }, [user, isSyncing, gameState.player, gameState.quests, gameState.expenses]);



    const addNotification = useCallback((message: string, type: Notification['type'] = 'INFO') => {
        const id = Date.now().toString() + Math.random();
        const newNotification: Notification = { id, message, type };
        setNotifications(prev => [...prev, newNotification]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }, []);

    const addLog = useCallback(async (message: string, type: LogEntry['type'] = 'INFO') => {
        if (!user) return;
        const newLog: LogEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            message,
            type,
        };
        await dbService.upsertDocument(user.uid, "ledger", newLog);
    }, [user]);

    const updateSettings = useCallback(async (newSettings: Partial<GameState['settings']>) => {
        if (!user) return;
        await dbService.upsertDocument(user.uid, "system", {
            id: 'settings',
            ...gameState.settings,
            ...newSettings
        });
        addNotification('System settings updated.', 'INFO');
    }, [user, gameState.settings, addNotification]);

    const updateProfile = useCallback(async (profileData: Partial<PlayerProfile>) => {
        if (!user) return;
        const { stats: _, ...currentLockedProfile } = gameState.player;
        await dbService.upsertDocument(user.uid, "profile", {
            ...currentLockedProfile,
            ...profileData,
            id: 'data',
        });
        addNotification('Profile identifier updated.', 'SUCCESS');
    }, [user, gameState.player, addNotification]);



    const advanceStage = useCallback(async (stageId: string) => {
        if (!user) return;
        const stage = STAGES.find(s => s.id === stageId);
        if (!stage) return;

        const { stats: _, ...pData } = gameState.player;
        await dbService.upsertDocument(user.uid, "profile", {
            ...pData,
            id: 'data',
            stageId,
            stageStartedAt: new Date().toISOString()
        });
        addNotification(`STAGE EVOLUTION: ${stage.name}`, 'SUCCESS');
        addLog(`Player Stage updated to: ${stage.name}`, 'SUCCESS');
    }, [user, gameState.player, addNotification, addLog]);

    const addQuest = useCallback(async (questData: Omit<Quest, 'id' | 'status'>) => {
        if (!user) return;
        const newQuest: Quest = {
            ...questData,
            id: Date.now().toString(),
            status: 'ACTIVE',
        };

        await dbService.upsertDocument(user.uid, "quests", newQuest);

        if (newQuest.goalId) {
            const goal = gameState.goals.find(g => g.id === newQuest.goalId);
            if (goal) {
                await dbService.upsertDocument(user.uid, "goals", {
                    ...goal,
                    questIds: [...goal.questIds, newQuest.id]
                });
            }
        }

        addNotification(`QUEST CREATED: ${newQuest.title}`, 'INFO');
        addLog(`Quest Created: ${newQuest.title}`, 'INFO');
    }, [user, gameState.goals, addNotification, addLog]);



    const updateStats = useCallback(async (statsDelta: Partial<Stats>) => {
        if (!user) return;
        const newStats = { ...gameState.player.stats };
        (Object.entries(statsDelta) as [keyof Stats, number][]).forEach(([key, value]) => {
            if (value) {
                newStats[key] = (newStats[key] || 0) + value;
            }
        });
        const { stats: _, ...profileData } = gameState.player;
        await dbService.upsertDocument(user.uid, "profile", {
            ...profileData,
            id: 'data',
        });
        await dbService.upsertDocument(user.uid, "stats", { id: 'current', ...newStats });
    }, [user, gameState.player]);

    const gainXp = useCallback(async (amount: number) => {
        if (!user) return;
        let { xp, level, maxXp } = gameState.player;
        xp += amount;
        let leveledUp = false;

        while (xp >= maxXp) {
            xp -= maxXp;
            level++;
            maxXp = Math.floor(maxXp * 1.5);
            leveledUp = true;
        }

        const { stats: _, ...pData } = gameState.player;
        await dbService.upsertDocument(user.uid, "profile", {
            ...pData,
            id: 'data',
            xp,
            level,
            maxXp
        });

        if (amount > 0) {
            addNotification(`XP GAINED: +${amount}`, 'SUCCESS');
            addLog(`Gained ${amount} XP`, 'SUCCESS');
        }

        if (leveledUp) {
            addNotification(`LEVEL UP: REACHED LEVEL ${level}`, 'SUCCESS');
            addLog(`LEVEL UP! You are now Level ${level}`, 'SUCCESS');
        }
    }, [user, gameState.player, addNotification, addLog]);

    const completeQuest = useCallback(async (questId: string) => {
        if (!user) return;
        const quest = gameState.quests.find(q => q.id === questId);
        if (!quest || quest.status !== 'ACTIVE') return;

        const isDaily = quest.type === 'DAILY';
        const updatedQuest: Quest = {
            ...quest,
            status: 'COMPLETED',
            streak: isDaily ? (quest.streak || 0) + 1 : quest.streak,
            lastCompletedAt: new Date().toISOString(),
            completedCount: (quest.completedCount || 0) + 1
        };

        const { credits, stats } = quest.rewards;
        const newStats = { ...gameState.player.stats };
        if (stats) {
            (Object.entries(stats) as [keyof Stats, number][]).forEach(([key, value]) => {
                if (value) newStats[key] = (newStats[key] || 0) + value;
            });
        }

        const creditReward = credits || 0;
        const oldCredits = gameState.player.credits;
        const newCredits = oldCredits + creditReward;

        console.log('🎯 Quest Completion Credit Debug:', {
            questTitle: quest.title,
            oldCredits,
            creditReward,
            newCredits,
            playerData: gameState.player
        });

        // Streak logic for player
        let newPlayerStreak = gameState.player.streak;
        if (isDaily) {
            const now = new Date();
            const lastCompleted = quest.lastCompletedAt ? new Date(quest.lastCompletedAt) : null;
            const isFirstCompletionToday = !lastCompleted ||
                (now.getFullYear() !== lastCompleted.getFullYear() ||
                    now.getMonth() !== lastCompleted.getMonth() ||
                    now.getDate() !== lastCompleted.getDate());

            if (isFirstCompletionToday) {
                newPlayerStreak += 1;
            }
        }

        // Update Quest
        await dbService.upsertDocument(user.uid, "quests", updatedQuest);

        // Update Profile & Stats
        const { stats: _, ...profileData } = gameState.player;
        await dbService.upsertDocument(user.uid, "profile", {
            ...profileData,
            id: 'data',
            credits: newCredits,
            streak: newPlayerStreak
        });
        await dbService.upsertDocument(user.uid, "stats", { id: 'current', ...newStats });

        console.log('✅ Credits saved to Firestore:', newCredits);

        gainXp(quest.rewards.xp);

        // Enhanced notification with credit info
        if (creditReward > 0) {
            addNotification(`QUEST COMPLETED: ${quest.title} | +${creditReward} Credits`, 'SUCCESS');
            addLog(`Quest Completed: ${quest.title} | Earned ${creditReward} Credits`, 'SUCCESS');
        } else {
            addNotification(`QUEST COMPLETED: ${quest.title}`, 'SUCCESS');
            addLog(`Quest Completed: ${quest.title}`, 'SUCCESS');
        }
    }, [user, gameState.quests, gameState.player, gainXp, addNotification, addLog]);

    const failQuest = useCallback(async (questId: string) => {
        if (!user) return;
        const quest = gameState.quests.find(q => q.id === questId);
        if (!quest) return;

        const updatedQuest: Quest = { ...quest, status: 'FAILED' };
        const newStats = { ...gameState.player.stats };
        if (quest.penalty?.stats) {
            (Object.entries(quest.penalty.stats) as [keyof Stats, number][]).forEach(([key, value]) => {
                if (value) newStats[key] = Math.max(0, (newStats[key] || 0) - value);
            });
        }

        const creditPenalty = quest.penalty?.credits || 0;
        const newCredits = Math.max(0, gameState.player.credits - creditPenalty);

        const { stats: _, ...profileData } = gameState.player;
        await dbService.upsertDocument(user.uid, "quests", updatedQuest);
        await dbService.upsertDocument(user.uid, "profile", {
            ...profileData,
            id: 'data',
            credits: newCredits
        });
        await dbService.upsertDocument(user.uid, "stats", { id: 'current', ...newStats });

        // Enhanced notification with penalty info
        if (creditPenalty > 0) {
            addNotification(`QUEST FAILED: ${quest.title} | -${creditPenalty} Credits`, 'FAILURE');
            addLog(`Quest Failed: ${quest.title} | Lost ${creditPenalty} Credits`, 'ERROR');
        } else {
            addNotification(`QUEST FAILED: ${quest.title}`, 'FAILURE');
            addLog(`Quest Failed: ${quest.title}`, 'ERROR');
        }
    }, [user, gameState.quests, gameState.player, addNotification, addLog]);

    // v1.3 Economy Module
    const addExpense = useCallback(async (expenseData: Omit<Expense, 'id' | 'timestamp'>) => {
        if (!user) return;
        const id = Date.now().toString();
        const timestamp = new Date().toISOString();
        const newExpense: Expense = { ...expenseData, id, timestamp };

        // Only deduct credits for ONE_TIME expenses
        // RECURRING expenses are paid manually via payExpense
        if (newExpense.type === 'ONE_TIME') {
            const newCredits = gameState.player.credits - newExpense.amount;

            // Update Profile
            const { stats: _, ...pData } = gameState.player;
            await dbService.upsertDocument(user.uid, "profile", {
                ...pData,
                id: 'data',
                credits: newCredits
            });

            // Add to Ledger (transaction history)
            await dbService.upsertDocument(user.uid, "ledger", newExpense);

            addLog(`Expense Logged: ${newExpense.name} (-${newExpense.amount} Credits)`, 'WARNING');
            addNotification(`EXPENSE LOGGED: -${newExpense.amount} Credits`, 'INFO');
        } else if (newExpense.type === 'RECURRING') {
            // Add to Economy list only (no credit deduction)
            await dbService.upsertDocument(user.uid, "economy", newExpense);
            addLog(`Recurring Expense Added: ${newExpense.name} (${newExpense.frequency})`, 'INFO');
            addNotification(`RECURRING EXPENSE ADDED: ${newExpense.name}`, 'INFO');
        }
    }, [user, gameState.player, addLog, addNotification]);

    const payExpense = useCallback(async (expenseId: string) => {
        if (!user) return;
        const expense = gameState.expenses.find(e => e.id === expenseId);
        if (!expense || !expense.pendingPayment) return;

        const newCredits = gameState.player.credits - expense.amount;
        const now = new Date();

        // Update Profile
        const { stats: _, ...pData } = gameState.player;
        await dbService.upsertDocument(user.uid, "profile", { ...pData, id: 'data', credits: newCredits });

        // Update Expense (clear pending, set lastProcessed)
        await dbService.upsertDocument(user.uid, "economy", {
            ...expense,
            pendingPayment: false,
            lastProcessed: now.toISOString()
        });

        // Add to Ledger
        await dbService.upsertDocument(user.uid, "ledger", {
            ...expense,
            id: `${expense.id}-${now.getTime()}`,
            timestamp: now.toISOString(),
            pendingPayment: false
        });

        addNotification(`Bill Paid: ${expense.name} (-${expense.amount} C)`, 'SUCCESS');
        addLog(`Paid Bill: ${expense.name}`, 'WARNING');
    }, [user, gameState.player, gameState.expenses, addNotification, addLog]);

    // v1.3 Manual Adjustment
    const applyManualAdjustment = useCallback(async (adj: Omit<ManualAdjustment, 'id' | 'timestamp'>) => {
        if (!user) return;
        const id = Date.now().toString();
        const timestamp = new Date().toISOString();
        const newAdj: ManualAdjustment = { ...adj, id, timestamp };

        let newPlayer = { ...gameState.player };
        if (adj.type === 'XP') {
            newPlayer.xp = Math.max(0, newPlayer.xp + (adj.value as number));
        } else if (adj.type === 'CREDITS') {
            newPlayer.credits = Math.max(0, newPlayer.credits + (adj.value as number));
        } else if (adj.type === 'STATS') {
            const statsDelta = adj.value as Partial<Stats>;
            Object.entries(statsDelta).forEach(([key, val]) => {
                const k = key as keyof Stats;
                newPlayer.stats[k] = Math.max(0, newPlayer.stats[k] + (val || 0));
            });
        }

        const { stats: _, ...pData } = newPlayer;
        await dbService.upsertDocument(user.uid, "profile", pData);
        await dbService.upsertDocument(user.uid, "stats", { id: 'current', ...newPlayer.stats });
        await dbService.upsertDocument(user.uid, "adjustments", newAdj);

        addLog(`Manual Adjustment (${adj.type}): ${adj.reason}`, 'WARNING');
        addNotification(`ADJUSTMENT APPLIED: ${adj.type}`, 'WARNING');
    }, [user, gameState.player, addLog, addNotification]);

    const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'questIds' | 'status'>) => {
        if (!user) return;
        const newGoal: Goal = {
            ...goalData,
            id: Date.now().toString(),
            status: 'NOT_STARTED',
            questIds: []
        };
        await dbService.upsertDocument(user.uid, "goals", newGoal);
        addNotification(`GOAL CREATED: ${newGoal.name}`, 'SUCCESS');
    }, [user, addNotification]);

    // v1.3.1 Goals-Quest Linking
    const linkQuestToGoal = useCallback(async (questId: string, goalId: string) => {
        if (!user) return;
        const quest = gameState.quests.find(q => q.id === questId);
        const goal = gameState.goals.find(g => g.id === goalId);

        if (quest && goal) {
            await dbService.upsertDocument(user.uid, "quests", { ...quest, goalId });
            if (!goal.questIds.includes(questId)) {
                await dbService.upsertDocument(user.uid, "goals", { ...goal, questIds: [...goal.questIds, questId] });
            }

            // Unlink from other goals
            for (const otherGoal of gameState.goals) {
                if (otherGoal.id !== goalId && otherGoal.questIds.includes(questId)) {
                    await dbService.upsertDocument(user.uid, "goals", {
                        ...otherGoal,
                        questIds: otherGoal.questIds.filter(id => id !== questId)
                    });
                }
            }
        }
        addNotification('Quest linked to Goal', 'SUCCESS');
    }, [user, gameState.quests, gameState.goals, addNotification]);

    const unlinkQuestFromGoal = useCallback(async (questId: string) => {
        if (!user) return;
        const quest = gameState.quests.find(q => q.id === questId);
        if (quest) {
            const { goalId, ...rest } = quest;
            await dbService.upsertDocument(user.uid, "quests", rest as Quest);

            for (const goal of gameState.goals) {
                if (goal.questIds.includes(questId)) {
                    await dbService.upsertDocument(user.uid, "goals", {
                        ...goal,
                        questIds: goal.questIds.filter(id => id !== questId)
                    });
                }
            }
        }
        addNotification('Quest unlinked from Goal', 'INFO');
    }, [user, gameState.quests, gameState.goals, addNotification]);

    const deleteQuest = useCallback(async (questId: string) => {
        if (!user) return;
        await dbService.deleteDocument(user.uid, "quests", questId);
        for (const goal of gameState.goals) {
            if (goal.questIds.includes(questId)) {
                await dbService.upsertDocument(user.uid, "goals", {
                    ...goal,
                    questIds: goal.questIds.filter(id => id !== questId)
                });
            }
        }
        addNotification('Quest deleted from system', 'WARNING');
    }, [user, gameState.goals, addNotification]);

    const deleteGoal = useCallback(async (goalId: string) => {
        if (!user) return;
        await dbService.deleteDocument(user.uid, "goals", goalId);
        for (const quest of gameState.quests) {
            if (quest.goalId === goalId) {
                const { goalId: _, ...rest } = quest;
                await dbService.upsertDocument(user.uid, "quests", rest as Quest);
            }
        }
        addNotification('Macro Objective terminated', 'WARNING');
    }, [user, gameState.quests, addNotification]);

    return {
        gameState,
        notifications,
        isMigrationPending,
        isSyncing,
        performMigration,
        cancelMigration,
        addLog,
        addQuest,
        gainXp,
        updateStats,
        completeQuest,
        failQuest,
        addNotification,
        advanceStage,
        updateSettings,
        updateProfile,
        addExpense,
        applyManualAdjustment,
        addGoal,
        linkQuestToGoal,
        unlinkQuestFromGoal,
        deleteQuest,
        deleteGoal,
        payExpense
    };
};

