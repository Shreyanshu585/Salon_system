import api from "@/lib/axios";

export const reviewsApi = {
  bySalon: (salonId) => api.get(`/api/reviews/salon/${salonId}`).then((r) => r.data),
  create: (salonId, payload) => api.post(`/api/reviews/salon/${salonId}`, payload).then((r) => r.data),
  update: (reviewId, payload) => api.put(`/api/reviews/${reviewId}`, payload).then((r) => r.data),
  remove: (reviewId) => api.delete(`/api/reviews/${reviewId}`).then((r) => r.data),
};
