// Subscription Plans Configuration
export const RAZORPAY_KEY_ID = 'rzp_live_S48UJ6Qo6rL6uB';

export type PlanType = 'monthly' | 'lifetime';

export interface PlanPricing {
    INR: number;
    USD: number;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    type: PlanType;
    pricing: PlanPricing;
    description: string;
    features: string[];
    popular?: boolean;
    badge?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'monthly',
        name: 'Monthly',
        type: 'monthly',
        pricing: {
            INR: 99,
            USD: 4.86
        },
        description: 'Billed monthly, cancel anytime',
        features: [
            'Unlimited Quests & Goals',
            'Full Stat Tracking System',
            'Economy & Credits Management',
            'Daily Quest Auto-Reset',
            'Cloud Sync Across Devices',
            'Stage Progression System',
            'Meta Summaries & Analytics',
            'Email Support'
        ]
    },
    {
        id: 'lifetime',
        name: 'Lifetime Pass',
        type: 'lifetime',
        pricing: {
            INR: 999,
            USD: 48.96
        },
        description: 'One-time payment, forever access',
        popular: true,
        badge: '🔥 LIMITED OFFER',
        features: [
            'Everything in Monthly',
            'Lifetime Access - Pay Once',
            'Priority Support',
            'Early Access to New Features',
            'No Recurring Charges',
            'Best Value - Save 90%+'
        ]
    }
];

export interface SubscriptionStatus {
    planId: string;
    planType: PlanType;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    startDate: string;
    endDate: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySubscriptionId?: string;
    amount?: number;
    currency?: string;
    email?: string;
}

export const isSubscriptionActive = (subscription: SubscriptionStatus | null): boolean => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;

    // Lifetime plans never expire
    if (subscription.planType === 'lifetime') return true;

    const now = new Date();
    const endDate = new Date(subscription.endDate);

    return now < endDate;
};

// Helper to get price based on currency
export const getPlanPrice = (plan: SubscriptionPlan, currency: 'INR' | 'USD'): number => {
    return plan.pricing[currency];
};

// Helper to format price with currency symbol
export const formatPrice = (amount: number, currency: 'INR' | 'USD'): string => {
    if (currency === 'INR') {
        return `₹${amount}`;
    }
    return `$${amount}`;
};

