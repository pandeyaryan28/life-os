import { motion } from 'framer-motion';
import { Crown, Check, Zap, Shield, Cloud, BarChart3, Target, Clock, Sparkles } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_PLANS, formatPrice } from '../config/subscription';

export const PricingPage: React.FC = () => {
    const { initiatePayment, subscription, currency } = useSubscription();

    const isPending = subscription?.status === 'pending';

    const monthlyPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'monthly')!;
    const lifetimePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'lifetime')!;

    const featureIcons: Record<string, React.ReactNode> = {
        'Unlimited Quests & Goals': <Target className="w-4 h-4" />,
        'Full Stat Tracking System': <BarChart3 className="w-4 h-4" />,
        'Economy & Credits Management': <Zap className="w-4 h-4" />,
        'Daily Quest Auto-Reset': <Clock className="w-4 h-4" />,
        'Cloud Sync Across Devices': <Cloud className="w-4 h-4" />,
        'Stage Progression System': <Crown className="w-4 h-4" />,
        'Meta Summaries & Analytics': <BarChart3 className="w-4 h-4" />,
        'Email Support': <Shield className="w-4 h-4" />,
        'Everything in Monthly': <Check className="w-4 h-4" />,
        'Lifetime Access - Pay Once': <Crown className="w-4 h-4" />,
        'Priority Support': <Shield className="w-4 h-4" />,
        'Early Access to New Features': <Sparkles className="w-4 h-4" />,
        'No Recurring Charges': <Check className="w-4 h-4" />,
        'Best Value - Save 90%+': <Zap className="w-4 h-4" />
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
                className="relative z-10 max-w-3xl w-full"
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
                        Choose your plan to access all Life OS features
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Monthly Plan */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-500/5 to-gray-500/5" />
                        <div className="relative p-6">
                            <h2 className="text-xl font-bold text-white mb-1">{monthlyPlan.name}</h2>
                            <p className="text-gray-400 text-sm mb-4">{monthlyPlan.description}</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">
                                    {formatPrice(monthlyPlan.pricing[currency], currency)}
                                </span>
                                <span className="text-gray-400">/month</span>
                            </div>
                            <div className="space-y-3 mb-6">
                                {monthlyPlan.features.map((feature, index) => (
                                    <motion.div
                                        key={feature}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="flex items-center gap-3 text-gray-300"
                                    >
                                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-700/50 flex items-center justify-center text-gray-400">
                                            {featureIcons[feature] || <Check className="w-4 h-4" />}
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => initiatePayment('monthly')}
                                disabled={isPending}
                                className="w-full py-3 rounded-xl font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
                            >
                                Subscribe Monthly
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Lifetime Plan */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        {/* Popular badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                            <span className="px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg whitespace-nowrap">
                                LIMITED OFFER
                            </span>
                        </div>

                        <div className="relative bg-gradient-to-b from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/50 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5" />
                            <div className="relative p-6 pt-8">
                                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                    {lifetimePlan.name}
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                </h2>
                                <p className="text-gray-400 text-sm mb-4">{lifetimePlan.description}</p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        {formatPrice(lifetimePlan.pricing[currency], currency)}
                                    </span>
                                    <span className="text-gray-400">one-time</span>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {lifetimePlan.features.map((feature, index) => (
                                        <motion.div
                                            key={feature}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + index * 0.05 }}
                                            className="flex items-center gap-3 text-gray-300"
                                        >
                                            <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                                {featureIcons[feature] || <Check className="w-4 h-4" />}
                                            </div>
                                            <span className="text-sm">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => initiatePayment('lifetime')}
                                    disabled={isPending}
                                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5" />
                                            Get Lifetime Access
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer note */}
                <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        <span>Secure Payment via Razorpay</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>Instant Access</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
