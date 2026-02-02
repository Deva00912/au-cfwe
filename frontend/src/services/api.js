import axios from "axios";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookies if needed
});

// Add request interceptor to attach token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem("token");
      // Optionally redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============================================
// Authentication API calls
// ============================================
export const authAPI = {
  login: (email, password) =>
    apiClient.post("/api/auth/login", { email, password }),
  register: (userData) => apiClient.post("/api/auth/register", userData),
  logout: () => apiClient.post("/api/auth/logout"),
  refreshToken: () => apiClient.post("/api/auth/refresh-token"),
};

// ============================================
// News API calls
// ============================================
export const newsAPI = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get("/api/news", { params: { page, limit } }),
  getById: (id) => apiClient.get(`/api/news/${id}`),
  create: (newsData) =>
    apiClient.post("/api/news", newsData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, newsData) =>
    apiClient.put(`/api/news/${id}`, newsData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => apiClient.delete(`/api/news/${id}`),
};

// ============================================
// Programs API calls
// ============================================
export const programAPI = {
  getAll: () => apiClient.get("/api/programs"),
  getById: (id) => apiClient.get(`/api/programs/${id}`),
  create: (programData) => apiClient.post("/api/programs", programData),
  update: (id, programData) =>
    apiClient.put(`/api/programs/${id}`, programData),
  delete: (id) => apiClient.delete(`/api/programs/${id}`),
};

// ============================================
// Gallery API calls
// ============================================
export const galleryAPI = {
  getAll: (page = 1, limit = 12) =>
    apiClient.get("/api/gallery", { params: { page, limit } }),
  getById: (id) => apiClient.get(`/api/gallery/${id}`),
  create: (formData) =>
    apiClient.post("/api/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    apiClient.put(`/api/gallery/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => apiClient.delete(`/api/gallery/${id}`),
};

// ============================================
// Projects API calls
// ============================================
export const projectAPI = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get("/api/projects", { params: { page, limit } }),
  getById: (id) => apiClient.get(`/api/projects/${id}`),
  create: (formData) =>
    apiClient.post("/api/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    apiClient.put(`/api/projects/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => apiClient.delete(`/api/projects/${id}`),
};

// ============================================
// Health Check
// ============================================
export const healthAPI = {
  check: () => apiClient.get("/health"),
};

export default apiClient;
