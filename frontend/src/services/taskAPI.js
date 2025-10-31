import { apiService } from './api';
import { isDemoMode } from './demoAPI';
import { authenticatedFetch } from './authAPI';

// Task Priority enum
export const TASK_PRIORITY = {
  LOW: 1,
  MEDIUM: 2, 
  HIGH: 3,
  URGENT: 4
};

// Task Status enum
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
};

// Priority labels
export const PRIORITY_LABELS = {
  [TASK_PRIORITY.LOW]: { label: 'Düşük Öncelik', color: '#28a745', icon: '🟢' },
  [TASK_PRIORITY.MEDIUM]: { label: 'Orta Öncelik', color: '#ffc107', icon: '🟡' },
  [TASK_PRIORITY.HIGH]: { label: 'Yüksek Öncelik', color: '#dc3545', icon: '🔴' },
  [TASK_PRIORITY.URGENT]: { label: 'Acil', color: '#ff4444', icon: '🔥' }
};

// Status labels
export const STATUS_LABELS = {
  [TASK_STATUS.TODO]: { label: 'Yapılacak', color: '#6c757d', icon: '⏳' },
  [TASK_STATUS.IN_PROGRESS]: { label: 'Devam Ediyor', color: '#007bff', icon: '🔄' },
  [TASK_STATUS.DONE]: { label: 'Tamamlandı', color: '#28a745', icon: '✅' }
};

// Demo tasks for testing without backend
const demoTasks = [
  {
    id: 1,
    title: 'Setup Development Environment',
    description: 'Node.js, React, Spring Boot kurulumu',
    status: TASK_STATUS.DONE,
    priority: TASK_PRIORITY.HIGH,
    dueDate: '2025-10-29',
    completed: true,
    createdAt: '2025-10-28T10:00:00Z',
    updatedAt: '2025-10-29T15:30:00Z'
  },
  {
    id: 2,
    title: 'Design Database Schema',
    description: 'PostgreSQL veritabanı şeması tasarımı',
    status: TASK_STATUS.IN_PROGRESS,
    priority: TASK_PRIORITY.HIGH,
    dueDate: '2025-11-01',
    completed: false,
    createdAt: '2025-10-29T09:00:00Z',
    updatedAt: '2025-10-30T11:00:00Z'
  },
  {
    id: 7,
    title: 'Fix Critical Bug',
    description: 'Authentication servisinde kritik hata',
    status: TASK_STATUS.IN_PROGRESS,
    priority: TASK_PRIORITY.URGENT,
    dueDate: '2025-10-27',
    completed: false,
    createdAt: '2025-10-25T14:00:00Z',
    updatedAt: '2025-10-30T16:00:00Z'
  }
];

// Task API functions
export const taskAPI = {
  // Temel CRUD işlemleri
  getTasks: () => {
    if (isDemoMode()) {
      return Promise.resolve({ data: demoTasks });
    }
    // Auth'lu fetch kullan
    return authenticatedFetch('http://localhost:8080/api/tasks')
      .then(response => response.json())
      .then(data => ({ data }));
  },

  getTask: (id) => {
    if (isDemoMode()) {
      const task = demoTasks.find(t => t.id === parseInt(id));
      return Promise.resolve({ data: task });
    }
    return apiService.get(`/tasks/${id}`);
  },

  createTask: (taskData) => {
    if (isDemoMode()) {
      const newTask = {
        id: Date.now(),
        ...taskData,
        status: TASK_STATUS.TODO,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoTasks.push(newTask);
      return Promise.resolve({ data: newTask });
    }
    // Auth'lu fetch kullan
    return authenticatedFetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => ({ data }));
  },

  updateTask: (id, taskData) => {
    if (isDemoMode()) {
      const index = demoTasks.findIndex(t => t.id === parseInt(id));
      if (index !== -1) {
        demoTasks[index] = {
          ...demoTasks[index],
          ...taskData,
          updatedAt: new Date().toISOString()
        };
        return Promise.resolve({ data: demoTasks[index] });
      }
      throw new Error('Task not found');
    }
    return apiService.put(`/tasks/${id}`, taskData);
  },

  deleteTask: (id) => {
    if (isDemoMode()) {
      const index = demoTasks.findIndex(t => t.id === parseInt(id));
      if (index !== -1) {
        demoTasks.splice(index, 1);
        return Promise.resolve();
      }
      throw new Error('Task not found');
    }
    return apiService.delete(`/tasks/${id}`);
  },

  // Hızlı işlemler
  completeTask: (id) => {
    if (isDemoMode()) {
      return taskAPI.updateTask(id, { status: TASK_STATUS.DONE, completed: true });
    }
    // Auth'lu fetch kullan
    return authenticatedFetch(`http://localhost:8080/api/tasks/${id}/complete`, {
      method: 'PATCH'
    })
    .then(response => response.json())
    .then(data => ({ data }));
  },

  markPending: (id) => {
    if (isDemoMode()) {
      return taskAPI.updateTask(id, { status: TASK_STATUS.TODO, completed: false });
    }
    return apiService.patch(`/tasks/${id}/pending`);
  },

  // Filtreleme ve arama
  getTasksByStatus: (status) => {
    if (isDemoMode()) {
      const filtered = demoTasks.filter(task => task.status === status);
      return Promise.resolve({ data: filtered });
    }
    return apiService.get(`/tasks/status/${status}`);
  },

  getOverdueTasks: () => {
    if (isDemoMode()) {
      const now = new Date().toISOString().split('T')[0];
      const overdue = demoTasks.filter(task => 
        task.dueDate < now && task.status !== TASK_STATUS.DONE
      );
      return Promise.resolve({ data: overdue });
    }
    return apiService.get('/tasks/overdue');
  },

  getHighPriorityTasks: () => {
    if (isDemoMode()) {
      const highPriority = demoTasks.filter(task => 
        task.priority >= TASK_PRIORITY.HIGH
      );
      return Promise.resolve({ data: highPriority });
    }
    return apiService.get('/tasks/high-priority');
  },

  searchTasks: (query) => {
    if (isDemoMode()) {
      const results = demoTasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
      );
      return Promise.resolve({ data: results });
    }
    return apiService.get(`/tasks/search?title=${encodeURIComponent(query)}`);
  },

  // Sistem kontrolü
  getHealthStatus: () => {
    if (isDemoMode()) {
      return Promise.resolve({ data: { status: 'UP', mode: 'DEMO' } });
    }
    return apiService.get('/tasks/health');
  }
};

// Utility functions
export const isTaskOverdue = (task) => {
  if (task.status === TASK_STATUS.DONE) return false;
  const now = new Date().toISOString().split('T')[0];
  return task.dueDate < now;
};

export const getTaskPriorityInfo = (priority) => {
  return PRIORITY_LABELS[priority] || PRIORITY_LABELS[TASK_PRIORITY.MEDIUM];
};

export const getTaskStatusInfo = (status) => {
  return STATUS_LABELS[status] || STATUS_LABELS[TASK_STATUS.TODO];
};

export const formatDueDate = (dueDate) => {
  const date = new Date(dueDate);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} gün önce bitmeli`;
  } else if (diffDays === 0) {
    return 'Bugün bitiyor';
  } else if (diffDays === 1) {
    return 'Yarın bitiyor';
  } else {
    return `${diffDays} gün sonra bitiyor`;
  }
};

export default taskAPI;