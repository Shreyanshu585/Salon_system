/**
 * Talks to this app's own AuthController (com.shree.Controller.AuthController)
 * — NOT to Keycloak directly. The backend proxies signup/login/refresh to
 * Keycloak itself and hands back a real Keycloak-issued JWT, so the frontend
 * never needs Keycloak's URL or client ID at all.
 */

const GATEWAY = import.meta.env.VITE_API_GATEWAY;
const STORAGE_KEY = "salon_auth_tokens";

export const ROLES = { CUSTOMER: "CUSTOMER", SALON_OWNER: "SALON_OWNER", ADMIN: "ADMIN" };

let current = loadFromStorage();
let refreshPromise = null;
const listeners = new Set();

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(tokens) {
  current = tokens;
  if (tokens) localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  else localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((l) => l(tokens));
}

function decodeExpiry(jwt) {
  try {
    const payload = jwt.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(decodeURIComponent(escape(json)));
    return parsed.exp * 1000;
  } catch {
    return Date.now() + 60_000;
  }
}

function fromAuthResponse(res, previousRole) {
  return {
    accessToken: res.jwt,
    refreshToken: res.refresh_token,
    expiresAt: decodeExpiry(res.jwt),
    role: res.role ?? previousRole ?? null,
  };
}

async function postAuth(path, body, method = "POST") {
  const res = await fetch(`${GATEWAY}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed.");
  }
  return res.json();
}

export function onAuthChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function login(email, password) {
  try {
    const res = await postAuth("/auth/login", { email, password });
    persist(fromAuthResponse(res));
  } catch {
    throw new Error("Incorrect email or password.");
  }
}

export async function signup(payload) {
  const res = await postAuth("/auth/signup", payload);
  persist(fromAuthResponse(res));
}

export function logout() {
  persist(null);
}

async function refresh() {
  if (!current?.refreshToken) return null;
  try {
    const res = await postAuth(`/auth/access-token/refresh-token/${current.refreshToken}`, undefined, "GET");
    const tokens = fromAuthResponse(res, current.role);
    persist(tokens);
    return tokens;
  } catch {
    persist(null);
    return null;
  }
}

export async function getValidAccessToken() {
  if (!current) return null;
  if (current.expiresAt - Date.now() > 30_000) return current.accessToken;
  if (!refreshPromise) {
    refreshPromise = refresh().finally(() => {
      refreshPromise = null;
    });
  }
  const refreshed = await refreshPromise;
  return refreshed?.accessToken ?? null;
}

export function getCurrentTokens() {
  return current;
}
