/**
 * Appointment Types
 * Tipos para citas que coinciden con la respuesta del backend
 */

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface Appointment {
  id: string
  branchId: string
  branchName?: string
  clientId: string
  vehicleId: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  vehicle?: string
  service: string
  date: string
  time: string
  duration: number
  status: AppointmentStatus
  hasParts: boolean
  notes?: string
  reminderSent: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentDTO {
  branchId: string
  clientId: string
  vehicleId: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  service: string
  date: string
  time: string
  duration: number
  status: AppointmentStatus
  hasParts?: boolean
  notes?: string
}

export interface UpdateAppointmentDTO {
  clientName?: string
  clientPhone?: string
  clientEmail?: string
  service?: string
  date?: string
  time?: string
  duration?: number
  status?: AppointmentStatus
  hasParts?: boolean
  notes?: string
}
