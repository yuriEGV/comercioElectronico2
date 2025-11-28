import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartKey, getCartCount } from '../utils/cart';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const key = getCartKey(user);
    setCartCount(getCartCount(key));

    const onCartUpdated = (e) => setCartCount(getCartCount(key));
    window.addEventListener('cartUpdated', onCartUpdated);
    return () => window.removeEventListener('cartUpdated', onCartUpdated);
  }, [user]);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await onLogout();
    } finally {
      setLoggingOut(false);
      navigate('/');
    }
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem 2rem',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#f8f9fa'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
        Productos
      </Link>
      <Link to="/cart" style={{ textDecoration: 'none', color: '#007bff', position: 'relative' }}>
        Carrito
        <span style={{
          display: 'inline-block',
          marginLeft: 6,
          background: '#007bff',
          color: 'white',
          padding: '2px 8px',
          borderRadius: 12,
          fontSize: 12
        }}>{cartCount}</span>
      </Link>
      <div style={{ flex: 1 }} />
      {user ? (
        <>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333', marginRight: '1rem' }}>
            Dashboard
          </Link>
          <span style={{ color: '#28a745', fontWeight: 'bold' }}>
            Hola, {user.name}
          </span>
          <button 
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loggingOut ? '#c82333' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loggingOut ? 'not-allowed' : 'pointer'
            }}
          >
            {loggingOut ? 'Cerrando...' : 'Logout'}
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
            Login
          </Link>
          <Link to="/register" style={{ textDecoration: 'none', color: '#28a745' }}>
            Registro
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar; 