import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, dataAPI } from '../services/api';
import { isDemoMode } from '../services/demoAPI';
import DataManager from './DataManager';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
    
    // DataManager'dan gelen güncellemeleri dinle
    const handleDataUpdate = () => {
      loadData();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Paralel olarak veri yükle
      const [usersResponse, dataResponse] = await Promise.all([
        userAPI.getUsers().catch(err => ({ data: [] })), // Hata durumunda boş array
        dataAPI.getData().catch(err => ({ data: [] }))
      ]);
      
      setUsers(usersResponse.data);
      setData(dataResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          Dashboard 
          {isDemoMode() && <span className="demo-badge">DEMO MODE</span>}
        </h1>
        <div className="user-info">
          <span>Hoş geldin, {user?.name || user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Çıkış Yap
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="dashboard-main">
        <DataManager />
        
        <div className="dashboard-section">
          <h2>Kullanıcılar</h2>
          <div className="users-grid">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>Rol: {user.role || 'User'}</p>
                </div>
              ))
            ) : (
              <p>Kullanıcı bulunamadı</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Veriler</h2>
          <div className="data-list">
            {data.length > 0 ? (
              data.map((item, index) => (
                <div key={item.id || index} className="data-item">
                  <h4>{item.title || `Veri ${index + 1}`}</h4>
                  <p>{item.description || JSON.stringify(item)}</p>
                </div>
              ))
            ) : (
              <p>Veri bulunamadı</p>
            )}
          </div>
        </div>

        <div className="dashboard-actions">
          <button onClick={loadData} className="refresh-btn">
            Verileri Yenile
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;