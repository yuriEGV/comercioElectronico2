import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartKey, readCart, writeCart } from '../utils/cart';

const CartPage = ({ user }) => {
  const cartKey = useMemo(() => getCartKey(user), [user]);
  const [cart, setCartState] = useState(() => readCart(cartKey));

  useEffect(() => {
    setCartState(readCart(cartKey));
  }, [cartKey]);

  const updateCart = (newCart) => {
    writeCart(cartKey, newCart);
    setCartState([...newCart]);
  };

  const handleQty = (id, delta) => {
    const newCart = cart.map(item =>
      item._id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    updateCart(newCart);
  };

  const handleRemove = (id) => {
    const candidate = cart.find(it => it._id === id);
    if (!candidate) return;
    const ok = window.confirm(`¿Eliminar ${candidate.name} del carrito?`);
    if (!ok) return;
    const newCart = cart.filter(item => item._id !== id);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const [confirmingEmpty, setConfirmingEmpty] = useState(false);

  const navigate = useNavigate();

  const goToCheckout = () => navigate('/checkout');

  const emptyCart = () => {
    if (!cart.length) return;
    const ok = window.confirm('¿Vaciar todo el carrito? Esta acción no se puede deshacer.');
    if (!ok) return;
    setConfirmingEmpty(true);
    writeCart(cartKey, []);
    setCartState([]);
    setTimeout(() => setConfirmingEmpty(false), 500);
  };

  return (
    <div>
      <h1>Carrito</h1>
      <div style={{ marginBottom: 12 }}>
        <button onClick={goToCheckout} disabled={cart.length === 0} style={{ marginRight: 8 }}>
          Ir a Checkout
        </button>
        <button onClick={emptyCart} disabled={cart.length === 0}>
          Vaciar carrito
        </button>
      </div>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          <ul>
            {cart.map(item => (
              <li key={item._id} style={{marginBottom:'1rem'}}>
                <b>{item.name}</b> - ${item.price} x {item.qty} = ${item.price * item.qty}
                <button onClick={() => handleQty(item._id, -1)} style={{marginLeft:8}}>-</button>
                <button onClick={() => handleQty(item._id, 1)}>+</button>
                <button onClick={() => handleRemove(item._id)} style={{marginLeft:8, color:'red'}}>Eliminar</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${total}</h3>
          <div style={{ marginTop: 10 }}>
            <button onClick={goToCheckout} disabled={cart.length === 0}>Comprar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 