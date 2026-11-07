import api from "@/lib/axios";

export const usersApi = {
  getProfile: () => api.get("/api/users/profile").then((r) => r.data),
  getById: (id) => api.get(`/api/users/${id}`).then((r) => r.data),
};
