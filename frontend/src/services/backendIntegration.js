// Backend Integration Guide - Spring Boot + React
// Bu dosya backend entegrasyonu için referans

// 1. BACKEND ENDPOINT MAPPING
/*
Spring Boot Backend Endpoints:

✅ Task Management:
GET    /api/tasks              → Tüm taskları listele
POST   /api/tasks              → Yeni task oluştur
GET    /api/tasks/{id}         → Belirli task'ı getir
PUT    /api/tasks/{id}         → Task'ı güncelle
DELETE /api/tasks/{id}         → Task'ı sil

✅ Status Operations:
PATCH  /api/tasks/{id}/complete → Task'ı tamamla
PATCH  /api/tasks/{id}/pending  → Task'ı beklemede yap

✅ Filtering:
GET    /api/tasks/status/{status}     → Status'e göre filtrele
GET    /api/tasks/overdue             → Süresi geçen tasklar
GET    /api/tasks/high-priority       → Yüksek öncelikli tasklar
GET    /api/tasks/search?title=value  →  Title'da ara

✅ Authentication (Eğer varsa):
POST   /api/auth/login         → Kullanıcı girişi
POST   /api/auth/register      → Kullanıcı kaydı
GET    /api/auth/profile       → Kullanıcı profili

✅ Health Check:
GET    /api/health            → Backend sağlık durumu
GET    /actuator/health       → Spring Boot actuator
*/

// 2. FRONTEND REQUEST EXAMPLES
export const backendIntegrationExamples = {
  
  // Task CRUD Operations
  getAllTasks: async () => {
    const response = await fetch('http://localhost:8080/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // JWT token
      }
    });
    return response.json();
  },

  createTask: async (taskData) => {
    const response = await fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate
      })
    });
    return response.json();
  },

  updateTask: async (id, taskData) => {
    const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  deleteTask: async (id) => {
    const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.ok;
  }
};

// 3. ERROR HANDLING STRATEGY
export const handleBackendError = (error) => {
  if (error.status === 401) {
    // Token geçersiz - logout yap
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (error.status === 403) {
    // Yetkisiz erişim
    console.error('Access forbidden');
  } else if (error.status >= 500) {
    // Server error
    console.error('Server error:', error);
  }
};

// 4. BACKEND DATA MODEL MAPPING
/*
Backend Task Entity:
{
  id: Long,
  title: String,
  description: String,
  status: TaskStatus (TODO, IN_PROGRESS, DONE),
  priority: TaskPriority (LOW=1, MEDIUM=2, HIGH=3, URGENT=4),
  dueDate: LocalDate,
  completed: Boolean,
  createdAt: LocalDateTime,
  updatedAt: LocalDateTime,
  userId: Long (Eğer user authentication varsa)
}

Frontend Task Model:
{
  id: number,
  title: string,
  description: string,
  status: 'TODO' | 'IN_PROGRESS' | 'DONE',
  priority: 1 | 2 | 3 | 4,
  dueDate: string (ISO format),
  completed: boolean,
  createdAt: string,
  updatedAt: string
}
*/

export default backendIntegrationExamples;