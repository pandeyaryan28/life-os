'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Zap, X, Check, Sparkles } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_PLANS, formatPrice } from '../config/subscription';

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, featureName }) => {
    const { initiatePayment, subscription, currency } = useSubscription();
    const isPending = subscription?.status === 'pending';

    if (!isOpen) return null;

    const monthlyPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'monthly')!;
    const lifetimePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'lifetime')!;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl md:rounded-2xl border border-gray-700/50 max-w-2xl w-full overflow-hidden my-4 md:my-8 max-h-[95vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button - Mobile optimized */}
                    <button
                        onClick={onClose}
                        className="sticky top-2 right-2 float-right p-2 rounded-lg text-white bg-red-500/90 hover:bg-red-600 transition-colors z-20 shadow-lg"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10 pointer-events-none" />

                    <div className="relative p-4 md:p-6 lg:p-8 clear-both">
                        {/* Header */}
                        <div className="text-center mb-4 md:mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-3 md:mb-4">
                                <Crown className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                                Unlock {featureName || 'Life OS'}
                            </h2>
                            <p className="text-gray-400 text-xs md:text-sm">
                                Choose your plan to access all features
                            </p>
                        </div>

                        {/* Plans */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {/* Monthly Plan */}
                            <div className="bg-gray-800/30 rounded-lg md:rounded-xl p-4 md:p-5 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                                <div className="mb-3 md:mb-4">
                                    <h3 className="font-semibold text-white text-base md:text-lg">{monthlyPlan.name}</h3>
                                    <p className="text-xs text-gray-400">{monthlyPlan.description}</p>
                                </div>
                                <div className="flex items-baseline gap-1 mb-3 md:mb-4">
                                    <span className="text-2xl md:text-3xl font-bold text-white">
                                        {formatPrice(monthlyPlan.pricing[currency], currency)}
                                    </span>
                                    <span className="text-gray-400 text-xs md:text-sm">/month</span>
                                </div>
                                <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                                    {monthlyPlan.features.slice(0, 4).map((feature) => (
                                        <div key={feature} className="flex items-center gap-2 text-xs text-gray-300">
                                            <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-cyan-400 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => initiatePayment('monthly')}
                                    disabled={isPending}
                                    className="w-full py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm text-white bg-gray-700 hover:bg-gray-600 transition-all disabled:opacity-50"
                                >
                                    Subscribe Monthly
                                </motion.button>
                            </div>

                            {/* Lifetime Plan */}
                            <div className="relative bg-gradient-to-b from-cyan-500/10 to-purple-500/10 rounded-lg md:rounded-xl p-4 md:p-5 border-2 border-cyan-500/50">
                                {/* Badge */}
                                <div className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white whitespace-nowrap">
                                        LIMITED OFFER
                                    </span>
                                </div>
                                <div className="mb-3 md:mb-4 pt-2">
                                    <h3 className="font-semibold text-white text-base md:text-lg flex items-center gap-2">
                                        {lifetimePlan.name}
                                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
                                    </h3>
                                    <p className="text-xs text-gray-400">{lifetimePlan.description}</p>
                                </div>
                                <div className="flex items-baseline gap-1 mb-3 md:mb-4">
                                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                        {formatPrice(lifetimePlan.pricing[currency], currency)}
                                    </span>
                                    <span className="text-gray-400 text-xs md:text-sm">one-time</span>
                                </div>
                                <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
                                    {lifetimePlan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-2 text-xs text-gray-300">
                                            <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-cyan-400 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => initiatePayment('lifetime')}
                                    disabled={isPending}
                                    className="w-full py-2.5 md:py-3 rounded-lg font-semibold text-xs md:text-sm text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            Get Lifetime Access
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        <p className="text-center text-[10px] md:text-xs text-gray-500 mt-4 md:mt-6">
                            Secure payment via Razorpay - Cancel monthly anytime
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
