/**
 * Client Types
 * Tipos para clientes que coinciden con la respuesta del backend
 */

export type ClientType = "individual" | "business"

export interface Client {
  id: string
  organizationId: string
  type: ClientType
  firstName: string
  lastName: string
  email: string
  phone: string
  secondaryPhone?: string
  address?: string
  city?: string
  rut?: string
  businessName?: string
  taxId?: string
  notes?: string
  preferredBranchId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateClientDTO {
  organizationId: string
  type: ClientType
  firstName: string
  lastName: string
  email: string
  phone: string
  secondaryPhone?: string
  address?: string
  city?: string
  rut?: string
  businessName?: string
  taxId?: string
  notes?: string
  preferredBranchId?: string
  isActive?: boolean
}

export interface UpdateClientDTO {
  type?: ClientType
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  secondaryPhone?: string
  address?: string
  city?: string
  rut?: string
  businessName?: string
  taxId?: string
  notes?: string
  preferredBranchId?: string
  isActive?: boolean
}
