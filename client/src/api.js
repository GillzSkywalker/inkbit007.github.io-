import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth
export const authAPI = {
  getCurrentUser: () => api.get('/users/me'),
  login: (email, password) => api.post('/users/login', { email, password }),
  signup: (name, email, password) => api.post('/users', { name, email, password }),
  logout: () => api.post('/users/logout'),
  updateProfile: (data) => api.put('/users/me', data)
}

// Collections
export const collectionsAPI = {
  getAll: (page = 1, limit = 10, search = '', tag = '') =>
    api.get(`/collections/public?page=${page}&limit=${limit}&search=${search}&tag=${tag}`),
  getMyCollections: () => api.get('/collections/my-collections'),
  getById: (id) => api.get(`/collections/${id}`),
  create: (data) => api.post('/collections', data),
  update: (id, data) => api.put(`/collections/${id}`, data),
  delete: (id) => api.delete(`/collections/${id}`),
  addItem: (id, item) => api.post(`/collections/${id}/items`, item),
  removeItem: (id, itemId) => api.delete(`/collections/${id}/items/${itemId}`),
  report: (id, reason) => api.post(`/collections/${id}/report`, { reason })
}

// Achievements
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  unlock: (id) => api.post(`/achievements/${id}/unlock`)
}

export default api
