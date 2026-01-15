// Subscription Plans Configuration
export const RAZORPAY_KEY_ID = 'rzp_live_S48UJ6Qo6rL6uB';

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number; // in rupees
    currency: string;
    interval: 'monthly' | 'yearly';
    features: string[];
    popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'standard',
        name: 'Standard',
        price: 9, // Testing price
        currency: 'INR',
        interval: 'monthly',
        popular: true,
        features: [
            'Unlimited Quests & Goals',
            'Full Stat Tracking System',
            'Economy & Credits Management',
            'Daily Quest Auto-Reset',
            'Cloud Sync Across Devices',
            'Stage Progression System',
            'Meta Summaries & Analytics',
            'Priority Support'
        ]
    }
];

export interface SubscriptionStatus {
    planId: string;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    startDate: string;
    endDate: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySubscriptionId?: string;
    amount?: number;
    email?: string;
}

export const isSubscriptionActive = (subscription: SubscriptionStatus | null): boolean => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;

    const now = new Date();
    const endDate = new Date(subscription.endDate);

    return now < endDate;
};
