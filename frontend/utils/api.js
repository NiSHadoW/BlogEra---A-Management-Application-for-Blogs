import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// If an authenticated request comes back 401, the token is expired/invalid/
// revoked (not a login-form failure — POST /auth/login never sends this
// header, so a wrong-password 401 there is unaffected and still handled by
// the page's own catch block). Clear the stale token and bounce to /login
// so the app doesn't sit there looking logged in while every call silently fails.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadAuthHeader = !!error.config?.headers?.Authorization;
    if (status === 401 && hadAuthHeader && typeof window !== "undefined") {
      localStorage.removeItem("token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Uploaded files (profile images) are served from the API's origin, not
// under /api — e.g. NEXT_PUBLIC_API_URL=http://localhost:5000/api but an
// image path like /uploads/profile-images/x.jpg is served from
// http://localhost:5000 directly.
const ASSET_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

export const getAssetUrl = (path) => (path ? `${ASSET_BASE_URL}${path}` : null);

// Every backend error response is { message: "..." } (Rules #31 — never
// show a raw JS error to the user). Falls back to a generic message for
// network failures where there's no response at all.
export const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";
