import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
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
      <Link to="/cart" style={{ textDecoration: 'none', color: '#007bff' }}>
        Carrito
      </Link>
      <div style={{ flex: 1 }} />
      {user ? (
        <>
          <span style={{ color: '#28a745', fontWeight: 'bold' }}>
            Hola, {user.name}
          </span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
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