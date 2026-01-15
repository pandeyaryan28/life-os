import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { syncSubscription, saveSubscription } from '../firebase/db';
import { RAZORPAY_KEY_ID, SUBSCRIPTION_PLANS, isSubscriptionActive, type SubscriptionStatus } from '../config/subscription';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface SubscriptionContextType {
    subscription: SubscriptionStatus | null;
    isSubscribed: boolean;
    isLoading: boolean;
    initiatePayment: () => Promise<void>;
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

    const initiatePayment = useCallback(async () => {
        if (!user) return;

        const plan = SUBSCRIPTION_PLANS[0]; // Standard plan

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: plan.price * 100, // Amount in paise
            currency: plan.currency,
            name: 'Life OS',
            description: `${plan.name} Plan - Monthly Subscription`,
            image: '/icon-192.png',
            notes: {
                userId: user.uid,
                planId: plan.id,
                userEmail: user.email || ''
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
                endDate.setMonth(endDate.getMonth() + 1);

                const subscriptionData: SubscriptionStatus = {
                    planId: plan.id,
                    status: 'active',
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id || '',
                    amount: plan.price,
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
    }, [user]);

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


