import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { getCartKey, writeCart } from '../utils/cart';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/orders/showAllMyOrders');
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const navigate = useNavigate();

  const handleReorder = (o) => {
    // map order items to product shapes in cart
    const newCart = (o.items || []).map(it => ({ _id: it.productId, name: it.name, price: it.price, qty: it.quantity }));
    const key = getCartKey(user);
    // overwrite cart for simplicity, user can adjust quantities in cart
    writeCart(key, newCart);
    // broadcast update so navbar updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cartKey: key } }));
    navigate('/cart');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bienvenido {user?.name || 'usuario'}. Aquí verás tus órdenes.</p>

      {loading && <p>Cargando órdenes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !orders.length && <p>No hay órdenes aún.</p>}

      {orders.map(o => (
        <div key={o._id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 10 }}>
          <div><strong>Orden:</strong> {o._id}</div>
          <div><strong>Total:</strong> ${o.total}</div>
          <div><strong>Estado pago:</strong> {o.paymentStatus}</div>
          <div><strong>Fecha:</strong> {new Date(o.createdAt).toLocaleString()}</div>
          <details style={{ marginTop: 8 }}>
            <summary>Items</summary>
            <ul>
              {(o.items || []).map(it => (
                <li key={it.productId}>{it.name} x {it.quantity} — ${it.price * it.quantity}</li>
              ))}
            </ul>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleReorder(o)} style={{ marginRight: 8 }}>Reordenar</button>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
