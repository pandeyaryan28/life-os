import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Target, BarChart3, Award, AlertTriangle } from 'lucide-react';
import type { GameState } from '../types';

interface SummaryProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    type: 'WEEKLY' | 'MONTHLY';
}

export const MetaSummaries: React.FC<SummaryProps> = ({ isOpen, onClose, gameState, type }) => {
    const { player, quests } = gameState;

    // Mock data processing for demonstration (in a real app, this would be computed from history)
    const completedQuests = quests.filter(q => q.status === 'COMPLETED').length;
    const failedQuests = quests.filter(q => q.status === 'FAILED').length;
    const totalQuests = completedQuests + failedQuests;
    const successRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 100;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="bg-system-dark border-2 border-system-border w-full max-w-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-system-border flex justify-between items-center bg-gradient-to-r from-system-gold/10 via-transparent to-transparent">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase italic flex items-center gap-4">
                                    <BarChart3 className="text-system-gold" size={32} />
                                    {type} Performance Snapshot
                                </h2>
                                <p className="text-[10px] font-mono text-system-text/40 uppercase tracking-[0.4em] mt-2">Data-Driven Execution Analysis / v1.2</p>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-sm transition-colors border border-system-border/30 flex items-center gap-2 group">
                                <span className="text-xs font-mono font-bold text-system-text/60 group-hover:text-white uppercase tracking-widest">Close System</span>
                                <X size={24} className="text-system-text/60 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-12">
                            {/* High-Level Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-6 bg-white/5 border border-system-border/30 rounded-sm">
                                    <h4 className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest mb-4">Success Efficiency</h4>
                                    <div className="text-4xl font-black text-white italic">{successRate}%</div>
                                    <div className="mt-2 h-1 bg-system-border/20 rounded-full overflow-hidden">
                                        <div className={`h-full ${successRate >= 80 ? 'bg-green-500' : 'bg-system-gold'}`} style={{ width: `${successRate}%` }}></div>
                                    </div>
                                </div>
                                <div className="p-6 bg-white/5 border border-system-border/30 rounded-sm">
                                    <h4 className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest mb-4">Execution Volume</h4>
                                    <div className="text-4xl font-black text-white italic">{completedQuests}</div>
                                    <p className="text-[9px] font-mono text-system-text/30 uppercase mt-2 tracking-widest">Total Completed Quests</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-system-border/30 rounded-sm">
                                    <h4 className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest mb-4">Current Streak</h4>
                                    <div className="text-4xl font-black text-system-gold italic">{player.streak}D 🔥</div>
                                    <p className="text-[9px] font-mono text-system-text/30 uppercase mt-2 tracking-widest">Consecutive Days Active</p>
                                </div>
                            </div>

                            {/* Stat Changes */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <TrendingUp size={20} className="text-system-blue" />
                                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Stat Progression Trends</h3>
                                    <div className="h-px flex-1 bg-system-border/20"></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(player.stats).slice(0, 4).map(([stat, val]) => (
                                        <div key={stat} className="p-4 border border-system-border/10 rounded-sm">
                                            <div className="text-[8px] font-mono text-system-text/40 uppercase mb-1">{stat}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-bold text-white">{val}</span>
                                                <span className="text-[10px] text-green-400 font-mono">▲</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Bottlenecks & Weaknesses */}
                            <section className="bg-system-danger/5 border border-system-danger/20 p-8 rounded-sm">
                                <div className="flex items-center gap-4 mb-4 text-system-danger">
                                    <AlertTriangle size={20} />
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">Execution Bottleneck Detection</h3>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="text-xs text-system-text/60 font-medium leading-relaxed italic">
                                        "Based on current data, your <span className="text-white font-bold underline decoration-system-danger/40 uppercase">Failed Quests ({failedQuests})</span> correlate with low <span className="text-white font-bold uppercase underline decoration-system-danger/40">Discipline levels</span> during late-stage execution. Recommend shifting high-difficulty tasks to peak performance windows."
                                    </div>
                                </div>
                            </section>

                            {/* Long-Term Trajectory */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <Target size={20} className="text-system-gold" />
                                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Stage Readiness Forecast</h3>
                                    <div className="h-px flex-1 bg-system-border/20"></div>
                                </div>
                                <div className="p-6 border border-system-border/30 bg-system-dark/50 rounded-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-[9px] font-mono text-system-text/40 uppercase tracking-widest mb-1">Estimated Evolution Time</div>
                                        <div className="text-xl font-bold text-white uppercase tracking-widest">14 - 18 Execution Days</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[9px] font-mono text-system-text/40 uppercase tracking-widest mb-1">Target Stage</div>
                                        <div className="text-xl font-bold text-system-gold uppercase tracking-widest">Optimized</div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-system-dark border-t border-system-border flex flex-col items-center">
                            <button
                                onClick={onClose}
                                className="px-12 py-4 border-2 border-system-gold text-system-gold font-black uppercase tracking-[0.5em] text-sm hover:bg-system-gold hover:text-black transition-all active:scale-95 flex items-center gap-4 mb-6"
                            >
                                <CheckCircle2 size={18} /> Acknowledge Data
                            </button>
                            <p className="text-[9px] font-mono text-system-text/20 uppercase tracking-[0.4em]">End of Transmission / No Further Input Required</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const CheckCircle2 = ({ size }: { size: number }) => <Award size={size} />;
