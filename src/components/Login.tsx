'use client';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Info, Mail, Globe, ArrowRight, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFirebaseAuth } from '../firebase/config';

interface LoginProps {
    initialMode?: 'REGISTER';
}

export const Login: React.FC<LoginProps> = ({ initialMode }) => {
    const { signInAnonymously, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'SELECT' | 'EMAIL' | 'ANONYMOUS'>(initialMode === 'REGISTER' ? 'EMAIL' : 'SELECT');
    const [isRegistering, setIsRegistering] = useState(initialMode === 'REGISTER');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            // Check if user definitely signed in despite error
            const auth = getFirebaseAuth();
            if (auth?.currentUser) return;

            // Ignore widely known mobile popup cancellations/closings that are harmless
            if (err.code === 'auth/popup-closed-by-user' ||
                err.code === 'auth/cancelled-popup-request' ||
                err.message?.includes('closed by user')) {
                return;
            }

            console.error("Google Auth Error:", err);
            setError(err.message || 'Google synchronization failed.');
        } finally {
            // If logged in, keep loading state until unmount/redirect
            const auth = getFirebaseAuth();
            if (!auth?.currentUser) {
                setLoading(false);
            }
        }
    };

    const handleAnonymousLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInAnonymously();
        } catch (err: any) {
            setError(err.message || 'Quick Start link failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isRegistering) {
                await signUpWithEmail(email, password);
            } else {
                await signInWithEmail(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] relative z-10"
            >
                <div className="bg-[#111]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                        >
                            <Shield className="w-10 h-10 text-cyan-400" />
                        </motion.div>
                        <h1 className="text-4xl font-black tracking-tighter mb-3 font-mono italic">
                            LIFE <span className="text-cyan-500">OS</span>
                        </h1>
                        <div className="h-[1px] w-12 bg-cyan-500/30 mb-3" />
                        <p className="text-gray-300 text-sm max-w-[280px]">Establish your interface within the neural persistence layer.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-red-400 text-xs flex items-start gap-4"
                            >
                                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {mode === 'SELECT' && (
                            <motion.div
                                key="select-mode"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Globe className="w-5 h-5" />
                                    <span>Sync via Neural Cluster (Google)</span>
                                </button>

                                <button
                                    onClick={() => setMode('EMAIL')}
                                    disabled={loading}
                                    className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 hover:bg-white/10 active:scale-[0.98]"
                                >
                                    <Mail className="w-5 h-5 text-purple-400" />
                                    <span>Establish Neural Link (Email)</span>
                                </button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/5"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold bg-[#111] px-4">
                                        Legacy Port
                                    </div>
                                </div>

                                <button
                                    onClick={() => setMode('ANONYMOUS')}
                                    disabled={loading}
                                    className="w-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 hover:bg-cyan-500/20 group"
                                >
                                    <UserCircle2 className="w-5 h-5 group-hover:animate-pulse" />
                                    <span>Quick Start Protocol</span>
                                </button>
                                <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed tracking-wider italic">
                                    Recommended: Neural accounts provide device-agnostic synchronisation.
                                </p>
                            </motion.div>
                        )}

                        {mode === 'EMAIL' && (
                            <motion.div
                                key="email-mode"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <label htmlFor="email" className="sr-only">Email</label>
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="Neural Identifier"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-500"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label htmlFor="password" className="sr-only">Password</label>
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                id="password"
                                                type="password"
                                                placeholder="Interface Access Key"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>{isRegistering ? 'INITIALIZE NEW LINK' : 'ESTABLISH LINK'}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex flex-col gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsRegistering(!isRegistering)}
                                            className="text-[10px] text-gray-400 hover:text-cyan-400 transition-colors uppercase tracking-widest font-bold"
                                        >
                                            {isRegistering ? 'Switch to authentication' : 'Switch to registration protocol'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMode('SELECT')}
                                            className="text-[10px] text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] font-medium"
                                        >
                                            Return to Uplink
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {mode === 'ANONYMOUS' && (
                            <motion.div
                                key="anon-mode"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center"
                            >
                                <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6 mb-8">
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                                        <UserCircle2 className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Protocol Breakdown</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Initializes an ephemeral session linked to this browser only. Data will not persist across different neural nodes (devices).
                                    </p>
                                </div>

                                <button
                                    onClick={handleAnonymousLogin}
                                    disabled={loading}
                                    className="w-full bg-cyan-500 text-black font-bold py-4 rounded-2xl transition-all hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin mx-auto" />
                                    ) : (
                                        'EXECUTE QUICK START'
                                    )}
                                </button>

                                <button
                                    onClick={() => setMode('SELECT')}
                                    className="mt-6 text-[10px] text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] font-bold"
                                >
                                    Return to Uplink
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col gap-4 px-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Master Node: Active</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">v1.8.3</span>
                    </div>
                    <div className="flex justify-center items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        <a href="/support" className="hover:text-cyan-400 transition-colors">Support</a>
                        <span className="text-white/10">|</span>
                        <a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
