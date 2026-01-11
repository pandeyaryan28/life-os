import React, { useState } from 'react';
import { ShieldAlert, History, AlertTriangle, ArrowDown, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ManualAdjustment, Stats } from '../types';

interface ManualAdjustmentPanelProps {
    history: ManualAdjustment[];
    onApplyAdjustment: (adj: Omit<ManualAdjustment, 'id' | 'timestamp'>) => void;
}

const STAT_LABELS: (keyof Stats)[] = [
    'physical', 'mental', 'discipline', 'knowledge',
    'creativity', 'social', 'wealth', 'focus', 'energy'
];

export const ManualAdjustmentPanel: React.FC<ManualAdjustmentPanelProps> = ({ history, onApplyAdjustment }) => {
    const [isAdjusting, setIsAdjusting] = useState(false);
    const [type, setType] = useState<ManualAdjustment['type']>('CREDITS');
    const [value, setValue] = useState<number>(0);
    const [reason, setReason] = useState('');
    const [selectedStats, setSelectedStats] = useState<Partial<Stats>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onApplyAdjustment({
            type,
            value: type === 'STATS' ? selectedStats : -Math.abs(value),
            reason,
        });
        setIsAdjusting(false);
        setValue(0);
        setReason('');
        setSelectedStats({});
    };

    return (
        <div className="bg-system-panel border border-system-border rounded-sm shadow-xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-system-border bg-system-danger/5 flex justify-between items-center">
                <h2 className="text-sm font-black text-system-danger tracking-[0.2em] uppercase flex items-center gap-2">
                    <ShieldAlert size={16} />
                    Manual Penalties
                </h2>
                <button
                    onClick={() => setIsAdjusting(true)}
                    className="p-1 hover:bg-system-danger/10 rounded-sm text-system-danger transition-colors border border-system-danger/30"
                >
                    <UserMinus size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="bg-system-danger/10 border border-system-danger/20 p-3 rounded-sm">
                    <p className="text-[10px] font-mono text-system-danger uppercase leading-tight">
                        Self-accountability mode. Use this to manually penalize yourself for broken rules or failed discipline.
                    </p>
                </div>

                <div>
                    <h3 className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <History size={12} /> Penalty Logs
                    </h3>
                    <div className="space-y-2">
                        {history.length === 0 ? (
                            <div className="py-8 text-center text-[10px] font-mono text-system-text/20 uppercase">No penalties logged</div>
                        ) : (
                            history.map(adj => (
                                <div key={adj.id} className="p-3 bg-system-dark/30 border border-system-border/20 rounded-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] bg-system-danger/20 text-system-danger px-1.5 py-0.5 rounded-sm font-bold border border-system-danger/30">
                                                {adj.type}
                                            </span>
                                            <span className="text-[10px] text-white font-black uppercase">-{typeof adj.value === 'number' ? Math.abs(adj.value) : 'STATS'}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-system-text/30">{new Date(adj.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] font-mono text-system-text/70 italic leading-relaxed">"{adj.reason}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isAdjusting && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 z-50 bg-system-dark/95 backdrop-blur-sm p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-system-danger uppercase tracking-widest text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Apply Intentional Penalty
                            </h3>
                            <button onClick={() => setIsAdjusting(false)} className="text-system-text/40 hover:text-white transition-colors">
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Adjustment Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['XP', 'CREDITS', 'STATS', 'DEBUFF'] as const).map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`py-2 text-[10px] font-mono border transition-all ${type === t ? 'bg-system-danger/20 border-system-danger text-system-danger' : 'bg-system-panel border-system-border text-system-text/40'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {type !== 'STATS' ? (
                                <div>
                                    <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Deduction Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-system-danger">-</span>
                                        <input
                                            required
                                            type="number"
                                            value={value}
                                            onChange={e => setValue(Number(e.target.value))}
                                            className="w-full bg-system-panel border border-system-border p-2 pl-6 font-mono text-xs text-white focus:border-system-danger outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {STAT_LABELS.map(stat => (
                                        <div key={stat} className="space-y-1">
                                            <label className="text-[8px] font-mono text-system-text/40 uppercase block truncate">{stat}</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                onChange={e => setSelectedStats(prev => ({ ...prev, [stat]: -Math.abs(Number(e.target.value)) }))}
                                                className="w-full bg-system-panel border border-system-border p-1 font-mono text-[10px] text-white focus:border-system-danger outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-[9px] font-mono text-system-blue uppercase mb-1">Reason for Penalty (Honesty Required)</label>
                                <textarea
                                    required
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    className="w-full bg-system-panel border border-system-border p-2 font-mono text-[10px] text-white focus:border-system-danger outline-none h-20 resize-none"
                                    placeholder="Explain why you are penalizing yourself..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-system-danger hover:bg-red-600 text-white font-black uppercase tracking-[0.2em] transition-all text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                            >
                                <ArrowDown size={16} /> Confirm Self-Penalty
                            </button>
                            <p className="text-[8px] font-mono text-system-text/30 text-center uppercase tracking-tighter">
                                Note: This action is permanent and logged in the system records.
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Plus: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
