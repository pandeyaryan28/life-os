import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Unlock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import type { PlayerProfile } from '../types';
import { STAGES } from '../data/stages';

interface StageOverviewProps {
    isOpen: boolean;
    onClose: () => void;
    player: PlayerProfile;
    onAdvance?: (stageId: string) => void;
}

export const StageOverview: React.FC<StageOverviewProps> = ({ isOpen, onClose, player, onAdvance }) => {
    const currentStage = STAGES.find(s => s.id === player.stageId) || STAGES[0];
    const nextStage = STAGES[STAGES.indexOf(currentStage) + 1];

    const canAdvance = nextStage && (
        (!nextStage.entryConditions.minLevel || player.level >= nextStage.entryConditions.minLevel) &&
        (!nextStage.entryConditions.minStats || Object.entries(nextStage.entryConditions.minStats).every(([stat, val]) => (player.stats as any)[stat] >= (val as number)))
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center md:p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-system-panel border-2 border-system-border w-full h-full md:h-auto md:max-w-2xl md:max-h-[80vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-system-border flex justify-between items-center bg-gradient-to-r from-system-blue/10 to-transparent">
                            <div>
                                <h2 className="text-lg md:text-2xl font-black text-white tracking-widest uppercase italic flex items-center gap-2 md:gap-3">
                                    <ShieldCheck className="text-system-blue" size={20} />
                                    Stage Progression
                                </h2>
                                <p className="text-[10px] font-mono text-system-text/40 uppercase tracking-[0.2em] mt-1">Status: {currentStage.name}</p>
                            </div>
                            <button onClick={onClose} className="p-2 active:bg-white/5 rounded-full transition-colors tap-feedback">
                                <ArrowLeft size={20} className="text-system-text/60 md:hidden" />
                                <X size={20} className="text-system-text/60 hidden md:block" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
                            {/* Current Stage Details */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-sm font-bold text-system-blue uppercase tracking-widest">Active Stage: {currentStage.name}</h3>
                                    <div className="h-px flex-1 bg-system-blue/20"></div>
                                </div>
                                <p className="text-sm text-system-text/80 leading-relaxed mb-6 font-medium italic">
                                    "{currentStage.description}"
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-mono text-green-400 uppercase tracking-widest flex items-center gap-2">
                                            <Unlock size={12} /> System Unlocks
                                        </h4>
                                        <ul className="space-y-2">
                                            {currentStage.unlocks.map((unlock, i) => (
                                                <li key={i} className="text-xs font-mono text-system-text/60 flex items-start gap-2">
                                                    <span className="text-green-500/50">▸</span> {unlock}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-mono text-system-danger uppercase tracking-widest flex items-center gap-2">
                                            <Lock size={12} /> System Restrictions
                                        </h4>
                                        <ul className="space-y-2">
                                            {currentStage.restrictions.length > 0 ? currentStage.restrictions.map((restriction, i) => (
                                                <li key={i} className="text-xs font-mono text-system-text/60 flex items-start gap-2">
                                                    <span className="text-system-danger/50">▪</span> {restriction}
                                                </li>
                                            )) : (
                                                <li className="text-xs font-mono text-system-text/30 italic">No restrictions active.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Next Stage Preview */}
                            {nextStage && (
                                <section className={`p-6 border-2 rounded-sm transition-all ${canAdvance ? 'border-system-gold bg-system-gold/5 shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'border-system-border bg-system-dark/30 opacity-60'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                                Next Evolution: {nextStage.name}
                                                {canAdvance && <span className="text-[9px] bg-system-gold text-black px-1.5 py-0.5 ml-2 font-black">READY</span>}
                                            </h3>
                                            <p className="text-xs text-system-text/60 mt-1 italic">"{nextStage.description}"</p>
                                        </div>
                                        {!canAdvance && <Lock size={18} className="text-system-text/30" />}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-[9px] font-mono text-system-text/40 uppercase tracking-widest">Admission Requirements</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {nextStage.entryConditions.minLevel && (
                                                    <div className={`px-2 py-1 rounded-sm text-[10px] font-mono border ${player.level >= nextStage.entryConditions.minLevel ? 'border-green-500/50 text-green-400' : 'border-system-text/20 text-system-text/30'}`}>
                                                        LVL: {player.level} / {nextStage.entryConditions.minLevel}
                                                    </div>
                                                )}
                                                {nextStage.entryConditions.minStats && Object.entries(nextStage.entryConditions.minStats).map(([stat, val]) => (
                                                    <div key={stat} className={`px-2 py-1 rounded-sm text-[10px] font-mono border ${(player.stats as any)[stat] >= (val as number) ? 'border-green-500/50 text-green-400' : 'border-system-text/20 text-system-text/30'}`}>
                                                        {stat.toUpperCase()}: {(player.stats as any)[stat]} / {val}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {canAdvance && (
                                            <button
                                                onClick={() => onAdvance?.(nextStage.id)}
                                                className="w-full py-3 bg-system-gold text-black font-black uppercase tracking-[0.2em] text-sm active:bg-white transition-all shadow-lg tap-feedback flex items-center justify-center gap-2"
                                            >
                                                INITIALIZE EVOLUTION <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </div>
                                </section>
                            )}

                            {!nextStage && (
                                <section className="p-10 border-2 border-dashed border-system-gold/30 flex flex-col items-center justify-center text-center bg-system-gold/5">
                                    <ShieldCheck size={48} className="text-system-gold mb-4 opacity-50" />
                                    <h3 className="text-lg font-black text-system-gold uppercase tracking-widest">Apex Stage Reached</h3>
                                    <p className="text-xs text-system-text/40 font-mono mt-2 uppercase tracking-widest">You have achieved the Architect identity.</p>
                                </section>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-system-dark/50 border-t border-system-border text-center">
                            <p className="text-[10px] font-mono text-system-text/30 uppercase tracking-[0.3em]">System Identity Layer v1.6</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
