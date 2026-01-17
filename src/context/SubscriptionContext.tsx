import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { syncSubscription, saveSubscription } from '../firebase/db';
import {
    RAZORPAY_KEY_ID,
    SUBSCRIPTION_PLANS,
    isSubscriptionActive,
    type SubscriptionStatus
} from '../config/subscription';

declare global {
    interface Window {
        Razorpay: any;
    }
}

type Currency = 'INR' | 'USD';

// Auto-detect currency based on timezone
const detectCurrency = (): Currency => {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // India timezones
        if (timezone.includes('Kolkata') || timezone.includes('Calcutta') || timezone.includes('Asia/Kolkata')) {
            return 'INR';
        }
        return 'USD';
    } catch {
        return 'INR'; // Default to INR
    }
};

interface SubscriptionContextType {
    subscription: SubscriptionStatus | null;
    isSubscribed: boolean;
    isLoading: boolean;
    currency: Currency;
    initiatePayment: (planId: string) => Promise<void>;
    // Feature gating
    showSubscribeModal: boolean;
    subscribeModalFeature: string;
    requireSubscription: (featureName: string) => boolean;
    closeSubscribeModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [subscribeModalFeature, setSubscribeModalFeature] = useState('');
    const [currency] = useState<Currency>(detectCurrency);

    // Sync subscription status from Firestore
    useEffect(() => {
        if (!user) {
            setSubscription(null);
            setIsLoading(false);
            return;
        }

        const unsubscribe = syncSubscription(user.uid, (sub) => {
            setSubscription(sub);
            setIsLoading(false);
        });

        return unsubscribe;
    }, [user]);

    const initiatePayment = useCallback(async (planId: string) => {
        if (!user) return;

        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        if (!plan) return;

        const price = plan.pricing[currency];
        const razorpayCurrency = currency;

        // For USD, Razorpay needs amount in cents (smallest unit)
        // For INR, Razorpay needs amount in paise (smallest unit)
        const amount = currency === 'INR' ? price * 100 : Math.round(price * 100);

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: amount,
            currency: razorpayCurrency,
            name: 'Life OS',
            description: plan.type === 'lifetime'
                ? 'Lifetime Pass - One-time Payment'
                : `${plan.name} - Monthly Subscription`,
            image: '/icon-192.png',
            notes: {
                userId: user.uid,
                planId: plan.id,
                planType: plan.type,
                userEmail: user.email || '',
                currency: currency
            },
            prefill: {
                email: user.email || '',
                name: user.displayName || ''
            },
            theme: {
                color: '#06b6d4' // Cyan theme
            },
            handler: async function (response: any) {
                // Payment successful - save directly to Firestore
                console.log('Payment successful:', response);

                const startDate = new Date();
                const endDate = new Date();

                // Lifetime = 100 years, Monthly = 1 month
                if (plan.type === 'lifetime') {
                    endDate.setFullYear(endDate.getFullYear() + 100);
                } else {
                    endDate.setMonth(endDate.getMonth() + 1);
                }

                const subscriptionData: SubscriptionStatus = {
                    planId: plan.id,
                    planType: plan.type,
                    status: 'active',
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id || '',
                    amount: price,
                    currency: currency,
                    email: user.email || ''
                };

                // Save to Firestore
                await saveSubscription(user.uid, subscriptionData);
                setSubscription(subscriptionData);
                setShowSubscribeModal(false);
            },
            modal: {
                ondismiss: function () {
                    console.log('Payment modal closed');
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }, [user, currency]);

    const isSubscribed = isSubscriptionActive(subscription);

    // Check if user can use feature, show modal if not subscribed
    const requireSubscription = useCallback((featureName: string): boolean => {
        if (isSubscribed) return true;
        setSubscribeModalFeature(featureName);
        setShowSubscribeModal(true);
        return false;
    }, [isSubscribed]);

    const closeSubscribeModal = useCallback(() => {
        setShowSubscribeModal(false);
        setSubscribeModalFeature('');
    }, []);

    return (
        <SubscriptionContext.Provider value={{
            subscription,
            isSubscribed,
            isLoading,
            currency,
            initiatePayment,
            showSubscribeModal,
            subscribeModalFeature,
            requireSubscription,
            closeSubscribeModal
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
