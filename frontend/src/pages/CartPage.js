import React, { useEffect, useState } from 'react';

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const setCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const CartPage = () => {
  const [cart, setCartState] = useState(getCart());

  useEffect(() => {
    setCartState(getCart());
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
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