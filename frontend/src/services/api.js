import axios from 'axios';
import { demoAPI, isDemoMode } from './demoAPI';

// Backend URL'i - development ortamında genellikle localhost:3001 veya 8000 kullanılır
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Axios instance oluşturuyoruz
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token eklemek için
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi için
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersizse localStorage'dan sil ve login'e yönlendir
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API fonksiyonları
export const apiService = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
};

// Örnek API çağrıları - bunları backend'inizin endpoint'lerine göre düzenleyin
export const authAPI = {
  login: (credentials) => {
    if (isDemoMode()) {
      return demoAPI.login(credentials);
    }
    return apiService.post('/auth/login', credentials);
  },
  register: (userData) => {
    if (isDemoMode()) {
      return demoAPI.register(userData);
    }
    return apiService.post('/auth/register', userData);
  },
  logout: () => {
    if (isDemoMode()) {
      localStorage.removeItem('token');
      return Promise.resolve();
    }
    return apiService.post('/auth/logout');
  },
  getProfile: () => {
    if (isDemoMode()) {
      return demoAPI.getProfile();
    }
    return apiService.get('/auth/profile');
  },
};

export const userAPI = {
  getUsers: () => {
    if (isDemoMode()) {
      return demoAPI.getUsers();
    }
    return apiService.get('/users');
  },
  getUser: (id) => apiService.get(`/users/${id}`),
  createUser: (userData) => apiService.post('/users', userData),
  updateUser: (id, userData) => apiService.put(`/users/${id}`, userData),
  deleteUser: (id) => apiService.delete(`/users/${id}`),
};

// Diğer API endpoint'lerinizi buraya ekleyebilirsiniz
export const dataAPI = {
  getData: () => {
    if (isDemoMode()) {
      return demoAPI.getData();
    }
    return apiService.get('/data');
  },
  postData: (data) => {
    if (isDemoMode()) {
      return demoAPI.postData(data);
    }
    return apiService.post('/data', data);
  },
};

// Task API - Import edilen taskAPI'yi kullan
export { taskAPI } from './taskAPI';

export default api;