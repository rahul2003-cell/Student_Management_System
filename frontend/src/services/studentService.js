import apiClient from './apiClient';

const BASE = '/v1/students';

export const studentService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get(BASE, { params });
    return res.data.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`${BASE}/${id}`);
    return res.data.data;
  },

  create: async (payload) => {
    const res = await apiClient.post(BASE, payload);
    return res.data.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.put(`${BASE}/${id}`, payload);
    return res.data.data;
  },

  remove: async (id) => {
    const res = await apiClient.delete(`${BASE}/${id}`);
    return res.data.data;
  },

  getDashboardStats: async () => {
    const res = await apiClient.get(`${BASE}/dashboard/stats`);
    return res.data.data;
  },
};

export default studentService;
