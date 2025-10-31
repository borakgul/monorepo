import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { isDemoMode } from '../services/demoAPI';

const LoginPage = () => {
  return (
    <div>
      <LoginForm />
      
      {isDemoMode() && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#e8f4fd',
          borderRadius: '8px',
          border: '1px solid #b8daff',
          maxWidth: '400px',
          margin: '1rem auto'
        }}>
          <h4 style={{ color: '#004085', margin: '0 0 0.5rem 0' }}>🚀 Demo Mode Aktif</h4>
          <p style={{ color: '#004085', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
            Backend olmadan test edebilirsiniz:
          </p>
          <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}>
            <strong>Email:</strong> demo@example.com<br />
            <strong>Şifre:</strong> demo123
          </div>
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>
          Hesabın yok mu? 
          <Link to="/register" style={{ marginLeft: '0.5rem', color: '#007bff' }}>
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;