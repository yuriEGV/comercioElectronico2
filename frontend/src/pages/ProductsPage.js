import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api';

function getGuestId() {
  let gid = localStorage.getItem('guestId');
  if (!gid) {
    gid = Math.random().toString(36).slice(2);
    localStorage.setItem('guestId', gid);
  }
  return gid;
}

function getCartKey(user) {
  if (user && user.userId) return `cart:${user.userId}`;
  return `cart:guest:${getGuestId()}`;
}

function readCart(cartKey) {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch {
    return [];
  }
}

function writeCart(cartKey, cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addToCart(cartKey, product) {
  const cart = readCart(cartKey);
  const idx = cart.findIndex(item => item._id === product._id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  writeCart(cartKey, cart);
}

const ProductsPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(null);

  const cartKey = useMemo(() => getCartKey(user), [user]);

  useEffect(() => {
    apiFetch('/products')
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAdd = (product) => {
    addToCart(cartKey, product);
    setAdded(product._id);
    setTimeout(() => setAdded(null), 1000);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p style={{color:'red'}}>Error: {error}</p>;

  return (
    <div>
      <h1>Productos</h1>
      <div style={{display:'flex',flexWrap:'wrap',gap:'2rem'}}>
        {products.map(product => (
          <div key={product._id} style={{border:'1px solid #ccc',padding:'1rem',width:250}}>
            {product.image && <img src={product.image} alt={product.name} style={{width:'100%',height:150,objectFit:'cover'}} />}
            <h2>{product.name}</h2>
            <p>Precio: ${product.price}</p>
            <p>{product.description}</p>
            <button onClick={() => handleAdd(product)}>
              {added === product._id ? 'Agregado!' : 'Agregar al carrito'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage; 