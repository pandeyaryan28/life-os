import { motion } from 'framer-motion';
import { Crown, Check, Zap, Shield, Cloud, BarChart3, Target, Clock } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '../config/subscription';

export const PricingPage: React.FC = () => {
    const { initiatePayment, subscription } = useSubscription();
    const plan = SUBSCRIPTION_PLANS[0];

    const isPending = subscription?.status === 'pending';

    const featureIcons: Record<string, React.ReactNode> = {
        'Unlimited Quests & Goals': <Target className="w-4 h-4" />,
        'Full Stat Tracking System': <BarChart3 className="w-4 h-4" />,
        'Economy & Credits Management': <Zap className="w-4 h-4" />,
        'Daily Quest Auto-Reset': <Clock className="w-4 h-4" />,
        'Cloud Sync Across Devices': <Cloud className="w-4 h-4" />,
        'Stage Progression System': <Crown className="w-4 h-4" />,
        'Meta Summaries & Analytics': <BarChart3 className="w-4 h-4" />,
        'Priority Support': <Shield className="w-4 h-4" />
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-lg w-full"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-4"
                    >
                        <Crown className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Unlock Your <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Full Potential</span>
                    </h1>
                    <p className="text-gray-400">
                        Subscribe to access all Life OS features
                    </p>
                </div>

                {/* Pricing Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative"
                >
                    {/* Popular badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                        <span className="px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30">
                            RECOMMENDED
                        </span>
                    </div>

                    <div className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5" />

                        <div className="relative p-8">
                            {/* Plan name and price */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
                                <p className="text-gray-400 text-sm mb-4">Everything you need to level up</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-lg text-gray-400">₹</span>
                                    <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-400">/month</span>
                                </div>
                            </div>

                            {/* Features list */}
                            <div className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <motion.div
                                        key={feature}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="flex items-center gap-3 text-gray-300"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                            {featureIcons[feature] || <Check className="w-4 h-4" />}
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Subscribe button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={initiatePayment}
                                disabled={isPending}
                                className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing Payment...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Zap className="w-5 h-5" />
                                        Subscribe Now
                                    </span>
                                )}
                            </motion.button>

                            {/* Trust badges */}
                            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    <span>Instant Access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    Powered by Razorpay • Cancel anytime
                </p>
            </motion.div>
        </div>
    );
};
