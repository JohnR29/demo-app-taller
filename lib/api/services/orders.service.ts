import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type { Order, CreateOrderDTO, UpdateOrderDTO, PaginatedResponse } from '@/lib/types'

export const ordersService = {
  /**
   * Obtener todas las órdenes (con filtros opcionales)
   */
  async getAll(params?: {
    branchId?: string
    status?: string
    clientId?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams()
    if (params?.branchId) searchParams.set('branchId', params.branchId)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.clientId) searchParams.set('clientId', params.clientId)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const url = `${API_ENDPOINTS.ORDERS.BASE}?${searchParams.toString()}`
    return apiClient.get<PaginatedResponse<Order>>(url)
  },

  /**
   * Obtener una orden por ID
   */
  async getById(id: string): Promise<Order> {
    return apiClient.get<Order>(API_ENDPOINTS.ORDERS.BY_ID(id))
  },

  /**
   * Crear una nueva orden
   */
  async create(data: CreateOrderDTO): Promise<Order> {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.BASE, data)
  },

  /**
   * Actualizar una orden
   */
  async update(id: string, data: UpdateOrderDTO): Promise<Order> {
    return apiClient.put<Order>(API_ENDPOINTS.ORDERS.BY_ID(id), data)
  },

  /**
   * Eliminar una orden
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.ORDERS.BY_ID(id))
  },

  /**
   * Actualizar el estado de una orden
   */
  async updateStatus(id: string, status: string): Promise<Order> {
    return apiClient.patch<Order>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status })
  },

  /**
   * Agregar repuestos a una orden
   */
  async addParts(id: string, parts: any[]): Promise<Order> {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.ADD_PARTS(id), { parts })
  },

  /**
   * Completar una orden
   */
  async complete(id: string, finalCost: number): Promise<Order> {
    return apiClient.post<Order>(API_ENDPOINTS.ORDERS.COMPLETE(id), { finalCost })
  },
}
