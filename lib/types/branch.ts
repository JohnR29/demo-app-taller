// Tipos para sistema multi-sucursal

export interface Organization {
  id: string
  name: string
  rut: string
  email: string
  phone: string
  logo?: string
  createdAt: Date
}

export interface Branch {
  id: string
  organizationId: string
  name: string
  code: string // código corto: "SUC-001"
  address: string
  city: string
  phone: string
  email: string
  coordinates: {
    lat: number
    lng: number
  }
  isActive: boolean
  isMain: boolean // sucursal principal
  manager?: string
  createdAt: Date
}

export interface UserBranchPermission {
  userId: string
  organizationId: string
  role: "owner" | "admin" | "manager" | "mechanic" | "receptionist"
  branchAccess: string[] // IDs de sucursales a las que tiene acceso
  isGlobalAdmin: boolean // acceso a todas las sucursales
  canTransferStock: boolean
  canViewReports: boolean
}

// Para filtros y contexto
export interface BranchFilter {
  selectedBranchId: string | "all" // "all" = todas las sucursales
  availableBranches: Branch[]
}
