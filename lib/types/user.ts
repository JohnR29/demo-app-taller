/**
 * User Types
 * Tipos para usuarios que coinciden con la respuesta del backend
 */

export type UserRole = "admin" | "manager" | "mechanic" | "receptionist" | "viewer"

export interface User {
  id: string
  organizationId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  branchIds: string[]
  defaultBranchId: string
  isActive: boolean
  avatar?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserDTO {
  organizationId: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  branchIds: string[]
  defaultBranchId: string
  isActive?: boolean
  avatar?: string
}

export interface UpdateUserDTO {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: UserRole
  branchIds?: string[]
  defaultBranchId?: string
  isActive?: boolean
  avatar?: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface ChangePasswordDTO {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
