import React, { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getCartKey, readCart } from '../utils/cart';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

const PaymentForm = ({ clientSecret, orderId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe no está listo');
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
      return;
    }

    // pago confirmado o requiere acciones; si succeeded entonces actualizar orden
    const pi = result.paymentIntent;
    if (pi && (pi.status === 'succeeded' || pi.status === 'requires_capture' || pi.status === 'processing')) {
      try {
        await apiFetch(`/orders/${orderId}`, {
          method: 'PATCH',
          body: JSON.stringify({ paymentIntentId: pi.id }),
        });
      } catch (err) {
        // no fatal — webhook backend también actualizará
        console.warn('No se pudo actualizar la orden localmente:', err.message || err);
      }
    }

    // redirigir a pantalla de exito
    navigate('/success');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 12 }}>
        <button disabled={!stripe || processing}>{processing ? 'Procesando...' : 'Pagar'}</button>
      </div>
    </form>
  );
};

const CheckoutPage = ({ user }) => {
  const cartKey = useMemo(() => getCartKey(user), [user]);
  const [cart, setCart] = useState(() => readCart(cartKey));
  const [status, setStatus] = useState('idle');
  const [orderInfo, setOrderInfo] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(readCart(cartKey));
  }, [cartKey]);

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);

  const startCheckout = async () => {
    if (!cart.length) return alert('Carrito vacío');
    setStatus('creating');
    try {
      const items = cart.map(i => ({ productId: i._id, quantity: i.qty }));
      const body = { items, shipping: 0, currency: 'usd' };
      const data = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) });

      // API devuelve orderId, clientSecret y publishableKey
      const { orderId, clientSecret, publishableKey } = data;
      setOrderInfo({ orderId, clientSecret });

      // prepare Stripe
      const stripe = loadStripe(publishableKey || process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripe);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      console.error('Error creando orden:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío. Añade productos antes de pagar.</p>
      ) : (
        <div>
          <h3>Resumen</h3>
          <ul>
            {cart.map(i => (
              <li key={i._id}>{i.name} x {i.qty} — ${i.price * i.qty}</li>
            ))}
          </ul>
          <h3>Total: ${total}</h3>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={startCheckout}
              disabled={status === 'creating' || status === 'ready'}
              style={{ padding: '0.5rem 1rem' }}
            >
              {status === 'creating' ? 'Creando orden...' : 'Pagar ahora'}
            </button>
            {status === 'creating' && <span style={{ marginLeft: 8 }}>Preparando pago...</span>}
            {status === 'ready' && orderInfo && (
              <div style={{ marginTop: 8, color: '#0b6623' }}>
                Orden creada — ID: <strong>{orderInfo.orderId}</strong>
              </div>
            )}
            {status === 'error' && (
              <div style={{ marginTop: 8, color: 'crimson' }}>Error creando la orden. Inténtalo de nuevo.</div>
            )}
          </div>
        </div>
      )}

      {status === 'ready' && orderInfo && stripePromise && (
        <div style={{ marginTop: 20 }}>
          <h3>Introduce datos de pago</h3>
          <Elements stripe={stripePromise} options={{ clientSecret: orderInfo.clientSecret }}>
            <PaymentForm clientSecret={orderInfo.clientSecret} orderId={orderInfo.orderId} />
          </Elements>
        </div>
      )}

      {status === 'error' && (
        <div style={{ color: 'crimson', marginTop: 12 }}>Ha ocurrido un error al crear la orden.</div>
      )}
    </div>
  );
};

export default CheckoutPage;
