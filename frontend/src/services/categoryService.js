import api from './api';

const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  getUserCategories: async () => {
    const response = await api.get('/categories/user');
    return response.data;
  },
};

export default categoryService;
