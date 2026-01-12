import React, { useState } from 'react';
import type { Quest, QuestType } from '../types';
import { CheckSquare, Square, AlertTriangle, Plus, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestLogProps {
    quests: Quest[];
    onComplete: (id: string) => void;
    onFail: (id: string) => void;
    onDelete: (id: string) => void;
    onCreateQuest: () => void;
}

export const QuestLog: React.FC<QuestLogProps> = ({ quests, onComplete, onFail, onDelete, onCreateQuest }) => {
    const [filter, setFilter] = useState<QuestType | 'ALL'>('ALL');

    const filteredQuests = quests.filter(q =>
        (filter === 'ALL' || q.type === filter) && q.status === 'ACTIVE'
    );

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'E': return 'text-gray-400';
            case 'D': return 'text-green-400';
            case 'C': return 'text-blue-400';
            case 'B': return 'text-purple-400';
            case 'A': return 'text-orange-400';
            case 'S': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="bg-system-panel border border-system-border rounded-sm shadow-lg h-full flex flex-col">
            <div className="p-4 border-b border-system-border flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <AlertTriangle size={18} className="text-system-blue" />
                    QUEST LOG
                </h2>

                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex bg-system-dark border border-system-border p-0.5 rounded-sm">
                        {(['ALL', 'MAIN', 'SIDE', 'DAILY'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-3 py-1 text-xs font-mono transition-all
                                    ${filter === type
                                        ? 'bg-system-blue text-white shadow-[0_0_10px_rgba(0,170,255,0.3)]'
                                        : 'text-system-text/60 hover:text-system-text hover:bg-white/5'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={onCreateQuest}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-mono bg-system-blue/10 text-system-blue border border-system-blue hover:bg-system-blue hover:text-white transition-all shadow-[0_0_10px_rgba(0,170,255,0.1)]"
                    >
                        <Plus size={14} />
                        ADD QUEST
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {filteredQuests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="text-system-text/40 font-mono text-sm mb-4">
                                NO ACTIVE {filter !== 'ALL' ? filter : ''} QUESTS DETECTED
                            </div>
                            <button
                                onClick={onCreateQuest}
                                className="text-xs font-mono text-system-blue border-b border-system-blue/30 hover:border-system-blue transition-colors pb-0.5"
                            >
                                INITIALIZE NEW OBJECTIVE
                            </button>
                        </motion.div>
                    ) : (
                        filteredQuests.map(quest => (
                            <motion.div
                                key={quest.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                className="border border-system-border bg-system-dark/50 p-4 hover:border-system-blue/50 transition-colors group relative overflow-hidden"
                            >
                                {/* Rank/Difficulty Indicator */}
                                <div className={`absolute top-0 right-0 px-3 py-0.5 text-[10px] font-bold font-mono bg-system-border/30 border-l border-b border-system-border ${getDifficultyColor(quest.difficulty)}`}>
                                    RANK {quest.difficulty}
                                </div>

                                <div className="flex justify-between items-start mb-2 pr-16 relative">
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this quest?')) {
                                                onDelete(quest.id);
                                            }
                                        }}
                                        className="absolute -right-2 top-0 p-1 text-system-text/20 hover:text-system-danger transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Quest"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div>
                                        <div className="text-[10px] font-mono text-system-blue/60 uppercase mb-0.5">
                                            {quest.type} QUEST
                                            {quest.type === 'DAILY' && quest.streak !== undefined && (
                                                <span className="ml-2 text-system-gold">STREAK: {quest.streak}</span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-system-text group-hover:text-system-blue transition-colors flex items-center gap-2">
                                            {quest.title}
                                            {quest.goalId && (
                                                <span className="text-[8px] bg-system-blue/20 text-system-blue px-1.5 py-0.5 rounded-full border border-system-blue/30 uppercase tracking-tighter">
                                                    Linked to Goal
                                                </span>
                                            )}
                                            {quest.deadline && new Date(quest.deadline) < new Date() && quest.status === 'ACTIVE' && (
                                                <span className="text-[8px] bg-system-danger/20 text-system-danger px-1.5 py-0.5 rounded-full border border-system-danger/30 uppercase tracking-tighter flex items-center gap-1">
                                                    <Clock size={8} /> OVERDUE
                                                </span>
                                            )}
                                        </h3>
                                    </div>
                                </div>

                                {quest.description && (
                                    <p className="text-sm text-system-text/70 mb-4 font-mono leading-relaxed border-l-2 border-system-border/30 pl-3">
                                        {quest.description}
                                    </p>
                                )}

                                {quest.status === 'COMPLETED' && quest.type === 'DAILY' && (
                                    <div className="mb-4 text-xs font-mono text-green-400 bg-green-400/10 p-2 border border-green-400/20 rounded-sm flex items-center gap-2">
                                        <CheckSquare size={14} /> COMPLETED TODAY
                                    </div>
                                )}

                                {quest.subtasks && quest.subtasks.length > 0 && quest.status === 'ACTIVE' && (
                                    <div className="space-y-1 mb-4 pl-1">
                                        {quest.subtasks.map(task => (
                                            <div key={task.id} className="flex items-center gap-2 text-xs text-system-text/60">
                                                {task.completed ? <CheckSquare size={12} className="text-system-blue" /> : <Square size={12} />}
                                                <span className={task.completed ? 'line-through text-system-text/40' : ''}>{task.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-system-border/30">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-mono text-system-text/40 uppercase">Rewards</span>
                                            <div className="flex gap-3 text-xs font-mono">
                                                <span className="text-system-gold">+{quest.rewards.xp} XP</span>
                                                {quest.rewards.credits !== undefined && quest.rewards.credits > 0 && <span className="text-white">+{quest.rewards.credits} C</span>}
                                                {quest.rewards.stats && Object.entries(quest.rewards.stats).map(([stat, val]) => (
                                                    <span key={stat} className="text-system-blue">+{val} {stat.substring(0, 3).toUpperCase()}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {quest.status === 'ACTIVE' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onFail(quest.id)}
                                                className="px-3 py-1.5 text-xs font-mono text-system-danger/60 hover:text-system-danger hover:bg-system-danger/10 border border-transparent hover:border-system-danger transition-colors uppercase"
                                            >
                                                Abandon
                                            </button>
                                            <button
                                                onClick={() => onComplete(quest.id)}
                                                className="px-4 py-1.5 text-xs font-bold font-mono bg-system-blue text-white hover:bg-system-blue/80 transition-all shadow-[0_0_10px_rgba(0,170,255,0.2)] uppercase tracking-wider"
                                            >
                                                Complete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

