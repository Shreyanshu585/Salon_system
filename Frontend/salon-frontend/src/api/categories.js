import api from "@/lib/axios";

export const categoriesApi = {
  bySalon: (salonId) => api.get(`/api/categories/salon/${salonId}`).then((r) => r.data),
  getById: (id) => api.get(`/api/categories/${id}`).then((r) => r.data),
  create: (payload) => api.post("/api/categories/salon-owner", payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/categories/salon-owner/${id}`).then((r) => r.data),
  getByIdForSalon: (salonId, id) => api.get(`/api/categories/salon-owner/salon/${salonId}/category/${id}`).then((r) => r.data),
};
