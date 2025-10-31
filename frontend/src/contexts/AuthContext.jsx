import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, logout } from '../services/authAPI';

// 🏗️ Auth Context oluşturma
const AuthContext = createContext();

// 📊 Auth state yapısı
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// 🔄 Auth reducer - state değişikliklerini yönetir
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload.error
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };

    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

/**
 * 🎯 Auth Provider Component
 * Tüm uygulamayı sarar ve auth durumunu sağlar
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔄 Sayfa yüklendiğinde token kontrolü
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        if (isAuthenticated()) {
          const user = getCurrentUser();
          if (user) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user }
            });
          } else {
            // Token var ama user bilgisi yok, çıkış yap
            logout();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        dispatch({
          type: 'AUTH_ERROR',
          payload: { error: 'Failed to check authentication status' }
        });
      }
    };

    checkAuthStatus();
  }, []);

  // 📝 Login action
  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START_LOADING' });
    
    try {
      const { loginUser } = await import('../services/authAPI');
      const authData = await loginUser(credentials);
      
      // Backend'den gelen data zaten user bilgilerini içeriyor
      const user = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role
      };
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: user }
      });
      
      console.log('✅ AuthContext: User logged in successfully:', user);
      return authData;
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // 📝 Register action
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START_LOADING' });
    
    try {
      const { registerUser } = await import('../services/authAPI');
      const result = await registerUser(userData);
      
      // Kayıt başarılıysa otomatik login yapmayalım, user'ı login sayfasına yönlendirelim
      dispatch({ type: 'AUTH_LOGOUT' });
      
      return result;
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // 🚪 Logout action
  const logoutUser = () => {
    logout(); // localStorage temizle
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // ❌ Hata temizleme
  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  // 🔄 Profile refresh
  const refreshProfile = async () => {
    try {
      const { getUserProfile } = await import('../services/authAPI');
      const user = await getUserProfile();
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user }
      });
      
      return user;
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // 🎯 Context value
  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout: logoutUser,
    clearError,
    refreshProfile,
    
    // Helper functions
    isAdmin: () => state.user?.role === 'ADMIN',
    hasRole: (role) => state.user?.role === role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 🎣 useAuth Hook
 * Auth context'ini kullanmak için custom hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;