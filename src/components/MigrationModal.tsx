import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Database, CloudUpload, ArrowRight, X } from 'lucide-react';

interface MigrationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onCancel}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 border border-cyan-500/20">
                                <Database className="w-8 h-8 text-cyan-400" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2 font-mono uppercase tracking-tight">Legacy Data Detected</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                We've found existing system data on this device. Would you like to synchronize your local stats, quests, and goals to the Cloud?
                            </p>

                            <div className="w-full bg-white/5 border border-white/5 rounded-xl p-4 mb-8 grid grid-cols-3 items-center gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Local</div>
                                    <div className="text-xs text-white">Browser Storage</div>
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight className="w-4 h-4 text-cyan-500" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-[10px] text-cyan-500 uppercase font-bold mb-1">Cloud</div>
                                    <div className="text-xs text-white">Firestore DB</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button
                                    onClick={onCancel}
                                    className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Bypas
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <CloudUpload className="w-4 h-4" /> Synchronize
                                </button>
                            </div>

                            <div className="mt-6 flex items-start gap-2 text-left">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-gray-500 uppercase leading-snug tracking-wider">
                                    Warning: Migration is a one-time operation. Current cloud data (if any) will be merged with local data.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
