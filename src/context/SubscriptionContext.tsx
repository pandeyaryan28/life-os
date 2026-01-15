import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { syncSubscription } from '../firebase/db';
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
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            handler: function (response: any) {
                // Payment successful - webhook will update Firestore
                // Show a pending state while webhook processes
                console.log('Payment successful:', response);
                setSubscription(prev => prev ? { ...prev, status: 'pending' } : {
                    planId: plan.id,
                    status: 'pending',
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    razorpayPaymentId: response.razorpay_payment_id
                });
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

    return (
        <SubscriptionContext.Provider value={{
            subscription,
            isSubscribed,
            isLoading,
            initiatePayment
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
