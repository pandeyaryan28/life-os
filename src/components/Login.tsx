import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login: React.FC = () => {
    const { signInAnonymously } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInAnonymously();
        } catch (err: any) {
            setError(err.message || 'Failed to initialize system session.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/30">
                            <Shield className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 font-mono italic">LIFE OS <span className="text-cyan-500">v1.4.0</span></h1>
                        <p className="text-gray-400">Initialize Neural Synchronization Protocol</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 text-red-400 text-sm flex items-start gap-3"
                            >
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    <span>INITIALIZE CORE ENGINE</span>
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest font-medium">
                            Secure Encrypted Link • Firestore Persistent Layer
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
                        <div className="text-cyan-500 text-xs font-bold mb-1 uppercase">Cloud Sync</div>
                        <div className="text-[10px] text-gray-500">Device Agnostic Data</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center">
                        <div className="text-purple-500 text-xs font-bold mb-1 uppercase">Zero Trust</div>
                        <div className="text-[10px] text-gray-500">Encrypted Persistence</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
