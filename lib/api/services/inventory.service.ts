import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type { InventoryItem, CreateInventoryItemDTO, UpdateInventoryItemDTO, InventoryMovement, PaginatedResponse } from '@/lib/types'

export const inventoryService = {
  /**
   * Obtener todos los items de inventario (con filtros opcionales)
   */
  async getAll(params?: {
    branchId?: string
    category?: string
    stockStatus?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<InventoryItem>> {
    const searchParams = new URLSearchParams()
    if (params?.branchId) searchParams.set('branchId', params.branchId)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.stockStatus) searchParams.set('stockStatus', params.stockStatus)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const url = `${API_ENDPOINTS.INVENTORY.BASE}?${searchParams.toString()}`
    return apiClient.get<PaginatedResponse<InventoryItem>>(url)
  },

  /**
   * Obtener un item por ID
   */
  async getById(id: string): Promise<InventoryItem> {
    return apiClient.get<InventoryItem>(API_ENDPOINTS.INVENTORY.BY_ID(id))
  },

  /**
   * Obtener items con stock bajo
   */
  async getLowStock(branchId?: string): Promise<InventoryItem[]> {
    return apiClient.get<InventoryItem[]>(API_ENDPOINTS.INVENTORY.LOW_STOCK(branchId))
  },

  /**
   * Crear un nuevo item
   */
  async create(data: CreateInventoryItemDTO): Promise<InventoryItem> {
    return apiClient.post<InventoryItem>(API_ENDPOINTS.INVENTORY.BASE, data)
  },

  /**
   * Actualizar un item
   */
  async update(id: string, data: UpdateInventoryItemDTO): Promise<InventoryItem> {
    return apiClient.put<InventoryItem>(API_ENDPOINTS.INVENTORY.BY_ID(id), data)
  },

  /**
   * Eliminar un item
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.INVENTORY.BY_ID(id))
  },

  /**
   * Ajustar cantidad de stock
   */
  async adjustStock(id: string, quantity: number, reason?: string): Promise<InventoryItem> {
    return apiClient.post<InventoryItem>(API_ENDPOINTS.INVENTORY.ADJUST(id), {
      quantity,
      reason,
    })
  },

  /**
   * Obtener historial de movimientos de un item
   */
  async getMovements(itemId: string): Promise<InventoryMovement[]> {
    return apiClient.get<InventoryMovement[]>(API_ENDPOINTS.INVENTORY.MOVEMENTS(itemId))
  },
}
