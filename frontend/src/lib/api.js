// Lightweight fetch wrapper for the ZentoMart API.
// JWT is stored in localStorage and added to the Authorization header.

// Resolve API base from env (VITE_API_URL=http://localhost:5000/api), falling
// back to relative /api which is proxied by Vite. Absolute is more robust.
export const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "/api";

export const IMAGEKIT_URL_ENDPOINT =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_IMAGEKIT_URL_ENDPOINT) || "";

const TOKEN_KEY = "zentomart_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const buildHeaders = (extra = {}, body) => {
  const headers = { ...extra };
  if (body && !(body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = tokenStore.get();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const formatNetworkError = (path, err) => {
  const msg = `Cannot reach the API at ${API_BASE}${path}. ` +
    `Is the backend running? Start it with: cd d:/ZentoMart/backend && npm run dev`;
  console.error("[ZentoMart API]", msg, err);
  const e = new Error(msg);
  e.network = true;
  return e;
};

const handleResponse = async (path, res) => {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (isJson && data?.message) || `Request failed (${res.status})`;
    console.error(`[ZentoMart API] ${res.status} ${path}:`, message);
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

const request = async (method, path, body, opts = {}) => {
  const url = `${API_BASE}${path}`;
  const init = {
    ...opts,
    method,
    headers: buildHeaders(opts.headers, body),
  };
  if (body !== undefined) {
    init.body = body instanceof FormData ? body : JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(url, init);
  } catch (err) {
    throw formatNetworkError(path, err);
  }
  return handleResponse(path, res);
};

export const api = {
  get: (path, opts) => request("GET", path, undefined, opts),
  post: (path, body, opts) => request("POST", path, body, opts),
  put: (path, body, opts) => request("PUT", path, body, opts),
  delete: (path, opts) => request("DELETE", path, undefined, opts),
};

// Resolves a server-relative image URL like "/uploads/abc.jpg" against the
// API origin so <img> works regardless of which port the frontend runs on.
export const resolveAssetUrl = (url) => {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith("/uploads") || url.startsWith("/api")) {
    const apiOrigin = API_BASE.startsWith("http")
      ? new URL(API_BASE).origin
      : window.location.origin;
    return apiOrigin + url;
  }
  if (IMAGEKIT_URL_ENDPOINT && url.startsWith("/")) {
    return `${IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "")}${url}`;
  }
  return url;
};

// Optional: simple connectivity check used by the API health banner
export const pingApi = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
};
