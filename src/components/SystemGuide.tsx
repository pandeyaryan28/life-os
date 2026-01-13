import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Target, Zap, HelpCircle, Layers } from 'lucide-react';
import { STAGES } from '../data/stages';

interface SystemGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SystemGuide: React.FC<SystemGuideProps> = ({ isOpen, onClose }) => {
    // Esc key support
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-system-panel border-2 border-system-border w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-system-border flex justify-between items-center bg-system-blue/5">
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-system-blue" size={24} />
                            <div>
                                <h2 className="text-xl font-black text-white tracking-widest uppercase italic">System Guide & Manual</h2>
                                <p className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest mt-1">LIFE OS v1.5.0 // Documentation Layer</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors border border-system-border/30 text-system-text/60 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-10 font-sans">
                        {/* Intro */}
                        <section>
                            <h3 className="text-sm font-black text-system-blue uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <HelpCircle size={16} /> What is LIFE OS?
                            </h3>
                            <p className="text-sm text-system-text/80 leading-relaxed bg-white/5 p-4 border border-system-border/30 border-l-4 border-l-system-blue italic">
                                LIFE OS is a gamified life management framework designed to translate real-world effort into digital progress. It provides a structured environment for tracking objectives, managing resources, and visualizing personal evolution.
                            </p>
                        </section>

                        {/* Core Systems */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="space-y-4">
                                <h3 className="text-sm font-black text-system-gold uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Target size={16} /> Quests & Objectives
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-system-dark/50 border border-system-border/30 rounded-sm">
                                        <p className="text-[11px] font-bold text-white uppercase mb-1">MAIN QUESTS</p>
                                        <p className="text-[10px] text-system-text/60 leading-relaxed">High-priority milestones or long-term commitments. Crucial for significant level advancement.</p>
                                    </div>
                                    <div className="p-3 bg-system-dark/50 border border-system-border/30 rounded-sm">
                                        <p className="text-[11px] font-bold text-white uppercase mb-1">SIDE QUESTS</p>
                                        <p className="text-[10px] text-system-text/60 leading-relaxed">Minor tasks or spontaneous objectives. Ideal for quick XP and Stat gains.</p>
                                    </div>
                                    <div className="p-3 bg-system-dark/50 border border-system-border/30 rounded-sm">
                                        <p className="text-[11px] font-bold text-white uppercase mb-1">DAILY QUESTS</p>
                                        <p className="text-[10px] text-system-text/60 leading-relaxed">Recurring routines. Must be completed before 00:00 local time to maintain streaks.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Zap size={16} className="text-cyan-400" /> Progression Mechanics
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-system-dark/50 border border-system-border/30 rounded-sm">
                                        <p className="text-[11px] font-bold text-white uppercase mb-1">XP & LEVELS</p>
                                        <p className="text-[10px] text-system-text/60 leading-relaxed">Experience gained from completing quests. Leveling up marks overall maturity of the OS profile.</p>
                                    </div>
                                    <div className="p-3 bg-system-dark/50 border border-system-border/30 rounded-sm">
                                        <p className="text-[11px] font-bold text-white uppercase mb-1">CREDITS</p>
                                        <p className="text-[10px] text-system-text/60 leading-relaxed">Numerical representation of real-world liquidity. Used for expense tracking and system rewards.</p>
                                    </div>
                                    <div className="p-3 bg-system-dark/50 border border-system-border/30 rounded-sm">
                                        <p className="text-[11px] font-bold text-white uppercase mb-1">MACRO OBJECTIVES</p>
                                        <p className="text-[10px] text-system-text/60 leading-relaxed">Containers for multiple quests. Used to track long-term goals and project-based progress.</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Stage Documentation */}
                        <section>
                            <h3 className="text-sm font-black text-system-blue uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Layers size={16} /> Evolution Stage Documentation
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {STAGES.map((stage) => (
                                    <div key={stage.id} className="p-5 border border-system-border/30 bg-system-dark/30 rounded-sm space-y-4">
                                        <div className="border-b border-system-border/30 pb-2">
                                            <h4 className="text-xs font-black text-white uppercase tracking-widest">{stage.name}</h4>
                                            <p className="text-[9px] font-mono text-system-text/40 mt-1 italic uppercase">{stage.id === 'awakened' ? 'Default Stage' : `Req: Level ${stage.entryConditions.minLevel}`}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[8px] font-mono text-green-400 uppercase tracking-widest mb-1">Unlocks</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {stage.unlocks.map((u, i) => (
                                                        <span key={i} className="text-[8px] bg-green-500/5 text-green-500/40 px-1 border border-green-500/10 rounded-sm">{u}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            {stage.restrictions.length > 0 && (
                                                <div>
                                                    <p className="text-[8px] font-mono text-system-danger uppercase tracking-widest mb-1">Restrictions</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {stage.restrictions.map((r, i) => (
                                                            <span key={i} className="text-[8px] bg-red-500/5 text-red-500/40 px-1 border border-red-500/10 rounded-sm">{r}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-system-dark border-t border-system-border flex flex-col items-center">
                        <button
                            onClick={onClose}
                            className="px-10 py-3 bg-system-blue text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all active:scale-95 shadow-lg"
                        >
                            Understood
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
