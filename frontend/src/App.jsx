import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './components/Notification';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardPage from './pages/DashboardPage';
import SimpleTaskPage from './pages/SimpleTaskPage';
import AuthTestPage from './pages/AuthTestPage';
import DebugPage from './pages/DebugPage';
import SimpleBackendTest from './components/SimpleBackendTest';
import './App.css';

// React Query client oluştur
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Auth durumuna göre route yönlendirme
const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Debug logging
  console.log('🔍 App Routes Debug:', { 
    isAuthenticated, 
    loading, 
    user: user ? { id: user.id, email: user.email } : null 
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>🔄 Uygulama yükleniyor...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } 
      />
      <Route 
        path="/test" 
        element={<SimpleBackendTest />} 
      />
      <Route 
        path="/tasks" 
        element={<SimpleTaskPage />} 
      />
      <Route 
        path="/auth-test" 
        element={<AuthTestPage />} 
      />
      <Route 
        path="/debug" 
        element={<DebugPage />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } 
      />
      
      {/* 404 route */}
      <Route 
        path="*" 
        element={
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>404 - Sayfa Bulunamadı</h1>
            <p>Aradığınız sayfa mevcut değil.</p>
          </div>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NotificationProvider>
          <AuthProvider>
            <div className="App">
              <AppRoutes />
            </div>
          </AuthProvider>
        </NotificationProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
