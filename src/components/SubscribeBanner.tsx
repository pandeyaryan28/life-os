import { motion } from 'framer-motion';
import { Crown, Zap, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_PLANS, formatPrice } from '../config/subscription';

export const SubscribeBanner: React.FC = () => {
    const { isSubscribed, initiatePayment, subscription, currency } = useSubscription();
    const [isDismissed, setIsDismissed] = useState(false);

    const lifetimePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'lifetime')!;

    // Don't show if subscribed or dismissed
    if (isSubscribed || isDismissed) return null;

    const isPending = subscription?.status === 'pending';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-xl p-4 mb-4 overflow-hidden"
        >
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 animate-pulse" />

            <div className="relative flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                            Limited Time Offer
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </h3>
                        <p className="text-xs text-gray-400">
                            Get Lifetime Access for just {formatPrice(lifetimePlan.pricing[currency], currency)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => initiatePayment('lifetime')}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                Get Lifetime Pass
                            </>
                        )}
                    </motion.button>

                    <button
                        onClick={() => setIsDismissed(true)}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
