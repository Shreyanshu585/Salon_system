import api from "@/lib/axios";

export const notificationsApi = {
  forUser: (userId) => api.get(`/api/notifications/user/${userId}`).then((r) => r.data),
  markAsRead: (notificationId) => api.put(`/api/notifications/${notificationId}/read`).then((r) => r.data),
  forSalon: (salonId) => api.get(`/api/notifications/salon-owner/salon/${salonId}`).then((r) => r.data),
};
