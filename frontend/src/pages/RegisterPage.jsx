import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>
          Zaten hesabın var mı? 
          <Link to="/login" style={{ marginLeft: '0.5rem', color: '#007bff' }}>
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;