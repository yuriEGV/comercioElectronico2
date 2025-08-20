import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const idx = cart.findIndex(item => item._id === product._id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(null);

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
    addToCart(product);
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