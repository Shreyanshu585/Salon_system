import api from "@/lib/axios";

export const salonsApi = {
  list: () => api.get("/api/salons/list").then((r) => r.data),
  search: (city) => api.get("/api/salons/search", { params: { city } }).then((r) => r.data),
  getById: (salonId) => api.get(`/api/salons/${salonId}`).then((r) => r.data),
  getMySalon: () => api.get("/api/salons/owner").then((r) => r.data),
  create: (payload) => api.post("/api/salons", payload).then((r) => r.data),
  update: (salonId, payload) => api.put(`/api/salons/${salonId}`, payload).then((r) => r.data),
};
