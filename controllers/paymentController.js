const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount, currency } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
};

module.exports = { createPaymentIntent };
