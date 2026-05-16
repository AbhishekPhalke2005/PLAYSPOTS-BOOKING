import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Turf API
export const turfAPI = {
  getAll: (params) => api.get('/turfs', { params }),
  getById: (id) => api.get(`/turfs/${id}`),
  create: (data) => api.post('/turfs', data),
  update: (id, data) => api.put(`/turfs/${id}`, data),
  delete: (id) => api.delete(`/turfs/${id}`),
};

// Match API
export const matchAPI = {
  getAll: (params) => api.get('/matches', { params }),
  getById: (id) => api.get(`/matches/${id}`),
  create: (data) => api.post('/matches', data),
  join: (id) => api.post(`/matches/${id}/join`),
  leave: (id) => api.post(`/matches/${id}/leave`),
  update: (id, data) => api.put(`/matches/${id}`, data),
  cancel: (id) => api.delete(`/matches/${id}`),
};

// Booking API
export const bookingAPI = {
  getMyBookings: () => api.get('/bookings'),
  getTurfBookings: (turfId) => api.get(`/bookings/turf/${turfId}`),
  create: (data) => api.post('/bookings', data),
  confirm: (id) => api.put(`/bookings/${id}/confirm`),
  reject: (id) => api.put(`/bookings/${id}/reject`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
};

export default api;
