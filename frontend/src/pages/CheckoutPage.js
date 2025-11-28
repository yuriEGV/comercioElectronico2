import React, { useEffect, useMemo, useState } from 'react';
// Webpay + Onepay flow — remove Stripe Elements and integrate with backend Webpay endpoints
import { getCartKey, readCart } from '../utils/cart';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

// No embedded card form — payments are handled via Webpay/Onepay flows

const CheckoutPage = ({ user }) => {
  const cartKey = useMemo(() => getCartKey(user), [user]);
  const [cart, setCart] = useState(() => readCart(cartKey));
  const [status, setStatus] = useState('idle');
  const [orderInfo, setOrderInfo] = useState(null);
  const [onepayInfo, setOnepayInfo] = useState(null);
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

      // API devuelve orderId y totals
      const { orderId } = data;
      setOrderInfo({ orderId });
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

      {status === 'ready' && orderInfo && (
        <div style={{ marginTop: 20 }}>
          <h3>Proceder al pago</h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={async () => {
              // Init Webpay Plus transaction
              try {
                const resp = await apiFetch('/payments/webpay/init', { method: 'POST', body: JSON.stringify({ amount: total, orderId: orderInfo.orderId }) });
                // resp.url and resp.token
                // create and submit form
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = resp.url;
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'token_ws';
                input.value = resp.token;
                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
              } catch (err) {
                console.error('Error iniciando Webpay:', err);
                alert('No se pudo iniciar Webpay');
              }
            }}>
              Pagar con Webpay (Plus)
            </button>

            <button onClick={async () => {
              // Init Onepay QR
              try {
                const resp = await apiFetch('/payments/onepay/init', { method: 'POST', body: JSON.stringify({ amount: total, orderId: orderInfo.orderId }) });
                setOnepayInfo(resp);
              } catch (err) {
                console.error('Error iniciando Onepay:', err);
                alert('No se pudo iniciar Onepay');
              }
            }}>
              Pagar con Onepay (QR)
            </button>
          </div>

          {onepayInfo && (
            <div style={{ marginTop: 16 }}>
              <h4>Escanea el QR para pagar</h4>
              <img src={onepayInfo.qrImage} alt="QR Onepay" style={{ maxWidth: 300 }} />
              <div style={{ marginTop: 8 }}>
                <button onClick={async () => {
                  // Commit Onepay when user indicates payment done
                  try {
                    await apiFetch('/payments/onepay/commit', { method: 'POST', body: JSON.stringify({ reference: onepayInfo.reference }) });
                    navigate('/success');
                  } catch (err) {
                    console.error('Error confirmando Onepay:', err);
                    alert('No se pudo confirmar el pago');
                  }
                }}>Confirmar pago</button>
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div style={{ color: 'crimson', marginTop: 12 }}>Ha ocurrido un error al crear la orden.</div>
      )}
    </div>
  );
};

export default CheckoutPage;
