import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Info, Mail, Globe, ArrowRight, Sparkles, LogIn, UserPlus, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Login: React.FC = () => {
    const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google authentication failed.');
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
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#050505] to-[#0f0a15] text-white flex items-center justify-center p-4 selection:bg-cyan-400/20 overflow-hidden relative">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Orbs with Animation */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -30, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 rounded-full blur-[120px]"
                />

                {/* Grain Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Glassmorphic Card with Liquid Glass Effect */}
                <div className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                    <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.15] rounded-[26px] p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl overflow-hidden">
                        {/* Shimmer Effect */}
                        <motion.div
                            animate={{
                                x: ['-200%', '200%']
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 2,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12"
                        />

                        {/* Header */}
                        <div className="flex flex-col items-center text-center mb-8 relative">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1
                                }}
                                className="relative mb-6 group/icon"
                            >
                                <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl opacity-30 blur-lg group-hover/icon:opacity-50 transition-all duration-500" />
                                <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-sm">
                                    <Shield className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                    <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-purple-400 animate-pulse" />
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl font-black tracking-tighter mb-4 font-mono"
                            >
                                <span className="bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                    LIFE
                                </span>
                                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                                    OS
                                </span>
                            </motion.h1>

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="h-[2px] w-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mb-4 rounded-full"
                            />

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-300 text-sm max-w-[320px] leading-relaxed"
                            >
                                Transform your life into an <span className="text-cyan-400 font-semibold">epic adventure</span>
                            </motion.p>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-300 text-sm flex items-start gap-3 backdrop-blur-sm"
                                >
                                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="leading-relaxed">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <form onSubmit={handleEmailAuth} className="space-y-5">
                                {/* Email Input */}
                                <div className="relative group/input">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-2xl opacity-0 group-hover/input:opacity-100 group-focus-within/input:opacity-100 blur transition-all duration-300" />
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-cyan-400 transition-colors z-10" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="relative w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-500 backdrop-blur-sm"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="relative group/input">
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-2xl opacity-0 group-hover/input:opacity-100 group-focus-within/input:opacity-100 blur transition-all duration-300" />
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-purple-400 transition-colors z-10" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="relative w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl pl-12 pr-12 py-4 text-sm text-white focus:outline-none focus:border-purple-400/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-500 backdrop-blur-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative w-full group/btn overflow-hidden rounded-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                    <motion.div
                                        animate={{
                                            x: ['0%', '100%']
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                    />
                                    <div className="relative flex items-center justify-center gap-3 py-4 font-bold text-black disabled:opacity-50">
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                                <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </div>
                                </motion.button>

                                {/* Toggle Auth Mode */}
                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsRegistering(!isRegistering);
                                            setError(null);
                                        }}
                                        className="text-sm text-gray-400 hover:text-cyan-400 transition-colors group/toggle inline-flex items-center gap-2"
                                    >
                                        {isRegistering ? (
                                            <>
                                                Already have an account?
                                                <span className="text-cyan-400 font-semibold group-hover/toggle:underline">Sign In</span>
                                            </>
                                        ) : (
                                            <>
                                                Don't have an account?
                                                <span className="text-purple-400 font-semibold group-hover/toggle:underline">Sign Up</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Divider */}
                            <div className="relative py-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-4 text-xs text-gray-500 uppercase tracking-widest font-semibold backdrop-blur-sm">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Google Login */}
                            <motion.button
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 group/google backdrop-blur-sm"
                            >
                                <Globe className="w-5 h-5 text-cyan-400 group-hover/google:rotate-12 transition-transform duration-300" />
                                <span>Continue with Google</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 flex justify-between items-center px-4"
                >
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping absolute" />
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">System Online</span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-600 uppercase tracking-wider">v1.5.35</span>
                </motion.div>
            </motion.div>
        </div>
    );
};
