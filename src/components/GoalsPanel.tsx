import React, { useState } from 'react';
import { Target, Plus, ChevronRight, CheckCircle2, Circle, Link, Unlink, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Goal, Quest, Stats } from '../types';

interface GoalsPanelProps {
    goals: Goal[];
    quests: Quest[];
    onAddGoal: (goal: Omit<Goal, 'id' | 'questIds' | 'status'>) => void;
    onLinkQuest: (questId: string, goalId: string) => void;
    onUnlinkQuest: (questId: string) => void;
    onDeleteGoal: (goalId: string) => void;
    onDeleteQuest: (questId: string) => void;
    onTriggerNewQuest: (goalId: string) => void;
}

const STAT_OPTIONS: (keyof Stats)[] = [
    'physical', 'mental', 'discipline', 'knowledge',
    'creativity', 'social', 'wealth', 'focus'
];

export const GoalsPanel: React.FC<GoalsPanelProps> = ({
    goals,
    quests,
    onAddGoal,
    onLinkQuest,
    onUnlinkQuest,
    onDeleteGoal,
    onDeleteQuest,
    onTriggerNewQuest
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isLinking, setIsLinking] = useState<string | null>(null); // goalId
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

    // Form state for new goal
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [deadline, setDeadline] = useState('');
    const [associatedStats, setAssociatedStats] = useState<(keyof Stats)[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddGoal({
            name,
            description,
            category: category || undefined,
            deadline: deadline || undefined,
            associatedStats: associatedStats.length > 0 ? associatedStats : undefined
        });
        setIsAdding(false);
        setName('');
        setDescription('');
        setCategory('');
        setDeadline('');
        setAssociatedStats([]);
    };

    const toggleStat = (stat: keyof Stats) => {
        setAssociatedStats(prev =>
            prev.includes(stat) ? prev.filter(s => s !== stat) : [...prev, stat]
        );
    };

    const getGoalMetrics = (goal: Goal) => {
        const goalQuests = quests.filter(q => q.goalId === goal.id);
        const total = goalQuests.length;
        if (total === 0) return { progress: 0, completed: 0, total: 0 };
        const completed = goalQuests.filter(q => q.status === 'COMPLETED').length;
        const progress = Math.round((completed / total) * 100);
        return { progress, completed, total };
    };

    const unassignedQuests = quests.filter(q => !q.goalId);

    return (
        <div className="bg-system-panel border border-system-border rounded-sm shadow-xl flex flex-col h-full overflow-hidden relative">
            <div className="p-3 md:p-4 border-b border-system-border bg-system-blue/5 flex justify-between items-center">
                <h2 className="text-xs md:text-sm font-black text-white tracking-[0.2em] uppercase flex items-center gap-2">
                    <Target size={16} className="text-system-blue" />
                    Macro Objectives
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="p-2 active:bg-system-blue/10 rounded-sm text-system-blue transition-colors border border-system-blue/30 tap-feedback"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                {goals.length === 0 ? (
                    <div className="py-16 md:py-20 text-center flex flex-col items-center gap-4">
                        <Target size={48} className="text-system-text/10" />
                        <p className="text-[10px] font-mono text-system-text/30 uppercase tracking-widest">No long-term goals identified</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-[10px] font-mono text-system-blue border-b border-system-blue/30 hover:border-system-blue transition-colors pb-0.5 uppercase tap-feedback py-2"
                        >
                            Initialize Objective
                        </button>
                    </div>
                ) : (
                    goals.map(goal => {
                        const { progress, completed, total } = getGoalMetrics(goal);
                        const isExpanded = selectedGoalId === goal.id;

                        return (
                            <div
                                key={goal.id}
                                className={`border transition-all ${isExpanded ? 'bg-system-dark/50 border-system-blue/50' : 'bg-system-dark/20 border-system-border active:border-system-text/30'}`}
                            >
                                <div
                                    className="p-3 md:p-4 cursor-pointer tap-feedback"
                                    onClick={() => setSelectedGoalId(isExpanded ? null : goal.id)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <p className="text-[10px] font-mono text-system-blue/60 uppercase mb-1">{goal.category || 'OBJECTIVE'}</p>
                                            <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">{goal.name}</h3>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xl font-black text-system-gold font-mono leading-none">{total > 0 ? `${progress}%` : '0%'}</p>
                                            <p className="text-[10px] font-mono text-system-text/40 uppercase mt-1">
                                                {completed} / {total} Units
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-1.5 bg-system-dark rounded-full overflow-hidden border border-system-border/30">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-system-blue shadow-[0_0_10px_rgba(0,170,255,0.4)]"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center mt-3">
                                        <div className="flex gap-1.5 flex-wrap">
                                            {goal.associatedStats?.map(stat => (
                                                <span key={stat} className="text-[8px] font-mono text-system-blue/60 uppercase p-1 bg-system-blue/5 border border-system-blue/10">
                                                    {stat.substring(0, 3)}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Permanent Deletion: Are you sure?')) {
                                                        onDeleteGoal(goal.id);
                                                    }
                                                }}
                                                className="text-[9px] font-mono text-system-danger/40 active:text-system-danger uppercase transition-colors p-1 tap-feedback"
                                            >
                                                TERMINATE
                                            </button>
                                            <div className="flex items-center gap-1.5 text-[9px] font-mono text-system-text/40 uppercase">
                                                View Roadmap <ChevronRight size={10} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-system-border/30"
                                        >
                                            <div className="p-3 md:p-4 space-y-4 bg-black/20">
                                                <div>
                                                    <p className="text-[10px] font-mono text-system-blue uppercase mb-1">Description</p>
                                                    <p className="text-[10px] text-system-text/60 font-mono leading-relaxed">
                                                        {goal.description}
                                                    </p>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-[10px] font-mono text-system-text/40 uppercase">Linked Quests</p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsLinking(goal.id);
                                                            }}
                                                            className="text-[9px] font-black text-system-blue border border-system-blue/30 px-2 py-1 rounded-sm active:bg-system-blue/10 transition-colors uppercase flex items-center gap-1 tap-feedback"
                                                        >
                                                            <Plus size={10} /> Add Quest
                                                        </button>
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        {quests.filter(q => q.goalId === goal.id).length === 0 ? (
                                                            <p className="text-[9px] font-mono text-white/20 italic p-4 text-center border border-dashed border-system-border/20">
                                                                0% — No quests assigned
                                                            </p>
                                                        ) : (
                                                            quests.filter(q => q.goalId === goal.id).map(q => (
                                                                <div key={q.id} className="flex items-center justify-between p-2.5 bg-system-dark/40 border border-system-border/20 rounded-sm group">
                                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                        {q.status === 'COMPLETED' ? (
                                                                            <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
                                                                        ) : q.status === 'FAILED' ? (
                                                                            <X size={14} className="text-system-danger flex-shrink-0" />
                                                                        ) : (
                                                                            <Circle size={14} className="text-system-text/20 flex-shrink-0" />
                                                                        )}
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className={`text-[10px] font-mono font-bold truncate ${q.status === 'COMPLETED' ? 'text-system-text/40 line-through' : 'text-system-text'}`}>
                                                                                {q.title}
                                                                            </span>
                                                                            <span className="text-[8px] font-mono text-system-text/30 uppercase">
                                                                                {q.type} • {q.status}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {/* Action buttons — always visible on mobile */}
                                                                    <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-all flex-shrink-0 ml-2">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onUnlinkQuest(q.id);
                                                                            }}
                                                                            className="p-2 text-system-text/30 active:text-white active:bg-white/5 rounded transition-all tap-feedback"
                                                                            title="Unlink Quest"
                                                                        >
                                                                            <Unlink size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (window.confirm('Delete this quest?')) {
                                                                                    onDeleteQuest(q.id);
                                                                                }
                                                                            }}
                                                                            className="p-2 text-system-danger/40 active:text-system-danger active:bg-system-danger/10 rounded transition-all tap-feedback"
                                                                            title="Delete Quest"
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Link Quest Modal/Overlay — full-screen on mobile */}
            <AnimatePresence>
                {isLinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 md:absolute md:inset-0 z-[60] bg-system-dark p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                                <Link size={16} className="text-system-blue" />
                                Assign Quest to Goal
                            </h3>
                            <button onClick={() => setIsLinking(null)} className="p-2 text-system-text/40 active:text-white transition-colors tap-feedback">
                                <ArrowLeft size={20} className="md:hidden" />
                                <X size={20} className="hidden md:block" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4">
                            <button
                                onClick={() => {
                                    onTriggerNewQuest(isLinking);
                                    setIsLinking(null);
                                }}
                                className="w-full p-4 border-2 border-dashed border-system-blue/30 text-system-blue font-mono text-[10px] uppercase active:bg-system-blue/5 transition-colors flex items-center justify-center gap-2 tap-feedback"
                            >
                                <Plus size={14} /> Initialize Fresh Quest
                            </button>

                            <div className="space-y-2">
                                <p className="text-[9px] font-mono text-system-text/40 uppercase mb-2">Available Unassigned Quests</p>
                                {unassignedQuests.length === 0 ? (
                                    <p className="text-[10px] font-mono text-system-text/20 italic text-center py-4">No unassigned units detected</p>
                                ) : (
                                    unassignedQuests.map(q => (
                                        <button
                                            key={q.id}
                                            onClick={() => {
                                                onLinkQuest(q.id, isLinking);
                                                setIsLinking(null);
                                            }}
                                            className="w-full text-left p-3 bg-system-panel border border-system-border active:border-system-blue/50 group transition-all tap-feedback"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[11px] font-bold text-white uppercase">{q.title}</span>
                                                <span className="text-[8px] font-mono text-system-text/40 border border-system-border px-1">{q.type}</span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Goal Form — full-screen on mobile */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 md:absolute md:inset-0 z-50 bg-system-dark/95 backdrop-blur-sm p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                                <Plus size={16} className="text-system-blue" />
                                Define Macro Objective
                            </h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 text-system-text/40 active:text-white transition-colors tap-feedback">
                                <ArrowLeft size={20} className="md:hidden" />
                                <X size={20} className="hidden md:block" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-1">
                            <div>
                                <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Goal Name</label>
                                <input
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-system-panel border border-system-border p-3 font-mono text-xs text-white focus:border-system-blue outline-none"
                                    placeholder="e.g. Master React, Reach 75kg, Buy a Car..."
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Description / Roadmap</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-system-panel border border-system-border p-3 font-mono text-[10px] text-white focus:border-system-blue outline-none h-24 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Category</label>
                                    <input
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-system-panel border border-system-border p-3 font-mono text-xs text-white focus:border-system-blue outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Deadline (Optional)</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={e => setDeadline(e.target.value)}
                                        className="w-full bg-system-panel border border-system-border p-3 font-mono text-xs text-white focus:border-system-blue outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Associated Stats</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {STAT_OPTIONS.map(stat => (
                                        <button
                                            key={stat}
                                            type="button"
                                            onClick={() => toggleStat(stat)}
                                            className={`py-2 text-[8px] font-mono border transition-all tap-feedback ${associatedStats.includes(stat) ? 'bg-system-blue/20 border-system-blue text-system-blue' : 'bg-system-dark border-system-border text-system-text/40'}`}
                                        >
                                            {stat.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-system-blue/20 active:bg-system-blue/40 border border-system-blue text-system-blue font-black uppercase tracking-[0.2em] transition-all text-xs tap-feedback"
                            >
                                Initiate Goal Protocol
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
