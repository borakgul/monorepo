import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from './Notification';
import useFormValidation, { validationRules } from '../hooks/useFormValidation';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const { showSuccess, showError } = useNotification();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields,
  } = useFormValidation(
    { email: '', password: '' },
    {
      email: [
        validationRules.required(),
        validationRules.email(),
      ],
      password: [
        validationRules.required(),
        validationRules.minLength(6),
      ],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      showError('Lütfen tüm alanları doğru şekilde doldurunuz');
      return;
    }

    const result = await login(values);
    
    if (result.success) {
      showSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
      // Kullanıcı nereden geldiyse oraya yönlendir, yoksa dashboard'a
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      showError(result.error || 'Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Giriş Yap</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={errors.email && touched.email ? 'error' : ''}
          />
          {errors.email && touched.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Şifre:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={errors.password && touched.password ? 'error' : ''}
          />
          {errors.password && touched.password && (
            <span className="field-error">{errors.password}</span>
          )}
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading && (
            <div className="spinner-inline"></div>
          )}
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;