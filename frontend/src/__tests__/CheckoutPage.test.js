import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Jest mocks must be declared before importing the module-under-test

jest.mock('../api', () => ({
  apiFetch: jest.fn(),
}));

jest.mock('../utils/cart', () => ({
  getCartKey: jest.fn(() => 'cart:test'),
  readCart: jest.fn(() => [
    { _id: 'p1', name: 'One', price: 10, qty: 2 }
  ])
}));

// mock stripe libs
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({ mock: true })),
}));

jest.mock('@stripe/react-stripe-js', () => {
  // require React INSIDE the factory so jest hoisting doesn't try to read an out-of-scope variable
  const React = require('react');
  const confirmCardPayment = jest.fn(() => Promise.resolve({ paymentIntent: { id: 'pi_123', status: 'succeeded' } }));
  return {
    Elements: ({ children }) => React.createElement('div', { 'data-testid': 'elements-wrapper' }, children),
    CardElement: () => React.createElement('div', { 'data-testid': 'card-element' }),
    useStripe: () => ({ confirmCardPayment }),
    useElements: () => ({ getElement: () => ({}) }),
  };
});

import { apiFetch } from '../api';
import CheckoutPage from '../pages/CheckoutPage';
import { MemoryRouter } from 'react-router-dom';

test('start checkout creates an order and shows payment form', async () => {
  apiFetch.mockResolvedValueOnce({ orderId: 'order123', clientSecret: 'cs_123', publishableKey: 'pk_test' });

  render(
    <MemoryRouter>
      <CheckoutPage user={{ userId: 'u1' }} />
    </MemoryRouter>
  );

  expect(screen.getByText(/Total:/i)).toBeInTheDocument();

  const payButton = screen.getByText(/Pagar ahora/i);
  fireEvent.click(payButton);

  await waitFor(() => expect(apiFetch).toHaveBeenCalled());

  // after creating order, the Elements wrapper and CardElement should render
  expect(await screen.findByTestId('elements-wrapper')).toBeInTheDocument();
  expect(screen.getByTestId('card-element')).toBeInTheDocument();
});

test('completing payment calls patch and navigates to success', async () => {
  // first call (create order)
  apiFetch.mockResolvedValueOnce({ orderId: 'order456', clientSecret: 'cs_456', publishableKey: 'pk_test' });
  // second call (patch) -- when updating order
  apiFetch.mockResolvedValueOnce({});

  const { container } = render(
    <MemoryRouter>
      <CheckoutPage user={{ userId: 'u1' }} />
    </MemoryRouter>
  );

  // start flow
  fireEvent.click(screen.getByText(/Pagar ahora/i));
  await waitFor(() => expect(apiFetch).toHaveBeenCalled());

  // wait for payment UI
  await screen.findByTestId('card-element');

  // submit payment
  const payNow = screen.getByText(/Pagar/i);
  fireEvent.click(payNow);

  // PATCH should be called (update order)
  await waitFor(() => expect(apiFetch).toHaveBeenCalledTimes(2));
});
