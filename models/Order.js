const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number,
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [ItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'clp' }, // o 'usd' según necesites
  paymentStatus: {
    type: String,
    enum: ['pending', 'requires_payment_method', 'processing', 'paid', 'failed'],
    default: 'pending',
  },
  paymentIntentId: String, // Stripe PaymentIntent id
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} }, // para guardar info extra
});

module.exports = mongoose.model('Order', OrderSchema);
