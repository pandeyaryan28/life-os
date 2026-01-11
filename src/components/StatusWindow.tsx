import React, { useEffect, useState, useRef } from 'react';
import type { PlayerProfile } from '../types';
import { Activity, Brain, Zap, Target, BookOpen, DollarSign, Smile, Shield, Info, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES } from '../data/stages';

interface StatusWindowProps {
    player: PlayerProfile;
    onViewStage: () => void;
}

const StatRow: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => {
    const prevValue = useRef(value);
    const [delta, setDelta] = useState<number | null>(null);

    useEffect(() => {
        if (prevValue.current !== value) {
            const diff = value - prevValue.current;
            setDelta(diff);
            prevValue.current = value;
            const timer = setTimeout(() => setDelta(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [value]);

    return (
        <div className="flex items-center justify-between py-2 border-b border-system-border/30 last:border-0 group">
            <div className="flex items-center gap-2 text-system-text/80">
                <span className="text-system-blue group-hover:text-white transition-colors">{icon}</span>
                <span className="font-mono text-[11px] uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <AnimatePresence>
                    {delta !== null && (
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`font-mono text-[10px] font-bold ${delta > 0 ? 'text-green-400' : 'text-system-danger'}`}
                        >
                            {delta > 0 ? `+${delta}` : delta}
                        </motion.span>
                    )}
                </AnimatePresence>
                <div className="w-20 h-1 bg-system-dark border border-system-border/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(value, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-system-blue shadow-[0_0_8px_rgba(0,170,255,0.4)]"
                    />
                </div>
                <span className="font-mono text-system-gold font-bold w-6 text-right text-xs">{value}</span>
            </div>
        </div>
    );
};

export const StatusWindow: React.FC<StatusWindowProps> = ({ player, onViewStage }) => {
    const prevLevel = useRef(player.level);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const currentStage = STAGES.find(s => s.id === player.stageId) || STAGES[0];

    useEffect(() => {
        if (player.level > prevLevel.current) {
            setShowLevelUp(true);
            prevLevel.current = player.level;
            const timer = setTimeout(() => setShowLevelUp(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [player.level]);

    const timeInStage = Math.floor((new Date().getTime() - new Date(player.stageStartedAt).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-system-panel border-2 border-system-border p-6 rounded-sm shadow-2xl relative overflow-hidden group">
            {/* Background scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-system-blue to-transparent opacity-30 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-6 relative">
                <div>
                    <h2 className="text-xl font-black text-white tracking-widest uppercase italic">{player.name}</h2>
                    <button
                        onClick={onViewStage}
                        className="flex items-center gap-1.5 text-system-blue font-mono text-[10px] uppercase tracking-[0.2em] mt-1 group-hover:text-blue-400 transition-colors"
                    >
                        {currentStage.name} <Info size={10} />
                    </button>
                    <p className="text-[8px] font-mono text-system-text/30 uppercase mt-0.5">{timeInStage} DAYS IN STAGE</p>
                </div>
                <div className="text-right flex flex-col items-end">
                    <p className="text-[10px] text-system-text/40 font-mono uppercase tracking-widest mb-1">LVL</p>
                    <div className="relative">
                        <p className="text-4xl font-black text-system-gold italic drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] leading-none">{player.level}</p>
                        <AnimatePresence>
                            {showLevelUp && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.2, opacity: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute -top-6 -right-2 text-[10px] bg-system-gold text-black px-2 py-0.5 font-bold whitespace-nowrap z-10"
                                >
                                    LEVEL UP!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Consistency Engine Indicator */}
            <div className="mb-6 flex gap-2 items-center p-2 bg-system-dark/50 border border-system-border/30 rounded-sm">
                <div className="bg-system-blue/20 p-1.5 rounded-sm">
                    <Shield size={16} className="text-system-blue" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-mono text-system-text/50 uppercase tracking-widest">Consistency</span>
                        <span className={`text-[10px] font-mono font-bold ${player.consistencyScore >= 80 ? 'text-green-400' : 'text-system-gold'}`}>
                            {player.consistencyScore}%
                        </span>
                    </div>
                    <div className="h-1 bg-system-dark rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${player.consistencyScore >= 80 ? 'bg-green-500' : 'bg-system-gold'}`}
                            style={{ width: `${player.consistencyScore}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6 p-3 bg-system-dark/30 border border-system-border/20 rounded-sm">
                <div className="flex justify-between text-[10px] font-mono mb-2">
                    <span className="text-system-text/40 tracking-widest uppercase">Experience</span>
                    <span className="text-system-gold">{player.xp} <span className="text-system-text/20">/</span> {player.maxXp}</span>
                </div>
                <div className="h-1.5 bg-system-dark rounded-full overflow-hidden border border-system-border/30">
                    <motion.div
                        initial={false}
                        animate={{ width: `${(player.xp / player.maxXp) * 100}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 15 }}
                        className="h-full bg-system-gold shadow-[0_0_12px_rgba(255,215,0,0.4)]"
                    />
                </div>
            </div>

            <div className="space-y-0.5 mb-6">
                <StatRow label="Physical" value={player.stats.physical} icon={<Activity size={14} />} />
                <StatRow label="Mental" value={player.stats.mental} icon={<Brain size={14} />} />
                <StatRow label="Discipline" value={player.stats.discipline} icon={<Target size={14} />} />
                <StatRow label="Knowledge" value={player.stats.knowledge} icon={<BookOpen size={14} />} />
                <StatRow label="Energy" value={player.stats.energy} icon={<Zap size={14} />} />
                <StatRow label="Wealth" value={player.stats.wealth} icon={<DollarSign size={14} />} />
                <StatRow label="Social" value={player.stats.social} icon={<Smile size={14} />} />
            </div>

            {/* Skills & Traits Preview */}
            {(player.skills.length > 0 || player.traits.length > 0) && (
                <div className="mb-6 space-y-4 pt-4 border-t border-system-border/30">
                    {player.skills.length > 0 && (
                        <div>
                            <div className="text-[9px] font-mono text-system-text/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Award size={10} className="text-system-gold" /> Active Skills
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {player.skills.map(skill => (
                                    <div key={skill.id} className="p-2 bg-system-dark/30 border border-system-border/20 rounded-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] text-white font-bold">{skill.name}</span>
                                            <span className="text-[9px] text-system-gold font-mono">LVL {skill.level}</span>
                                        </div>
                                        <div className="h-0.5 bg-system-dark rounded-full overflow-hidden">
                                            <div className="h-full bg-system-gold" style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {player.traits.filter(t => !t.isHidden).length > 0 && (
                        <div>
                            <div className="text-[9px] font-mono text-system-text/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Star size={10} className="text-system-blue" /> Behavior Traits
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {player.traits.filter(t => !t.isHidden).map(trait => (
                                    <div key={trait.id} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm text-[9px] text-system-text/60 font-mono uppercase">
                                        {trait.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-system-border flex justify-between items-center bg-gradient-to-t from-white/5 to-transparent -mx-6 -mb-6 px-6 pb-6 shadow-up">
                <div className="text-[10px] font-mono text-system-text/40 uppercase tracking-widest">Credits</div>
                <div className="text-system-gold font-mono font-black flex items-center gap-2">
                    <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,215,0,0.2)]">{player.credits.toLocaleString()}</span>
                    <span className="text-xs text-system-text/40">C</span>
                </div>
            </div>
        </div>
    );
};
