import api from "@/lib/axios";

export const servicesApi = {
  bySalon: (salonId, categoryId) =>
    api.get(`/api/service-offering/salon/${salonId}`, { params: categoryId ? { categoryId } : undefined }).then((r) => r.data),
  getById: (id) => api.get(`/api/service-offering/${id}`).then((r) => r.data),
  getByIds: (ids) => api.get(`/api/service-offering/list/${ids.join(",")}`).then((r) => r.data),
  create: (payload) => api.post("/api/service-offering/salon-owner", payload).then((r) => r.data),
  update: (id, payload) => api.post(`/api/service-offering/salon-owner/${id}`, payload).then((r) => r.data),
};
