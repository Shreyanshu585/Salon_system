import axios from "axios";
import * as auth from "./auth";
import { toast } from "sonner";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_GATEWAY, timeout: 20000 });

api.interceptors.request.use(async (config) => {
  const token = await auth.getValidAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const RETRIABLE_STATUS = new Set([502, 503, 504]);
const MAX_RETRIES = 2;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    if (config && !config._silent) {
      const status = error.response?.status;
      const shouldRetry = (status !== undefined && RETRIABLE_STATUS.has(status)) || error.code === "ECONNABORTED" || !error.response;
      config._retryCount = config._retryCount ?? 0;
      if (shouldRetry && config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        await new Promise((r) => setTimeout(r, 400 * config._retryCount));
        return api(config);
      }
      if (status === 401) {
        toast.error("Your session has expired. Please sign in again.");
        auth.logout();
        window.location.href = "/login";
      } else if (status === 403) {
        toast.error("You don't have permission to do that.");
      } else if (status && status >= 500) {
        toast.error("Something went wrong on our end. Please try again.");
      } else if (!error.response) {
        toast.error("Network error — check your connection and try again.");
      } else {
        const message = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : null) || error.message;
        toast.error(message || "Request failed.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
