import { apiClient } from '../client'
import { API_ENDPOINTS } from '../endpoints'
import type { Appointment, CreateAppointmentDTO, UpdateAppointmentDTO, PaginatedResponse } from '@/lib/types'

export const appointmentsService = {
  /**
   * Obtener todas las citas (con filtros opcionales)
   */
  async getAll(params?: {
    branchId?: string
    status?: string
    date?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Appointment>> {
    const searchParams = new URLSearchParams()
    if (params?.branchId) searchParams.set('branchId', params.branchId)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.date) searchParams.set('date', params.date)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const url = `${API_ENDPOINTS.APPOINTMENTS.BASE}?${searchParams.toString()}`
    return apiClient.get<PaginatedResponse<Appointment>>(url)
  },

  /**
   * Obtener una cita por ID
   */
  async getById(id: string): Promise<Appointment> {
    return apiClient.get<Appointment>(API_ENDPOINTS.APPOINTMENTS.BY_ID(id))
  },

  /**
   * Obtener citas por fecha y sucursal
   */
  async getByDate(branchId: string, date: string): Promise<Appointment[]> {
    return apiClient.get<Appointment[]>(API_ENDPOINTS.APPOINTMENTS.BY_DATE(branchId, date))
  },

  /**
   * Crear una nueva cita
   */
  async create(data: CreateAppointmentDTO): Promise<Appointment> {
    return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.BASE, data)
  },

  /**
   * Actualizar una cita
   */
  async update(id: string, data: UpdateAppointmentDTO): Promise<Appointment> {
    return apiClient.put<Appointment>(API_ENDPOINTS.APPOINTMENTS.BY_ID(id), data)
  },

  /**
   * Eliminar una cita
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.APPOINTMENTS.BY_ID(id))
  },

  /**
   * Confirmar una cita
   */
  async confirm(id: string): Promise<Appointment> {
    return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CONFIRM(id), {})
  },

  /**
   * Cancelar una cita
   */
  async cancel(id: string, reason?: string): Promise<Appointment> {
    return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENTS.CANCEL(id), { reason })
  },
}
