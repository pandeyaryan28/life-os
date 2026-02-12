import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ArrowLeft } from 'lucide-react';
import type { Quest, QuestType, Stats, Goal } from '../types';

interface QuestCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateQuest: (quest: Omit<Quest, 'id' | 'status'>) => void;
    goals: Goal[];
    initialGoalId?: string;
}

const STAT_OPTIONS: (keyof Stats)[] = [
    'physical', 'mental', 'discipline', 'knowledge',
    'creativity', 'social', 'wealth', 'focus'
];

export const QuestCreationModal: React.FC<QuestCreationModalProps> = ({ isOpen, onClose, onCreateQuest, goals, initialGoalId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<QuestType>('SIDE');
    const [difficulty, setDifficulty] = useState<Quest['difficulty']>('D');
    const [xpReward, setXpReward] = useState(10);
    const [creditReward, setCreditReward] = useState(0);
    const [selectedGoalId, setSelectedGoalId] = useState<string>('');
    const [selectedStats, setSelectedStats] = useState<Partial<Record<keyof Stats, number>>>({});
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        if (isOpen && initialGoalId) {
            setSelectedGoalId(initialGoalId);
        }
    }, [isOpen, initialGoalId]);

    // Esc key support
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateQuest({
            title,
            description,
            type,
            difficulty,
            goalId: selectedGoalId || undefined,
            deadline: deadline || undefined,
            rewards: {
                xp: xpReward,
                credits: creditReward,
                stats: selectedStats,
            },
        });
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setType('SIDE');
        setDifficulty('D');
        setXpReward(10);
        setCreditReward(0);
        setSelectedGoalId('');
        setSelectedStats({});
        setDeadline('');
    };

    const toggleStat = (stat: keyof Stats) => {
        setSelectedStats(prev => {
            const next = { ...prev };
            if (next[stat] !== undefined) {
                delete next[stat];
            } else {
                next[stat] = 1;
            }
            return next;
        });
    };

    const updateStatValue = (stat: keyof Stats, delta: number) => {
        setSelectedStats(prev => ({
            ...prev,
            [stat]: Math.max(1, (prev[stat] || 0) + delta)
        }));
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center md:p-4 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-system-panel border-2 border-system-blue w-full h-full md:h-auto md:max-w-lg md:max-h-[90vh] shadow-[0_0_30px_rgba(0,170,255,0.2)] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-system-blue/30 bg-system-blue/5 flex-shrink-0">
                    <h2 id="modal-title" className="text-base md:text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
                        <Plus size={20} className="text-system-blue" />
                        Initialize New Quest
                    </h2>
                    <button onClick={onClose} className="p-2 text-system-text/60 active:text-white transition-colors tap-feedback">
                        <ArrowLeft size={22} className="md:hidden" />
                        <X size={22} className="hidden md:block" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5 md:space-y-6 flex-1 overflow-y-auto">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="quest-title" className="block text-xs font-mono text-system-blue uppercase mb-1">Quest Title</label>
                            <input
                                id="quest-title"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-system-dark border border-system-border p-3 text-white font-mono focus:border-system-blue outline-none transition-colors text-sm"
                                placeholder="Enter objective..."
                            />
                        </div>

                        <div>
                            <label htmlFor="quest-desc" className="block text-xs font-mono text-system-blue uppercase mb-1">Description (Optional)</label>
                            <textarea
                                id="quest-desc"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-system-dark border border-system-border p-3 text-white font-mono focus:border-system-blue outline-none transition-colors h-20 resize-none text-sm"
                                placeholder="Details..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label htmlFor="quest-type" className="block text-xs font-mono text-system-blue uppercase mb-1">Type</label>
                                <select
                                    id="quest-type"
                                    value={type}
                                    onChange={e => setType(e.target.value as QuestType)}
                                    className="w-full bg-system-dark border border-system-border p-3 text-white font-mono focus:border-system-blue outline-none transition-colors text-sm"
                                >
                                    <option value="MAIN">MAIN</option>
                                    <option value="SIDE">SIDE</option>
                                    <option value="DAILY">DAILY</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="quest-rank" className="block text-xs font-mono text-system-blue uppercase mb-1">Rank</label>
                                <select
                                    id="quest-rank"
                                    value={difficulty}
                                    onChange={e => setDifficulty(e.target.value as Quest['difficulty'])}
                                    className="w-full bg-system-dark border border-system-border p-3 text-white font-mono focus:border-system-blue outline-none transition-colors text-sm"
                                >
                                    {['E', 'D', 'C', 'B', 'A', 'S'].map(rank => (
                                        <option key={rank} value={rank}>{rank}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Goal Link Selection & Deadline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label htmlFor="quest-goal" className="block text-xs font-mono text-system-blue uppercase mb-1">Link to Goal (Optional)</label>
                                <select
                                    id="quest-goal"
                                    value={selectedGoalId}
                                    onChange={e => setSelectedGoalId(e.target.value)}
                                    className="w-full bg-system-dark border border-system-border p-3 text-white font-mono focus:border-system-blue outline-none transition-colors text-sm"
                                >
                                    <option value="">NO GOAL LINKED</option>
                                    {goals.map(goal => (
                                        <option key={goal.id} value={goal.id}>
                                            {goal.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="quest-deadline" className="block text-xs font-mono text-system-blue uppercase mb-1">Deadline (Optional)</label>
                                <input
                                    id="quest-deadline"
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                    className="w-full bg-system-dark border border-system-border p-3 text-white font-mono focus:border-system-blue outline-none transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rewards */}
                    <div className="pt-4 border-t border-system-border">
                        <h3 className="text-xs font-mono text-system-gold uppercase mb-3">Rewards (User Defined)</h3>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-xs font-mono text-system-text/60 uppercase mb-1">XP</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={xpReward}
                                    onChange={e => setXpReward(Number(e.target.value))}
                                    className="w-full bg-system-dark border border-system-border p-3 text-white font-mono outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-system-text/60 uppercase mb-1">Credits</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={creditReward}
                                    onChange={e => setCreditReward(Number(e.target.value))}
                                    className="w-full bg-system-dark border border-system-border p-3 text-white font-mono outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Associated Stats */}
                    <div className="pt-4 border-t border-system-border">
                        <h3 className="text-xs font-mono text-system-blue uppercase mb-3">Associated Stats</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {STAT_OPTIONS.map(stat => (
                                <div key={stat} className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleStat(stat)}
                                        className={`flex-1 text-left px-3 py-2 text-xs font-mono border transition-all tap-feedback ${selectedStats[stat] !== undefined
                                            ? 'bg-system-blue/20 border-system-blue text-system-blue'
                                            : 'bg-system-dark border-system-border text-system-text/40'
                                            }`}
                                    >
                                        {stat.toUpperCase()}
                                    </button>
                                    {selectedStats[stat] !== undefined && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => updateStatValue(stat, -1)}
                                                className="p-2 active:text-system-blue transition-colors tap-feedback"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-5 text-center text-xs font-mono text-system-gold">{selectedStats[stat]}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateStatValue(stat, 1)}
                                                className="p-2 active:text-system-blue transition-colors tap-feedback"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 md:pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-system-border text-system-text/60 font-mono active:bg-white/5 transition-colors tap-feedback"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 bg-system-blue text-white font-bold tracking-widest active:bg-system-blue/80 transition-all shadow-[0_0_15px_rgba(0,170,255,0.4)] tap-feedback"
                        >
                            START QUEST
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
