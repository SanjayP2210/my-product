import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function generateOrderNumber(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let orderNumber = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderNumber += characters[randomIndex];
    }

    return orderNumber;
}
export const processPayment = async (req, res) => {
    const { amount } = req.body; // Get amount from client request
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr', // Change to your desired currency
            payment_method_types: ['card'],
            metadata: { order_id: generateOrderNumber(12), company: 'my-product' }, // Replace with your order ID
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export const sendStripeApiKey = async (req, res) => {
    res.status(200).json({ striepApiKey: process.env.STRIPE_API_KEY })
}

// get all stripe transactions
export const getAllStripePayments = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const charges = await stripe.charges.list();
        res.json({
            isError: false,
            message: 'All payments fetched successfully',
            charges
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const refundPayment = async(paymentIntentId) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
        });
        if(refund){
            return true;
        }else{
            return false;
        }
        // Update your order status in the database
        // ...
        // res.send(refund);
    } catch (error) {
        res.status(500).send(error);
    }
}
