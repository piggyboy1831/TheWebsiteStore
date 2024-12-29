const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Log the Stripe Secret Key (only for debugging locally)
    console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

    if (!process.env.STRIPE_SECRET_KEY) {
      // If the key is missing, log an error and return a response
      console.error('Stripe Secret Key is missing!');
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
                name: 'Awesome Product',
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

      // Log the session id for debugging
      console.log('Checkout session created:', session.id);

      // Return the session ID to the frontend
      res.status(200).json({ id: session.id });
    } catch (err) {
      // Log the full error to the console
      console.error('Error creating checkout session:', err);

      // Return error response to frontend
      res.status(500).json({ error: err.message });
    }
  } else {
    // If method is not POST, return 405
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
