import React, { useState, useEffect } from 'react';
import { useNotification } from './Notification';
import { taskAPI, isTaskOverdue, getTaskPriorityInfo, getTaskStatusInfo, formatDueDate, TASK_STATUS, TASK_PRIORITY } from '../services/taskAPI';
import './TaskDashboard.css';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      let response;

      switch (filter) {
        case 'overdue':
          response = await taskAPI.getOverdueTasks();
          break;
        case 'high-priority':
          response = await taskAPI.getHighPriorityTasks();
          break;
        case 'todo':
          response = await taskAPI.getTasksByStatus(TASK_STATUS.TODO);
          break;
        case 'in-progress':
          response = await taskAPI.getTasksByStatus(TASK_STATUS.IN_PROGRESS);
          break;
        case 'done':
          response = await taskAPI.getTasksByStatus(TASK_STATUS.DONE);
          break;
        default:
          response = await taskAPI.getTasks();
      }

      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      showError('Task\'lar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTasks();
      return;
    }

    try {
      setLoading(true);
      const response = await taskAPI.searchTasks(searchQuery);
      setTasks(response.data);
    } catch (error) {
      showError('Arama sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await taskAPI.completeTask(taskId);
      showSuccess('Task tamamlandı!');
      loadTasks();
    } catch (error) {
      showError('Task tamamlanırken hata oluştu');
    }
  };

  const handleMarkPending = async (taskId) => {
    try {
      await taskAPI.markPending(taskId);
      showSuccess('Task beklemede olarak işaretlendi');
      loadTasks();
    } catch (error) {
      showError('Task güncellenirken hata oluştu');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Bu task\'ı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      showSuccess('Task silindi');
      loadTasks();
    } catch (error) {
      showError('Task silinirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="task-dashboard">
        <div className="loading-spinner">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="task-dashboard">
      <div className="dashboard-header">
        <h2>📋 Task Management</h2>
        
        {/* Search */}
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Task ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="search-btn">🔍</button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            📋 Tümü ({tasks.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setFilter('todo')}
          >
            ⏳ Yapılacak
          </button>
          <button 
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            🔄 Devam Eden
          </button>
          <button 
            className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
          >
            ✅ Tamamlanan
          </button>
          <button 
            className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilter('overdue')}
          >
            ⚠️ Süre Geçen
          </button>
          <button 
            className={`filter-btn ${filter === 'high-priority' ? 'active' : ''}`}
            onClick={() => setFilter('high-priority')}
          >
            🔥 Yüksek Öncelik
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <h3>🎯 Task bulunamadı</h3>
            <p>Henüz hiç task yok veya filtreye uygun task bulunamadı.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task}
              onComplete={handleCompleteTask}
              onMarkPending={handleMarkPending}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onComplete, onMarkPending, onDelete }) => {
  const priorityInfo = getTaskPriorityInfo(task.priority);
  const statusInfo = getTaskStatusInfo(task.status);
  const isOverdue = isTaskOverdue(task);

  return (
    <div className={`task-card ${task.status.toLowerCase()} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">
          {task.title}
          {isOverdue && <span className="overdue-badge">⚠️</span>}
        </h3>
        <div className="task-actions">
          {task.status !== TASK_STATUS.DONE && (
            <button 
              onClick={() => onComplete(task.id)}
              className="action-btn complete-btn"
              title="Tamamla"
            >
              ✅
            </button>
          )}
          {task.status === TASK_STATUS.DONE && (
            <button 
              onClick={() => onMarkPending(task.id)}
              className="action-btn pending-btn"
              title="Beklemede Yap"
            >
              🔄
            </button>
          )}
          <button 
            onClick={() => onDelete(task.id)}
            className="action-btn delete-btn"
            title="Sil"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span className="task-status">
          {statusInfo.icon} {statusInfo.label}
        </span>
        <span 
          className="task-priority"
          style={{ color: priorityInfo.color }}
        >
          {priorityInfo.icon} {priorityInfo.label}
        </span>
      </div>

      <div className="task-footer">
        <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
          📅 {formatDueDate(task.dueDate)}
        </span>
        {task.updatedAt && (
          <span className="updated-at">
            🕐 {new Date(task.updatedAt).toLocaleString('tr-TR')}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;