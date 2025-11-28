const Order = require('../models/Order');
const Product = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createOrder = async (req, res) => {
  const { items, shipping = 0, currency = 'clp' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new CustomError.BadRequestError('No items provided');
  }

  // Validate items and build orderItems using authoritative product data
  const zeroDecimalCurrencies = [
    'bif','clp','djf','gnf','jpy','kmf','krw','mga','pyg','rwf','vnd','vuv','xaf','xof','xpf'
  ];

  const amountToStripe = (amount, currency) => {
    // For zero-decimal currencies pass integer amount, otherwise pass cents
    const lower = (currency || 'clp').toLowerCase();
    if (zeroDecimalCurrencies.includes(lower)) return Math.round(amount);
    return Math.round(amount * 100); // e.g. USD -> cents
  };

  let orderItems = [];
  let subtotal = 0;

  for (const it of items) {
    if (!it.quantity || !it.productId) {
      throw new CustomError.BadRequestError(
        'Each item must include productId and quantity'
      );
    }

    const dbProduct = await Product.findById(it.productId);
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id : ${it.productId}`);
    }

    if (dbProduct.inventory < it.quantity) {
      throw new CustomError.BadRequestError(
        `Not enough inventory for product ${dbProduct._id}. Available: ${dbProduct.inventory}, requested: ${it.quantity}`
      );
    }

    const singleOrderItem = {
      productId: dbProduct._id,
      name: dbProduct.name,
      price: dbProduct.price,
      quantity: it.quantity,
    };

    // update inventory (simple decrement) and save
    dbProduct.inventory = dbProduct.inventory - it.quantity;
    await dbProduct.save();

    orderItems.push(singleOrderItem);
    subtotal += dbProduct.price * it.quantity; // enforce DB price
  }
  const total = subtotal + Number(shipping || 0);

  // create order in DB with pending payment status
  const order = await Order.create({
    user: req.user?.userId || null,
    items: orderItems,
    subtotal,
    shipping,
    total,
    currency,
    paymentStatus: 'pending',
  });

  // return the order and totals; payment will be initiated with Webpay/Onepay
  res.status(StatusCodes.CREATED).json({
    orderId: order._id,
    total: order.total,
    currency: order.currency,
    message: 'Order created. Proceed to payment.'
  });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId, transactionId, method } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  // support multiple payment confirmation fields
  if (paymentIntentId) order.paymentIntentId = paymentIntentId;
  if (transactionId) order.paymentIntentId = transactionId;
  if (method) order.paymentMethod = method;
  order.paymentStatus = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
