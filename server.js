const express = require('express');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Use your Stripe Secret Key
const app = express();
const PORT = 3000;

app.use(express.static('public'));  // Serve your HTML file from the "public" directory
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Awesome Product',
                    },
                    unit_amount: 5000,  // Price in cents (e.g., $50.00)
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success.html`,
        cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ id: session.id });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
