const QRCode = require('qrcode');
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');

// Simple mocked Onepay flow using QR codes stored in DB metadata
exports.initOnepay = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount || !orderId) return res.status(400).json({ msg: 'Missing amount or orderId' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    // create a reference token and store in order metadata
    const reference = uuidv4();
    order.metadata = order.metadata || {};
    order.metadata.onepayReference = reference;
    await order.save();

    // create QR payload (simple string) and a dataURI image
    const qrContent = JSON.stringify({ reference, orderId: order._id.toString(), amount });
    const qrImage = await QRCode.toDataURL(qrContent);

    res.json({ reference, qrContent, qrImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating Onepay QR' });
  }
};

exports.commitOnepay = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ msg: 'Missing reference' });

    // find order with this reference
    const order = await Order.findOne({ 'metadata.onepayReference': reference });
    if (!order) return res.status(404).json({ msg: 'Order not found for reference' });

    order.paymentStatus = 'paid';
    order.paymentMethod = 'onepay';
    order.paymentIntentId = reference; // store the reference
    await order.save();

    res.json({ success: true, orderId: order._id, status: order.paymentStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error committing Onepay payment' });
  }
};
