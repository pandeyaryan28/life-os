import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Zap, X, Check } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '../config/subscription';

interface SubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, featureName }) => {
    const { initiatePayment, subscription } = useSubscription();
    const plan = SUBSCRIPTION_PLANS[0];
    const isPending = subscription?.status === 'pending';

    if (!isOpen) return null;

    const handleSubscribe = async () => {
        await initiatePayment();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10" />

                    <div className="relative p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                <Crown className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-white text-center mb-2">
                            Unlock This Feature
                        </h2>
                        <p className="text-gray-400 text-center text-sm mb-6">
                            {featureName ? (
                                <>Subscribe to use <span className="text-cyan-400 font-medium">{featureName}</span> and all other features</>
                            ) : (
                                <>Subscribe to unlock all Life OS features</>
                            )}
                        </p>

                        {/* Plan details */}
                        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/50">
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-semibold text-white">{plan.name} Plan</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white">₹{plan.price}</span>
                                    <span className="text-gray-400 text-sm">/month</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {plan.features.slice(0, 4).map((feature) => (
                                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                                <div className="text-xs text-gray-500 pt-1">
                                    + {plan.features.length - 4} more features
                                </div>
                            </div>
                        </div>

                        {/* Subscribe button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubscribe}
                            disabled={isPending}
                            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Subscribe Now - ₹{plan.price}/month
                                </>
                            )}
                        </motion.button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Secure payment via Razorpay
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
