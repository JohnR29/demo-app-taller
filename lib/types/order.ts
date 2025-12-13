/**
 * Order Types
 * Tipos para órdenes de trabajo que coinciden con la respuesta del backend
 */

export type OrderStatus = "pending" | "in-progress" | "completed" | "cancelled"

export interface OrderPart {
  id: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Order {
  id: string
  branchId: string
  branchName?: string
  clientId: string
  clientName?: string
  vehicleId: string
  vehicle?: string
  service: string
  description?: string
  status: OrderStatus
  parts: OrderPart[]
  laborCost: number
  partsCost: number
  estimatedCost: number
  finalCost?: number
  assignedMechanicId?: string
  assignedMechanicName?: string
  startDate: string
  estimatedCompletionDate?: string
  completionDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderDTO {
  branchId: string
  clientId: string
  vehicleId: string
  service: string
  description?: string
  status: OrderStatus
  parts?: OrderPart[]
  laborCost?: number
  estimatedCost: number
  assignedMechanicId?: string
  startDate: string
  estimatedCompletionDate?: string
  notes?: string
}

export interface UpdateOrderDTO {
  service?: string
  description?: string
  status?: OrderStatus
  parts?: OrderPart[]
  laborCost?: number
  estimatedCost?: number
  finalCost?: number
  assignedMechanicId?: string
  estimatedCompletionDate?: string
  completionDate?: string
  notes?: string
}
