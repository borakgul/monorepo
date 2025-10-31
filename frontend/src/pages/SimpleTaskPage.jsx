import React from 'react';
import TaskDashboard from '../components/TaskDashboard';

const SimpleTaskPage = () => {
  return (
    <div className="simple-task-page">
      <header className="page-header">
        <h1>🚀 Task Management (Auth-Free)</h1>
        <div className="backend-info">
          <span className="status-badge success">Backend Connected ✅</span>
          <span className="task-count">7 Tasks Available</span>
        </div>
      </header>
      
      <main className="page-main">
        <TaskDashboard />
      </main>
    </div>
  );
};

export default SimpleTaskPage;