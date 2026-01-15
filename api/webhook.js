const crypto = require('crypto');

// Razorpay credentials (from environment variables in production)
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'EPYdM6JR3lKFl2EEBu4xqlqt';

// Firebase project config
const FIREBASE_PROJECT_ID = 'life-os-1e607';

// Verify Razorpay webhook signature
function verifySignature(body, signature) {
    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
    return expectedSignature === signature;
}

// Update Firestore via REST API
async function updateFirestore(userId, subscriptionData) {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${userId}/subscription/status`;
    
    const firestoreDoc = {
        fields: {
            planId: { stringValue: subscriptionData.planId },
            status: { stringValue: 'active' },
            startDate: { stringValue: subscriptionData.startDate },
            endDate: { stringValue: subscriptionData.endDate },
            razorpayPaymentId: { stringValue: subscriptionData.paymentId },
            razorpayOrderId: { stringValue: subscriptionData.orderId || '' },
            razorpaySubscriptionId: { stringValue: subscriptionData.subscriptionId || '' },
            amount: { integerValue: subscriptionData.amount },
            email: { stringValue: subscriptionData.email || '' },
            updatedAt: { stringValue: new Date().toISOString() }
        }
    };

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(firestoreDoc)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Firestore update failed: ${error}`);
    }

    return response.json();
}

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const signature = req.headers['x-razorpay-signature'];
        const body = req.body;

        // Verify webhook signature
        if (!verifySignature(body, signature)) {
            console.error('Invalid webhook signature');
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const event = body.event;
        const payload = body.payload;

        console.log('Razorpay webhook received:', event);

        // Handle payment.captured event
        if (event === 'payment.captured') {
            const payment = payload.payment.entity;
            const userId = payment.notes?.userId;

            if (!userId) {
                console.error('No userId in payment notes');
                return res.status(400).json({ error: 'Missing userId in notes' });
            }

            // Calculate subscription end date (1 month from now)
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);

            const subscriptionData = {
                planId: 'standard',
                paymentId: payment.id,
                orderId: payment.order_id,
                amount: payment.amount / 100, // Convert from paise to rupees
                email: payment.email,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            };

            await updateFirestore(userId, subscriptionData);
            console.log(`Subscription activated for user: ${userId}`);
        }

        // Handle subscription events (for recurring payments)
        if (event === 'subscription.activated' || event === 'subscription.charged') {
            const subscription = payload.subscription?.entity;
            const payment = payload.payment?.entity;
            const userId = subscription?.notes?.userId || payment?.notes?.userId;

            if (userId) {
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);

                const subscriptionData = {
                    planId: 'standard',
                    paymentId: payment?.id || '',
                    subscriptionId: subscription?.id || '',
                    amount: (payment?.amount || subscription?.amount || 900) / 100,
                    email: subscription?.customer_email || payment?.email || '',
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                };

                await updateFirestore(userId, subscriptionData);
                console.log(`Subscription updated for user: ${userId}`);
            }
        }

        return res.status(200).json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
};
