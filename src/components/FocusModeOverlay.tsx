import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, EyeOff, CheckCircle2, Timer } from 'lucide-react';

interface FocusModeOverlayProps {
    isActive: boolean;
    onExit: () => void;
    durationSeconds: number;
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({ isActive, onExit, durationSeconds }) => {
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-system-dark flex items-center justify-center p-6 overflow-hidden"
                >
                    {/* Background Minimal Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-5"
                        style={{ backgroundImage: 'linear-gradient(var(--system-border) 1px, transparent 1px), linear-gradient(90deg, var(--system-border) 1px, transparent 1px)', backgroundSize: '100px 100px' }}>
                    </div>

                    <div className="relative text-center max-w-lg w-full">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-center">
                                <div className="bg-system-blue/10 p-4 rounded-full border border-system-blue/30 relative">
                                    <Zap className="text-system-blue animate-pulse" size={48} />
                                    <div className="absolute -inset-4 bg-system-blue/10 blur-xl rounded-full -z-10"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-black text-white tracking-[0.3em] uppercase italic">Focus Mode</h1>
                                <p className="text-[10px] font-mono text-system-text/40 uppercase tracking-[0.5em]">Cognitive Resource Allocation Active</p>
                            </div>

                            <div className="py-10 bg-system-dark/50 border-y border-system-border/20">
                                <div className="text-6xl font-mono font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    {formatTime(durationSeconds)}
                                </div>
                                <div className="text-[10px] font-mono text-system-gold uppercase tracking-[0.3em] mt-4 flex items-center justify-center gap-2">
                                    <Timer size={12} /> Execution Duration
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-system-border/20 bg-white/5 rounded-sm">
                                    <EyeOff size={20} className="text-system-text/40 mb-2 mx-auto" />
                                    <p className="text-[9px] font-mono text-system-text/40 uppercase tracking-widest leading-relaxed">Distractions Restricted</p>
                                </div>
                                <div className="p-4 border border-system-border/20 bg-white/5 rounded-sm">
                                    <CheckCircle2 size={20} className="text-system-text/40 mb-2 mx-auto" />
                                    <p className="text-[9px] font-mono text-system-text/40 uppercase tracking-widest leading-relaxed">Execution Optimized</p>
                                </div>
                            </div>

                            <button
                                onClick={onExit}
                                className="group relative px-10 py-4 bg-transparent border border-system-border/40 hover:border-system-gold transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 text-[10px] font-mono font-black text-system-text/60 group-hover:text-system-gold uppercase tracking-[0.4em]">Initialize Termination</span>
                                <div className="absolute inset-0 bg-system-gold/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            </button>
                        </motion.div>
                    </div>

                    {/* Scanline Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-10"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
