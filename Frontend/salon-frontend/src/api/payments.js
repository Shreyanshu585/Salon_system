import api from "@/lib/axios";

export const paymentsApi = {
  getById: (paymentOrderId) => api.get(`/api/payments/${paymentOrderId}`).then((r) => r.data),
  proceed: (paymentId, paymentLinkId) =>
    api.patch("/api/payments/proceed", null, { params: { paymentId, paymentLinkId } }).then((r) => r.data),
  // sessionId is optional: the server also remembers the Stripe session on the order
  proceedStripe: (orderId, sessionId) =>
    api.patch("/api/payments/proceed/stripe", null, { params: { orderId, sessionId: sessionId || undefined } }).then((r) => r.data),
};
