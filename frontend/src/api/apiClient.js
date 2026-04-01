import axios from 'axios'
import { getActiveRole, canAccessRole } from '../utils/roleGuard'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/* =========================
   REQUEST INTERCEPTOR
========================= */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 🔒 Admin Protection
    if (config.url.includes('/admin') && !canAccessRole('admin')) {
      return Promise.reject(new Error('Admin access required'))
    }

    // 🔒 Vendor Protection (ONLY vendor-specific endpoints)
    if (
      config.url.includes('/vendors/profile') ||
      config.url.includes('/vendors/create')
    ) {
      if (!canAccessRole('vendor')) {
        return Promise.reject(new Error('Vendor access required'))
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* =========================
   RESPONSE INTERCEPTOR
========================= */
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }

    if (error.response?.status === 403) {
      window.location.href = '/login?error=unauthorized'
    }

    return Promise.reject(error)
  }
)

/* =========================
   USER APIs
========================= */
export const userAPI = {
  getMyBookings: () => apiClient.get('/api/maintenance-request/my'),
}

/* =========================
   ADMIN APIs
========================= */
export const adminAPI = {
  // User Management
  getAllUsers: async (params = {}) => {
    return await apiClient.get('/api/admin/users', { params });
  },
  getUserById: async (id) => {
    return await apiClient.get(`/api/admin/users/${id}`);
  },
  updateUser: async (id, userData) => {
    return await apiClient.put(`/api/admin/users/${id}`, userData);
  },
  deleteUser: async (id) => {
    return await apiClient.delete(`/api/admin/users/${id}`);
  },

  // Maintenance Request Management (Problems)
  getAllRequests: async () => {
    return await apiClient.get('/api/admin/maintenance-requests');
  },
  updateRequest: async (id, requestData) => {
    return await apiClient.put(`/api/admin/maintenance-requests/${id}`, requestData);
  },
  deleteRequest: async (id) => {
    return await apiClient.delete(`/api/admin/maintenance-requests/${id}`);
  },

  // Vendor Management
  getAllVendors: async () => {
    return await apiClient.get('/api/admin/vendors');
  },
  updateVendor: async (id, data) => {
    // If verifying vendor (specific KYC action)
    if (data.isVerified !== undefined) {
      return await apiClient.put(`/api/admin/vendors/${id}/verify`, data);
    }
    return await apiClient.put(`/api/vendors/${id}`, data);
  },
  deleteVendor: async (id) => {
    return await apiClient.delete(`/api/admin/vendors/${id}`);
  },
};

/* =========================
   VENDOR APIs
========================= */
export const vendorAPI = {
  getMaintenanceRequests: () => apiClient.get('/api/maintenance-request'),
};

/*===================
  Booking APIs
======================= */
export const bookingAPI = {
  getAllBookings: () => apiClient.get('/api/bookings'),
  createBooking: (payload) => apiClient.post('/api/bookings', payload),
  updateBookingStatus: (id, status) => apiClient.put(`/api/bookings/${id}/status`, { status })
}

/* SERVICES API */
export const servicesAPI = {
  getAll: () => apiClient.get('/api/services'),
  getById: (id) => apiClient.get(`/api/services/${id}`),
  create: (data) => apiClient.post('/api/services', data),
  update: (id, data) => apiClient.put(`/api/services/${id}`, data),
  delete: (id) => apiClient.delete(`/api/services/${id}`)
}

/* =========================
   CREATE BOOKING / CONTACT
========================= */
export const sendMaintenanceRequest = async (payload) => {
  const response = await apiClient.post('/api/maintenance-request', payload)
  return response.data
}

export default apiClient