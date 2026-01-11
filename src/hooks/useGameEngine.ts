import { useState, useEffect, useCallback } from 'react';
import type { GameState, LogEntry, Stats, Quest, Notification, Expense, Goal, ManualAdjustment } from '../types';
import { INITIAL_STATE } from '../data/initialState';
import { STAGES } from '../data/stages';

const STORAGE_KEY = 'life-os-save-v1.3.1';

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            const v13Saved = localStorage.getItem('life-os-save-v1.3');
            if (v13Saved) {
                const parsed = JSON.parse(v13Saved);
                return {
                    ...parsed,
                    version: '1.3.1'
                };
            }
            const v12Saved = localStorage.getItem('life-os-save-v1.2');
            if (v12Saved) {
                const parsed = JSON.parse(v12Saved);
                return {
                    ...INITIAL_STATE,
                    ...parsed,
                    version: '1.3.1',
                    player: {
                        ...INITIAL_STATE.player,
                        ...parsed.player,
                        credits: parsed.player.coins || 0
                    },
                    goals: parsed.goals || [],
                    expenses: parsed.expenses || [],
                    expenseHistory: parsed.expenseHistory || [],
                    manualAdjustments: parsed.manualAdjustments || [],
                    settings: { ...INITIAL_STATE.settings, ...(parsed.settings || {}) }
                };
            }
            return INITIAL_STATE;
        }
        return JSON.parse(saved);
    });

    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Persistence
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    // System Time Engine (Daily Resets & Recurring Expenses)
    useEffect(() => {
        const checkSystemResets = () => {
            const now = new Date();
            const lastLogin = new Date(gameState.player.lastLogin);

            // Check if day has changed
            if (now.toDateString() !== lastLogin.toDateString()) {
                setGameState(prev => {
                    const updatedQuests = prev.quests.map(q => {
                        if (q.type === 'DAILY') {
                            // If quest was NOT completed today, break streak (unless penalties disabled)
                            const wasCompleted = q.status === 'COMPLETED';
                            const newStreak = wasCompleted ? (q.streak || 0) : 0;

                            // Reset DAILY status
                            return {
                                ...q,
                                status: 'ACTIVE' as const,
                                streak: newStreak,
                                lastCompletedAt: wasCompleted ? q.lastCompletedAt : prev.player.lastLogin
                            };
                        }
                        return q;
                    });

                    // Update Last Login
                    return {
                        ...prev,
                        quests: updatedQuests,
                        player: {
                            ...prev.player,
                            lastLogin: now.toISOString()
                        }
                    };
                });

                addLog('New day detected. Daily quests reset.', 'SYSTEM');
                addNotification('NEW DAY DETECTED: Daily Quests Reset', 'INFO');
            }

            // Recurring Expenses Logic
            processRecurringExpenses();
        };

        const processRecurringExpenses = () => {
            const now = new Date();
            setGameState(prev => {
                let currentCredits = prev.player.credits;
                const newHistory = [...prev.expenseHistory];
                const updatedExpenses = prev.expenses.map(exp => {
                    if (exp.type === 'RECURRING' && exp.frequency) {
                        const lastProcessed = exp.lastProcessed ? new Date(exp.lastProcessed) : new Date(exp.timestamp);
                        let shouldProcess = false;

                        if (exp.frequency === 'DAILY') {
                            shouldProcess = now.getTime() - lastProcessed.getTime() >= 24 * 60 * 60 * 1000;
                        } else if (exp.frequency === 'WEEKLY') {
                            shouldProcess = now.getTime() - lastProcessed.getTime() >= 7 * 24 * 60 * 60 * 1000;
                        } else if (exp.frequency === 'MONTHLY') {
                            shouldProcess = now.getMonth() !== lastProcessed.getMonth() || now.getFullYear() !== lastProcessed.getFullYear();
                        }

                        if (shouldProcess) {
                            currentCredits -= exp.amount;
                            const historyEntry: Expense = { ...exp, id: `${exp.id}-${now.getTime()}`, timestamp: now.toISOString() };
                            newHistory.unshift(historyEntry);
                            addLog(`Recurring expense deducted: ${exp.name} (-${exp.amount} Credits)`, 'WARNING');
                            return { ...exp, lastProcessed: now.toISOString() };
                        }
                    }
                    return exp;
                });

                if (currentCredits !== prev.player.credits) {
                    return {
                        ...prev,
                        player: { ...prev.player, credits: currentCredits },
                        expenses: updatedExpenses,
                        expenseHistory: newHistory.slice(0, 100)
                    };
                }
                return prev;
            });
        };

        const timer = setInterval(checkSystemResets, 60000); // Check every minute
        checkSystemResets(); // Initial check
        return () => clearInterval(timer);
    }, [gameState.player.lastLogin]);

    // Focus Mode Timer
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (gameState.player.focusMode.isActive) {
            timer = setInterval(() => {
                setGameState(prev => ({
                    ...prev,
                    player: {
                        ...prev.player,
                        focusMode: {
                            ...prev.player.focusMode,
                            dailyTotalSeconds: prev.player.focusMode.dailyTotalSeconds + 1
                        }
                    }
                }));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState.player.focusMode.isActive]);

    const addNotification = useCallback((message: string, type: Notification['type'] = 'INFO') => {
        const id = Date.now().toString() + Math.random();
        const newNotification: Notification = { id, message, type };
        setNotifications(prev => [...prev, newNotification]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }, []);

    const addLog = useCallback((message: string, type: LogEntry['type'] = 'INFO') => {
        const newLog: LogEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            message,
            type,
        };
        setGameState(prev => ({
            ...prev,
            logs: [newLog, ...prev.logs].slice(0, 50),
        }));
    }, []);

    const updateSettings = useCallback((newSettings: Partial<GameState['settings']>) => {
        setGameState(prev => ({
            ...prev,
            settings: { ...prev.settings, ...newSettings }
        }));
        addNotification('System settings updated.', 'INFO');
    }, [addNotification]);

    const toggleFocusMode = useCallback(() => {
        setGameState(prev => {
            const isActive = !prev.player.focusMode.isActive;
            addNotification(isActive ? 'FOCUS MODE ACTIVATED' : 'FOCUS MODE DEACTIVATED', isActive ? 'INFO' : 'SUCCESS');
            return {
                ...prev,
                player: {
                    ...prev.player,
                    focusMode: {
                        ...prev.player.focusMode,
                        isActive,
                        sessionStartedAt: isActive ? new Date().toISOString() : undefined
                    }
                }
            };
        });
    }, [addNotification]);

    const advanceStage = useCallback((stageId: string) => {
        const stage = STAGES.find(s => s.id === stageId);
        if (!stage) return;

        setGameState(prev => {
            addNotification(`STAGE EVOLUTION: ${stage.name}`, 'SUCCESS');
            addLog(`Player Stage updated to: ${stage.name}`, 'SUCCESS');
            return {
                ...prev,
                player: {
                    ...prev.player,
                    stageId,
                    stageStartedAt: new Date().toISOString()
                }
            };
        });
    }, [addNotification, addLog]);

    const addQuest = useCallback((questData: Omit<Quest, 'id' | 'status'>) => {
        const newQuest: Quest = {
            ...questData,
            id: Date.now().toString(),
            status: 'ACTIVE',
        };
        setGameState(prev => {
            const newQuests = [...prev.quests, newQuest];
            // If linked to a goal, update goal
            const newGoals = prev.goals.map(g => {
                if (g.id === newQuest.goalId) {
                    return { ...g, questIds: [...g.questIds, newQuest.id] };
                }
                return g;
            });
            return {
                ...prev,
                quests: newQuests,
                goals: newGoals
            };
        });
        addNotification(`QUEST CREATED: ${newQuest.title}`, 'INFO');
        addLog(`Quest Created: ${newQuest.title}`, 'INFO');
    }, [addNotification, addLog]);

    const calculateConsistency = useCallback(() => {
        setGameState(prev => {
            const last30DaysQuests = prev.quests.filter(q => {
                const createdDate = new Date(parseInt(q.id));
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return createdDate > thirtyDaysAgo && (q.status === 'COMPLETED' || q.status === 'FAILED');
            });

            if (last30DaysQuests.length === 0) return prev;

            const completed = last30DaysQuests.filter(q => q.status === 'COMPLETED').length;
            const newScore = Math.round((completed / last30DaysQuests.length) * 100);

            return {
                ...prev,
                player: { ...prev.player, consistencyScore: newScore }
            };
        });
    }, []);

    const updateStats = useCallback((statsDelta: Partial<Stats>) => {
        setGameState(prev => {
            const newStats = { ...prev.player.stats };
            (Object.entries(statsDelta) as [keyof Stats, number][]).forEach(([key, value]) => {
                if (value) {
                    newStats[key] = (newStats[key] || 0) + value;
                }
            });
            return {
                ...prev,
                player: { ...prev.player, stats: newStats },
            };
        });
    }, []);

    const gainXp = useCallback((amount: number) => {
        let leveledUp = false;
        let newLevel = 0;

        setGameState(prev => {
            let { xp, level, maxXp } = prev.player;
            xp += amount;

            while (xp >= maxXp) {
                xp -= maxXp;
                level++;
                maxXp = Math.floor(maxXp * 1.5);
                leveledUp = true;
                newLevel = level;
            }

            return {
                ...prev,
                player: { ...prev.player, xp, level, maxXp },
            };
        });

        if (amount > 0) {
            addNotification(`XP GAINED: +${amount}`, 'SUCCESS');
            addLog(`Gained ${amount} XP`, 'SUCCESS');
        }

        if (leveledUp) {
            addNotification(`LEVEL UP: REACHED LEVEL ${newLevel}`, 'SUCCESS');
            addLog(`LEVEL UP! You are now Level ${newLevel}`, 'SUCCESS');
        }
    }, [addNotification, addLog]);

    const completeQuest = useCallback((questId: string) => {
        setGameState(prev => {
            const questIndex = prev.quests.findIndex(q => q.id === questId);
            if (questIndex === -1) return prev;

            const quest = prev.quests[questIndex];
            if (quest.status !== 'ACTIVE') return prev;

            const newQuests = [...prev.quests];
            const isDaily = quest.type === 'DAILY';

            newQuests[questIndex] = {
                ...quest,
                status: 'COMPLETED',
                streak: isDaily ? (quest.streak || 0) + 1 : quest.streak,
                lastCompletedAt: new Date().toISOString(),
                completedCount: (quest.completedCount || 0) + 1
            };

            const isFatigued = prev.player.stats.energy < 20;
            const multiplier = isFatigued ? 0.5 : 1.0;

            const { credits, stats } = quest.rewards;

            const newStats = { ...prev.player.stats };
            if (stats) {
                (Object.entries(stats) as [keyof Stats, number][]).forEach(([key, value]) => {
                    if (value) newStats[key] = (newStats[key] || 0) + (value * multiplier);
                });
            }

            if (isFatigued) {
                addNotification('FATIGUE ACTIVE: Rewards reduced by 50%', 'WARNING');
            }

            return {
                ...prev,
                quests: newQuests,
                player: {
                    ...prev.player,
                    credits: prev.player.credits + ((credits || 0) * multiplier),
                    stats: newStats,
                },
            };
        });

        const quest = gameState.quests.find(q => q.id === questId);
        if (quest) {
            const isFatigued = gameState.player.stats.energy < 20;
            gainXp(quest.rewards.xp * (isFatigued ? 0.5 : 1.0));
            addNotification(`QUEST COMPLETED: ${quest.title}`, 'SUCCESS');
            addLog(`Quest Completed: ${quest.title}`, 'SUCCESS');
            calculateConsistency();
        }
    }, [gameState.quests, gameState.player.stats.energy, gainXp, addNotification, addLog, calculateConsistency]);

    const failQuest = useCallback((questId: string) => {
        setGameState(prev => {
            const questIndex = prev.quests.findIndex(q => q.id === questId);
            if (questIndex === -1) return prev;

            const quest = prev.quests[questIndex];
            const newQuests = [...prev.quests];
            newQuests[questIndex] = { ...quest, status: 'FAILED' };

            const newStats = { ...prev.player.stats };
            if (quest.penalty?.stats) {
                (Object.entries(quest.penalty.stats) as [keyof Stats, number][]).forEach(([key, value]) => {
                    if (value) newStats[key] = Math.max(0, (newStats[key] || 0) - value);
                });
            }

            return {
                ...prev,
                quests: newQuests,
                player: {
                    ...prev.player,
                    stats: newStats,
                    credits: Math.max(0, prev.player.credits - (quest.penalty?.credits || 0)),
                },
            };
        });

        const quest = gameState.quests.find(q => q.id === questId);
        if (quest) {
            addNotification(`QUEST FAILED: ${quest.title}`, 'FAILURE');
            addLog(`Quest Failed: ${quest.title}`, 'ERROR');
            calculateConsistency();
        }
    }, [gameState.quests, addNotification, addLog, calculateConsistency]);

    // v1.3 Economy Module
    const addExpense = useCallback((expenseData: Omit<Expense, 'id' | 'timestamp'>) => {
        const id = Date.now().toString();
        const timestamp = new Date().toISOString();
        const newExpense: Expense = { ...expenseData, id, timestamp };

        setGameState(prev => {
            const newCredits = prev.player.credits - newExpense.amount;
            addLog(`Expense Logged: ${newExpense.name} (-${newExpense.amount} Credits)`, 'WARNING');
            addNotification(`EXPENSE LOGGED: -${newExpense.amount} Credits`, 'INFO');

            return {
                ...prev,
                player: { ...prev.player, credits: newCredits },
                expenses: newExpense.type === 'RECURRING' ? [...prev.expenses, newExpense] : prev.expenses,
                expenseHistory: [newExpense, ...prev.expenseHistory].slice(0, 100)
            };
        });
    }, [addLog, addNotification]);

    // v1.3 Manual Adjustment
    const applyManualAdjustment = useCallback((adj: Omit<ManualAdjustment, 'id' | 'timestamp'>) => {
        const id = Date.now().toString();
        const timestamp = new Date().toISOString();
        const newAdj: ManualAdjustment = { ...adj, id, timestamp };

        setGameState(prev => {
            let newPlayer = { ...prev.player };
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

            addLog(`Manual Adjustment (${adj.type}): ${adj.reason}`, 'WARNING');
            addNotification(`ADJUSTMENT APPLIED: ${adj.type}`, 'WARNING');

            return {
                ...prev,
                player: newPlayer,
                manualAdjustments: [newAdj, ...prev.manualAdjustments]
            };
        });
    }, [addLog, addNotification]);

    const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'questIds' | 'status'>) => {
        const newGoal: Goal = {
            ...goalData,
            id: Date.now().toString(),
            status: 'NOT_STARTED',
            questIds: []
        };
        setGameState(prev => ({
            ...prev,
            goals: [...prev.goals, newGoal]
        }));
        addNotification(`GOAL CREATED: ${newGoal.name}`, 'SUCCESS');
    }, [addNotification]);

    // v1.3.1 Goals-Quest Linking
    const linkQuestToGoal = useCallback((questId: string, goalId: string) => {
        setGameState(prev => {
            const updatedQuests = prev.quests.map(q => {
                if (q.id === questId) {
                    return { ...q, goalId };
                }
                return q;
            });

            const updatedGoals = prev.goals.map(g => {
                if (g.id === goalId) {
                    if (!g.questIds.includes(questId)) {
                        return { ...g, questIds: [...g.questIds, questId] };
                    }
                } else if (g.questIds.includes(questId)) {
                    // Remove from other goals to ensure 1 goal per quest
                    return { ...g, questIds: g.questIds.filter(id => id !== questId) };
                }
                return g;
            });

            return {
                ...prev,
                quests: updatedQuests,
                goals: updatedGoals
            };
        });
        addNotification('Quest linked to Goal', 'SUCCESS');
    }, [addNotification]);

    const unlinkQuestFromGoal = useCallback((questId: string) => {
        setGameState(prev => {
            const updatedQuests = prev.quests.map(q => {
                if (q.id === questId) {
                    const { goalId: _, ...rest } = q;
                    return rest as Quest;
                }
                return q;
            });

            const updatedGoals = prev.goals.map(g => {
                if (g.questIds.includes(questId)) {
                    return { ...g, questIds: g.questIds.filter(id => id !== questId) };
                }
                return g;
            });

            return {
                ...prev,
                quests: updatedQuests,
                goals: updatedGoals
            };
        });
        addNotification('Quest unlinked from Goal', 'INFO');
    }, [addNotification]);

    const deleteQuest = useCallback((questId: string) => {
        setGameState(prev => {
            const newQuests = prev.quests.filter(q => q.id !== questId);
            const newGoals = prev.goals.map(g => ({
                ...g,
                questIds: g.questIds.filter(id => id !== questId)
            }));
            return {
                ...prev,
                quests: newQuests,
                goals: newGoals
            };
        });
        addNotification('Quest deleted from system', 'WARNING');
    }, [addNotification]);

    const deleteGoal = useCallback((goalId: string) => {
        setGameState(prev => {
            const newGoals = prev.goals.filter(g => g.id !== goalId);
            // Unlink quests that were associated with this goal
            const newQuests = prev.quests.map(q => {
                if (q.goalId === goalId) {
                    const { goalId: _, ...rest } = q;
                    return rest as Quest;
                }
                return q;
            });
            return {
                ...prev,
                goals: newGoals,
                quests: newQuests
            };
        });
        addNotification('Macro Objective terminated', 'WARNING');
    }, [addNotification]);

    return {
        gameState,
        notifications,
        addLog,
        addQuest,
        gainXp,
        updateStats,
        completeQuest,
        failQuest,
        addNotification,
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
    };
};

