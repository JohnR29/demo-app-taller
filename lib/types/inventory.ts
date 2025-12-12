/**
 * Inventory Types
 * Tipos para inventario que coinciden con la respuesta del backend
 */

export type InventoryStockStatus = "in-stock" | "low-stock" | "out-of-stock"

export type InventoryCategory = 
  | "repuestos"
  | "aceites"
  | "filtros"
  | "neumaticos"
  | "baterias"
  | "herramientas"
  | "consumibles"
  | "otros"

export interface InventoryItem {
  id: string
  branchId: string
  branchName?: string
  sku: string
  name: string
  description?: string
  category: InventoryCategory
  brand?: string
  price: number
  cost: number
  quantity: number
  minStock: number
  maxStock?: number
  stockStatus: InventoryStockStatus
  supplier?: string
  supplierCode?: string
  location?: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateInventoryItemDTO {
  branchId: string
  sku: string
  name: string
  description?: string
  category: InventoryCategory
  brand?: string
  price: number
  cost: number
  quantity: number
  minStock?: number
  maxStock?: number
  supplier?: string
  supplierCode?: string
  location?: string
  imageUrl?: string
  isActive?: boolean
}

export interface UpdateInventoryItemDTO {
  sku?: string
  name?: string
  description?: string
  category?: InventoryCategory
  brand?: string
  price?: number
  cost?: number
  quantity?: number
  minStock?: number
  maxStock?: number
  supplier?: string
  supplierCode?: string
  location?: string
  imageUrl?: string
  isActive?: boolean
}

export type InventoryMovementType = "in" | "out" | "adjustment" | "transfer"

export interface InventoryMovement {
  id: string
  itemId: string
  branchId: string
  type: InventoryMovementType
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason?: string
  orderId?: string
  userId: string
  userName?: string
  createdAt: string
}
