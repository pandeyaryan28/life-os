import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
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

    React.useEffect(() => {
        if (isOpen && initialGoalId) {
            setSelectedGoalId(initialGoalId);
        }
    }, [isOpen, initialGoalId]);

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

    // Esc key support
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-system-panel border-2 border-system-blue w-full max-w-lg shadow-[0_0_30px_rgba(0,170,255,0.2)] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-system-blue/30 bg-system-blue/5">
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
                        <Plus size={20} className="text-system-blue" />
                        Initialize New Quest
                    </h2>
                    <button onClick={onClose} className="text-system-text/60 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-system-blue uppercase mb-1">Quest Title</label>
                            <input
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-system-dark border border-system-border p-2 text-white font-mono focus:border-system-blue outline-none transition-colors"
                                placeholder="Enter objective..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-system-blue uppercase mb-1">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-system-dark border border-system-border p-2 text-white font-mono focus:border-system-blue outline-none transition-colors h-20 resize-none"
                                placeholder="Details..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-system-blue uppercase mb-1">Type</label>
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value as QuestType)}
                                    className="w-full bg-system-dark border border-system-border p-2 text-white font-mono focus:border-system-blue outline-none transition-colors"
                                >
                                    <option value="MAIN">MAIN</option>
                                    <option value="SIDE">SIDE</option>
                                    <option value="DAILY">DAILY</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-system-blue uppercase mb-1">Rank</label>
                                <select
                                    value={difficulty}
                                    onChange={e => setDifficulty(e.target.value as Quest['difficulty'])}
                                    className="w-full bg-system-dark border border-system-border p-2 text-white font-mono focus:border-system-blue outline-none transition-colors"
                                >
                                    {['E', 'D', 'C', 'B', 'A', 'S'].map(rank => (
                                        <option key={rank} value={rank}>{rank}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Goal Link Selection & Deadline */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-system-blue uppercase mb-1">Link to Goal (Optional)</label>
                                <select
                                    value={selectedGoalId}
                                    onChange={e => setSelectedGoalId(e.target.value)}
                                    className="w-full bg-system-dark border border-system-border p-2 text-white font-mono focus:border-system-blue outline-none transition-colors"
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
                                <label className="block text-xs font-mono text-system-blue uppercase mb-1">Deadline (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={deadline}
                                    onChange={e => setDeadline(e.target.value)}
                                    className="w-full bg-system-dark border border-system-border p-2 text-white font-mono focus:border-system-blue outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rewards */}
                    <div className="pt-4 border-t border-system-border">
                        <h3 className="text-xs font-mono text-system-gold uppercase mb-3">Rewards (User Defined)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-system-text/60 uppercase mb-1">XP</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={xpReward}
                                    onChange={e => setXpReward(Number(e.target.value))}
                                    className="w-full bg-system-dark border border-system-border p-2 text-white font-mono outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-system-text/60 uppercase mb-1">Credits</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={creditReward}
                                    onChange={e => setCreditReward(Number(e.target.value))}
                                    className="w-full bg-system-dark border border-system-border p-2 text-white font-mono outline-none"
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
                                        className={`flex-1 text-left px-3 py-1.5 text-xs font-mono border transition-all ${selectedStats[stat] !== undefined
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
                                                className="p-1 hover:text-system-blue transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-4 text-center text-xs font-mono text-system-gold">{selectedStats[stat]}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateStatValue(stat, 1)}
                                                className="p-1 hover:text-system-blue transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-system-border text-system-text/60 font-mono hover:bg-white/5 transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="flex-2 py-3 bg-system-blue text-white font-bold tracking-widest hover:bg-system-blue/80 transition-all shadow-[0_0_15px_rgba(0,170,255,0.4)]"
                        >
                            START QUEST
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
