import React, { useEffect, useMemo, useState } from 'react';
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
    const newCart = cart.filter(item => item._id !== id);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>
      <h1>Carrito</h1>
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
        </div>
      )}
    </div>
  );
};

export default CartPage; 