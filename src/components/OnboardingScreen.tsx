import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Globe, ArrowRight, Shield } from 'lucide-react';

interface OnboardingScreenProps {
    onComplete: (data: { firstName: string; lastName?: string; age?: number; timezone: string }) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName) return;
        onComplete({
            firstName,
            lastName: lastName || undefined,
            age: age === '' ? undefined : age,
            timezone
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-10"
            >
                <div className="bg-[#111]/80 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4 border border-cyan-500/20">
                            <Shield className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter mb-2 font-mono italic">
                            IDENTITY <span className="text-cyan-500">SETUP</span>
                        </h1>
                        <p className="text-gray-300 text-[10px] uppercase tracking-[0.2em] font-mono font-bold">Initialize your neural identifier</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="onboarding-first-name" className="block text-[10px] font-mono text-cyan-500 uppercase mb-2 tracking-widest px-1 font-bold">First Name (Mandatory)</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        id="onboarding-first-name"
                                        required
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-mono placeholder:text-gray-500"
                                        placeholder="e.g. Aryan"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="onboarding-last-name" className="block text-[10px] font-mono text-gray-300 uppercase mb-2 tracking-widest px-1">Last Name</label>
                                    <input
                                        id="onboarding-last-name"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-mono placeholder:text-gray-500"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="onboarding-age" className="block text-[10px] font-mono text-gray-300 uppercase mb-2 tracking-widest px-1">Age</label>
                                    <input
                                        id="onboarding-age"
                                        type="number"
                                        value={age}
                                        onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-mono placeholder:text-gray-500"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="onboarding-timezone" className="block text-[10px] font-mono text-gray-300 uppercase mb-2 tracking-widest px-1">Timezone</label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        id="onboarding-timezone"
                                        value={timezone}
                                        onChange={e => setTimezone(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.2)] uppercase tracking-[0.2em] group"
                        >
                            <span>Initialize Sync</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                            <span>Identity data is stored in the neural persistence layer (Firestore). No gamification of identity fields.</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
