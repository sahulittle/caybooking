import axios from "axios";
import { getActiveRole, canAccessRole } from "../utils/roleGuard";

// If `VITE_API_URL` is set use it. In production default to the page origin
// so the frontend can call the backend on the same host (Hostinger deployments).
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && import.meta.env.PROD
    ? window.location.origin
    : "http://localhost:5002");

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const activeRole = getActiveRole();

    // ✅ Attach token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Attach role (VERY IMPORTANT for backend)
    if (activeRole) {
      config.headers["x-role"] = activeRole;
    }

    // Normalize to a pathname for role-based checks so it works with
    // relative URLs ("/api/...") and absolute URLs ("https://.../api/...").
    try {
      const full = new URL(config.url, API_BASE_URL);
      const path = full.pathname || "";

      // 🔒 Admin Protection - require admin role for admin routes
      if (path.startsWith("/api/admin") && !canAccessRole("admin")) {
        return Promise.reject(new Error("Admin access required"));
      }

      // 🔒 Vendor Protection (only vendor routes)
      // Allow public vendor endpoints like categories/plans even if not active vendor
      if (
        path.startsWith("/api/vendors") &&
        !path.startsWith("/api/vendors/categories") &&
        !canAccessRole("vendor")
      ) {
        return Promise.reject(new Error("Vendor access required"));
      }
    } catch (e) {
      // If URL parsing fails, skip the extra checks (keep original behaviour)
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const originalRequest = error.config || {};

    // Don't auto-redirect for auth endpoints (login/signup) — let the component handle errors
    const skipAutoRedirect =
      originalRequest.url &&
      (originalRequest.url.includes("/api/login") ||
        originalRequest.url.includes("/api/signup") ||
        originalRequest.url.includes("/api/payments/create-checkout-session"));

    if (error.response?.status === 401 && !skipAutoRedirect) {
      // Clear auth and force login for protected routes
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response?.status === 403 && !skipAutoRedirect) {
      window.location.href = "/login?error=unauthorized";
    }

    return Promise.reject(error);
  },
);

// =========================
// USER APIs
// =========================
export const userAPI = {
  // ✅ FIXED (Booking instead of maintenance)
  getMyBookings: () => apiClient.get("/api/bookings"),
};

