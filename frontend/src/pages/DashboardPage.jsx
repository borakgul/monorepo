import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskDashboard from '../components/TaskDashboard';
import { isDemoMode } from '../services/demoAPI';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>
          Task Management Dashboard
          {isDemoMode() && <span className="demo-badge">DEMO MODE</span>}
        </h1>
        <div className="user-info">
          <span>Hoş geldin, {user?.name || user?.email}</span>
          <button onClick={logout} className="logout-btn">
            Çıkış Yap
          </button>
        </div>
      </header>
      
      <main className="page-main">
        <TaskDashboard />
      </main>
    </div>
  );
};

export default DashboardPage;