const express = require('express');
const router = express.Router();

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// ⚠️ IMPORTANTE:
// NO usar bodyParser.raw() aquí
// app.js ya aplica express.raw() SOLO para esta ruta

router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // req.body aquí ES UN BUFFER RAW
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`⚡ Stripe webhook received: ${event.type}`);

  // Eventos que nos interesan
  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'payment_intent.payment_failed' ||
    event.type === 'payment_intent.processing'
  ) {
    const pi = event.data.object;
    const orderId = pi.metadata?.orderId;

    try {
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          // Actualiza el estado según Stripe
          if (event.type === 'payment_intent.succeeded') {
            order.paymentStatus = 'paid';
          } else if (event.type === 'payment_intent.payment_failed') {
            order.paymentStatus = 'failed';
          } else if (event.type === 'payment_intent.processing') {
            order.paymentStatus = 'processing';
          }

          order.paymentMethod =
            pi.payment_method_types?.join(', ') || 'unknown';

          await order.save();
        }
      }
    } catch (err) {
      console.error('❌ Error updating order from webhook:', err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
