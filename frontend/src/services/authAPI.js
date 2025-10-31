// 🔐 Authentication API Service
// Backend auth endpoints ile iletişim kuran servis

import { debugFetch, safeJsonParse } from './debugAPI';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * 📝 Kullanıcı kayıt işlemi
 */
export const registerUser = async (userData) => {
  console.log('🔄 Registering user:', { email: userData.email, name: userData.name });
  
  try {
    const response = await debugFetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password
      })
    });

    const data = await safeJsonParse(response, 'User Registration');

    if (!response.ok) {
      throw new Error(data.message || `Registration failed: ${response.status}`);
    }

    console.log('✅ Registration successful:', data);
    return data;
  } catch (error) {
    console.error('❌ Registration error:', error);
    throw error;
  }
};

/**
 * 🔐 Kullanıcı giriş işlemi
 */
export const loginUser = async (credentials) => {
  console.log('🔄 Logging in user:', credentials.email);
  
  try {
    const response = await debugFetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await safeJsonParse(response, 'User Login');

    if (!response.ok) {
      throw new Error(data.message || `Login failed: ${response.status}`);
    }

    // 🎫 JWT token'ı localStorage'a kaydet
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role
      }));
    }

    console.log('✅ Login successful:', { ...data, token: '[HIDDEN]' });
    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

/**
 * 👤 Kullanıcı profil bilgilerini getirme
 */
export const getUserProfile = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      // Token geçersizse temizle
      if (response.status === 401) {
        logout();
      }
      throw new Error(data.message || `Profile fetch failed: ${response.status}`);
    }

    console.log('✅ Profile fetched successfully');
    return data;
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    throw error;
  }
};

/**
 * 🚪 Çıkış işlemi
 */
export const logout = () => {
  console.log('🚪 Logging out user');
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Sayfayı yenile veya login sayfasına yönlendir
  window.location.href = '/';
};

/**
 * 🔍 Token geçerliliğini kontrol etme
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * 👤 Mevcut kullanıcı bilgilerini getirme
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 🎫 Mevcut token'ı getirme
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * 🔧 Authenticated API requests için helper
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Token geçersizse çıkış yap
  if (response.status === 401) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  return response;
};