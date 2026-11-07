import api from "@/lib/axios";

export const bookingsApi = {
  create: (salonId, paymentMethod, payload) =>
    api.post("/api/booking", payload, { params: { salonId, paymentMethod } }).then((r) => r.data),
  myBookings: () => api.get("/api/booking/customer").then((r) => r.data),
  salonBookings: () => api.get("/api/booking/salons").then((r) => r.data),
  getById: (bookingId) => api.get(`/api/booking/${bookingId}`).then((r) => r.data),
  updateStatus: (bookingId, status) => api.put(`/api/booking/${bookingId}/status`, null, { params: { status } }).then((r) => r.data),
  bookedSlots: (salonId, date) => api.get(`/api/booking/slots/salon/${salonId}/date/${date}`).then((r) => r.data),
  salonReport: () => api.get("/api/booking/report").then((r) => r.data),
};
