/**
 * API Endpoints Configuration
 * Centraliza todas las rutas de la API para fácil mantenimiento
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    ME: `${API_BASE_URL}/auth/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },

  // Branches
  BRANCHES: {
    BASE: `${API_BASE_URL}/branches`,
    BY_ID: (id: string) => `${API_BASE_URL}/branches/${id}`,
    STATS: (id: string) => `${API_BASE_URL}/branches/${id}/stats`,
  },

  // Clients
  CLIENTS: {
    BASE: `${API_BASE_URL}/clients`,
    BY_ID: (id: string) => `${API_BASE_URL}/clients/${id}`,
    VEHICLES: (id: string) => `${API_BASE_URL}/clients/${id}/vehicles`,
    ORDERS: (id: string) => `${API_BASE_URL}/clients/${id}/orders`,
    APPOINTMENTS: (id: string) => `${API_BASE_URL}/clients/${id}/appointments`,
  },

  // Vehicles
  VEHICLES: {
    BASE: `${API_BASE_URL}/vehicles`,
    BY_ID: (id: string) => `${API_BASE_URL}/vehicles/${id}`,
    HISTORY: (id: string) => `${API_BASE_URL}/vehicles/${id}/history`,
  },

  // Orders
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    BY_ID: (id: string) => `${API_BASE_URL}/orders/${id}`,
    BY_BRANCH: (branchId: string) => `${API_BASE_URL}/orders?branchId=${branchId}`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/orders/${id}/status`,
    ADD_PARTS: (id: string) => `${API_BASE_URL}/orders/${id}/parts`,
    COMPLETE: (id: string) => `${API_BASE_URL}/orders/${id}/complete`,
  },

  // Appointments
  APPOINTMENTS: {
    BASE: `${API_BASE_URL}/appointments`,
    BY_ID: (id: string) => `${API_BASE_URL}/appointments/${id}`,
    BY_BRANCH: (branchId: string) => `${API_BASE_URL}/appointments?branchId=${branchId}`,
    BY_DATE: (branchId: string, date: string) => 
      `${API_BASE_URL}/appointments?branchId=${branchId}&date=${date}`,
    CONFIRM: (id: string) => `${API_BASE_URL}/appointments/${id}/confirm`,
    CANCEL: (id: string) => `${API_BASE_URL}/appointments/${id}/cancel`,
  },

  // Inventory
  INVENTORY: {
    BASE: `${API_BASE_URL}/inventory`,
    BY_ID: (id: string) => `${API_BASE_URL}/inventory/${id}`,
    BY_BRANCH: (branchId: string) => `${API_BASE_URL}/inventory?branchId=${branchId}`,
    LOW_STOCK: (branchId?: string) => 
      `${API_BASE_URL}/inventory/low-stock${branchId ? `?branchId=${branchId}` : ''}`,
    MOVEMENTS: (itemId: string) => `${API_BASE_URL}/inventory/${itemId}/movements`,
    ADJUST: (id: string) => `${API_BASE_URL}/inventory/${id}/adjust`,
  },

  // Users
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
    BY_BRANCH: (branchId: string) => `${API_BASE_URL}/users?branchId=${branchId}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: (branchId?: string) => 
      `${API_BASE_URL}/dashboard/stats${branchId ? `?branchId=${branchId}` : ''}`,
    REVENUE: (branchId: string, period: string) => 
      `${API_BASE_URL}/dashboard/revenue?branchId=${branchId}&period=${period}`,
  },

  // Reports
  REPORTS: {
    ORDERS: `${API_BASE_URL}/reports/orders`,
    INVENTORY: `${API_BASE_URL}/reports/inventory`,
    REVENUE: `${API_BASE_URL}/reports/revenue`,
    CLIENTS: `${API_BASE_URL}/reports/clients`,
  },

  // Public (Portal)
  PUBLIC: {
    WORKSHOPS: `${API_BASE_URL}/public/workshops`,
    WORKSHOP_BY_ID: (id: string) => `${API_BASE_URL}/public/workshops/${id}`,
    BOOK_APPOINTMENT: `${API_BASE_URL}/public/appointments`,
    ORDER_DETAILS: (id: string) => `${API_BASE_URL}/public/orders/${id}`,
    VEHICLE_HISTORY: (licensePlate: string) => 
      `${API_BASE_URL}/public/vehicles/${licensePlate}/history`,
  },
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
