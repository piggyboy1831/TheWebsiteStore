const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Missing Stripe Secret Key' });
    }

    try {
      // Create a Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'One website',
              },
              unit_amount: 10000, // $100.00 (in cents)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/success.html`,
        cancel_url: `${req.headers.origin}/cancel.html`,
      });

      // Return the session ID to the frontend
      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
