/**
 * API Response Types
 * Tipos genéricos para respuestas paginadas y errores
 */

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiErrorResponse {
  error: string
  message: string
  statusCode: number
  details?: any
}

export interface SuccessResponse<T = any> {
  success: boolean
  data: T
  message?: string
}
