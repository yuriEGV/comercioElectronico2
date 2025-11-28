/* eslint-disable no-undef */

// Mocks for modules used by the controller
jest.mock('stripe', () => {
  const createMock = jest.fn();
  const Constructor = jest.fn(() => ({ paymentIntents: { create: createMock } }));
  Constructor.__createMock = createMock;
  return Constructor;
});

const Product = require('../models/Product');
const Order = require('../models/Order');

// Ensure the controller is required after the mocks
const { createOrder } = require('../controllers/orderController');

beforeEach(() => {
  jest.clearAllMocks();
});

test('createOrder throws when requested quantity exceeds inventory', async () => {
  // Product with only 1 in stock
  Product.findById = jest.fn().mockResolvedValue({
    _id: 'prod1',
    name: 'Test product',
    price: 100,
    inventory: 1,
    save: jest.fn(),
  });

  const req = {
    body: {
      items: [{ productId: 'prod1', quantity: 2 }],
      shipping: 0,
      currency: 'clp',
    },
    user: { userId: 'user1' },
  };

  const res = {}; // not used

  await expect(createOrder(req, res)).rejects.toThrow('Not enough inventory');
});

test('createOrder creates an order and calls Stripe with CLP (no cents)', async () => {
  const dbProduct = {
    _id: 'prod1',
    name: 'Prod CLP',
    price: 1000,
    inventory: 10,
    save: jest.fn().mockResolvedValue(true),
  };

  Product.findById = jest.fn().mockResolvedValue(dbProduct);

  const mockOrder = {
    _id: 'order1',
    save: jest.fn().mockResolvedValue(true),
  };
  Order.create = jest.fn().mockResolvedValue(mockOrder);

  const Stripe = require('stripe');
  Stripe.__createMock.mockResolvedValue({ id: 'pi_1', client_secret: 'cs_1', status: 'requires_payment_method' });

  const req = {
    body: {
      items: [{ productId: 'prod1', quantity: 2 }],
      shipping: 500,
      currency: 'clp',
    },
    user: { userId: 'user1' },
  };

  const jsonMock = jest.fn();
  const res = {
    status: jest.fn().mockReturnValue({ json: jsonMock }),
  };

  await createOrder(req, res);

  // subtotal: 1000 * 2 = 2000, total = 2000 + 500 = 2500
  const stripeMock = require('stripe');
  expect(stripeMock.__createMock).toHaveBeenCalledWith(expect.objectContaining({ amount: 2500, currency: 'clp' }));
  expect(res.status).toHaveBeenCalled();
  expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ orderId: mockOrder._id, clientSecret: 'cs_1' }));
});

test('createOrder converts to cents for USD currencies', async () => {
  const dbProduct = {
    _id: 'prod2',
    name: 'Prod USD',
    price: 10.5, // $10.50
    inventory: 10,
    save: jest.fn().mockResolvedValue(true),
  };

  Product.findById = jest.fn().mockResolvedValue(dbProduct);

  const mockOrder = {
    _id: 'order2',
    save: jest.fn().mockResolvedValue(true),
  };
  Order.create = jest.fn().mockResolvedValue(mockOrder);

  const Stripe = require('stripe');
  Stripe.__createMock.mockResolvedValue({ id: 'pi_2', client_secret: 'cs_2', status: 'requires_payment_method' });

  const req = {
    body: {
      items: [{ productId: 'prod2', quantity: 1 }],
      shipping: 1.75,
      currency: 'usd',
    },
    user: { userId: 'user1' },
  };

  const jsonMock = jest.fn();
  const res = {
    status: jest.fn().mockReturnValue({ json: jsonMock }),
  };

  await createOrder(req, res);

  // subtotal 10.5, shipping 1.75 => total 12.25 => cents 1225
  const stripeMock2 = require('stripe');
  expect(stripeMock2.__createMock).toHaveBeenCalledWith(expect.objectContaining({ amount: 1225, currency: 'usd' }));
  expect(res.status).toHaveBeenCalled();
  expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ orderId: mockOrder._id, clientSecret: 'cs_2' }));
});