// =========================
// ADMIN APIs
// =========================
export const adminAPI = {
  getAllUsers: (params = {}) => apiClient.get("/api/admin/users", { params }),

  getUserById: (id) => apiClient.get(`/api/admin/users/${id}`),

  updateUser: (id, userData) =>
    apiClient.put(`/api/admin/users/${id}`, userData),

  deleteUser: (id) => apiClient.delete(`/api/admin/users/${id}`),

  // Requests
  getAllRequests: () => apiClient.get("/api/maintenance-request"),

  updateRequest: (id, data) =>
    apiClient.put(`/api/maintenance-request/${id}`, data),

  deleteRequest: (id) => apiClient.delete(`/api/maintenance-request/${id}`),

  // Vendors
  getAllVendors: () => apiClient.get("/api/admin/vendors"),

  updateVendor: (id, data) => {
    if (data.isVerified !== undefined) {
      return apiClient.put(`/api/admin/vendors/${id}/verify`, data);
    }
    return apiClient.put(`/api/vendors/${id}`, data);
  },

  deleteVendor: (id) => apiClient.delete(`/api/admin/vendors/${id}`),

  // Categories
  createCategory: (formData) =>
    apiClient.post("/api/admin/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getCategories: (params = {}) =>
    apiClient.get("/api/admin/categories", { params }),

  // =========================
  // ✅ SERVICES (ADD THIS)
  // =========================
  getAllServices: () => apiClient.get("/api/admin/services"),

  getServiceById: (id) => apiClient.get(`/api/admin/services/${id}`),

  createService: (data) => apiClient.post("/api/admin/services", data),

  updateService: (id, data) => apiClient.put(`/api/admin/services/${id}`, data),

  deleteService: (id) => apiClient.delete(`/api/admin/services/${id}`),
  // Reviews
  getAllReviews: (params = {}) =>
    apiClient.get("/api/admin/reviews", { params }),
  deleteReview: (id) => apiClient.delete(`/api/admin/reviews/${id}`),
  // Payments & Withdrawals
  getAllTransactions: (params = {}) =>
    apiClient.get("/api/admin/transactions", { params }),
  getAllWithdrawals: (params = {}) =>
    apiClient.get("/api/admin/withdrawals", { params }),
  updateWithdrawalStatus: (id, data) =>
    apiClient.put(`/api/admin/withdrawals/${id}`, data),
  // Notifications
  createNotification: (data) =>
    apiClient.post("/api/admin/notifications", data),
  getAllNotifications: (params = {}) =>
    apiClient.get("/api/admin/notifications", { params }),
  deleteNotification: (id) =>
    apiClient.delete(`/api/admin/notifications/${id}`),
};

// =========================
// VENDOR APIs
// =========================
export const vendorAPI = {
  getMaintenanceRequests: () => apiClient.get("/api/maintenance-request"),

  // ✅ Vendor bookings (important)
  getMyBookings: () => apiClient.get("/api/bookings"),

  updateBookingStatus: (id, status) =>
    apiClient.put(`/api/bookings/${id}/status`, { status }),

  // Earnings
  getEarnings: () => apiClient.get("/api/vendors/earnings"),
  // Withdrawals
  createWithdrawal: (payload) =>
    apiClient.post("/api/vendors/withdraw", payload),
  getWithdrawals: (params = {}) =>
    apiClient.get("/api/vendors/withdrawals", { params }),
  // Payments (paginated)
  getPayments: (params = {}) =>
    apiClient.get("/api/vendors/payments", { params }),
  // vendor profile
  getProfile: (id = "me") =>
    apiClient.get(id === "me" ? "/api/vendors" : `/api/vendors/${id}`),
  updateProfile: (id, data) => apiClient.put(`/api/vendors/${id}`, data),
  getReviews: () => apiClient.get("/api/vendors/reviews"),
};

// =========================
// BOOKING APIs (FINAL)
// =========================
export const bookingAPI = {
  // ✅ Get logged-in user/vendor bookings
  getMyBookings: () => apiClient.get("/api/bookings"),
  // alias used by vendor dashboard
  getAllBookings: () => apiClient.get("/api/bookings"),

  // ✅ Create booking
  createBooking: (payload) => apiClient.post("/api/bookings", payload),

  // ✅ Get single booking (for success page)
  getBookingById: (id) => apiClient.get(`/api/bookings/${id}`),

  // ✅ Update status (vendor/admin)
  updateBookingStatus: (id, status) =>
    apiClient.put(`/api/bookings/${id}/status`, { status }),
  updateReply: (id, payload) =>
    apiClient.put(`/api/bookings/${id}/reply`, payload),
};

// =========================
// SERVICES API for vendor
// =========================
export const servicesAPI = {
  getAll: (params = {}) => apiClient.get("/api/services", { params }),
  getById: (id) => apiClient.get(`/api/services/${id}`),
  getCategories: () => apiClient.get("/api/services/categories"),

  getServicesByCategory: (categoryId) =>
    apiClient.get(`/api/services/category/${categoryId}`),

  // ✅ ADD THIS HERE
  getPlansByCategory: (categoryName) =>
    apiClient.get(
      `/api/vendors/categories/${encodeURIComponent(categoryName)}`,
    ),
  create: (formData) =>
    apiClient.post("/api/services", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  update: (id, formData) =>
    apiClient.put(`/api/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  delete: (id) => apiClient.delete(`/api/services/${id}`),
};

// =========================
// SUBSCRIPTION API
// =========================
export const subscriptionAPI = {
  // public
  getAll: () => apiClient.get("/api/subscriptions"),
  getById: (id) => apiClient.get(`/api/subscriptions/${id}`),

  // vendor/user subscription checkout
  createCheckout: (payload) =>
    apiClient.post("/api/subscriptions/create-checkout-session", payload),

  // admin (protected)
  create: (data) => apiClient.post("/api/admin/subscriptions", data),
  update: (id, data) => apiClient.put(`/api/admin/subscriptions/${id}`, data),
  delete: (id) => apiClient.delete(`/api/admin/subscriptions/${id}`),
};

// =========================
// MAINTENANCE REQUEST
// =========================
export const sendMaintenanceRequest = async (payload) => {
  const response = await apiClient.post("/api/maintenance-request", payload);
  return response.data;
};

// for payments
export const paymentAPI = {
  createCheckout: (bookingId) =>
    apiClient.post("/api/payments/create-checkout-session", { bookingId }),
};
export default apiClient;
