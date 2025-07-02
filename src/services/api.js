import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Expenses API
export const expensesAPI = {
  getAll: () => api.get('/expenses'),
  getMonthly: (year, month) => api.get(`/expenses/monthly/${year}/${month}`),
  getByCategory: (year, month) => api.get(`/expenses/categories/${year}/${month}`),
  create: (expenseData) => api.post('/expenses', expenseData),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Budget API
export const budgetAPI = {
  get: (year, month) => api.get(`/budget/${year}/${month}`),
  set: (budgetData) => api.post('/budget', budgetData),
};

export default api;