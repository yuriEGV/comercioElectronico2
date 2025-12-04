import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';

// Crear una orden
export const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('No items in the cart');
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError('Please provide tax and shipping fee');
  }

  let orderItems = [];
  let subtotal = 0;

  for (let item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No product with id: ${item.product}`);
    }

    const newItem = {
      name: dbProduct.name,
      image: dbProduct.image,
      price: dbProduct.price,
      amount: item.amount,
      product: item.product,
    };

    orderItems = [...orderItems, newItem];
    subtotal += item.amount * dbProduct.price;
  }

  const total = tax + shippingFee + subtotal;

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    user: req.user.userId,
  });

  res.status(201).json({ order });
};

// Obtener todas las órdenes
export const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(200).json({ count: orders.length, orders });
};

// Obtener una orden específica
export const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });

  if (!order) {
    throw new NotFoundError(`No order with id: ${req.params.id}`);
  }

  res.status(200).json({ order });
};

// Obtener órdenes del usuario actual
export const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(200).json({ count: orders.length, orders });
};

// Actualizar una orden
export const updateOrder = async (req, res) => {
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: req.params.id });

  if (!order) {
    throw new NotFoundError(`No order with id: ${req.params.id}`);
  }

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';

  await order.save();

  res.status(200).json({ order });
};
