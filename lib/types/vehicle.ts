/**
 * Vehicle Types
 * Tipos para vehículos que coinciden con la respuesta del backend
 */

export type TransmissionType = "manual" | "automatic"
export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid"

export interface Vehicle {
  id: string
  clientId: string
  licensePlate: string
  brand: string
  model: string
  year: number
  color?: string
  vin?: string
  engineNumber?: string
  transmission?: TransmissionType
  fuelType?: FuelType
  mileage?: number
  lastServiceDate?: string
  nextServiceDate?: string
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVehicleDTO {
  clientId: string
  licensePlate: string
  brand: string
  model: string
  year: number
  color?: string
  vin?: string
  engineNumber?: string
  transmission?: TransmissionType
  fuelType?: FuelType
  mileage?: number
  lastServiceDate?: string
  nextServiceDate?: string
  notes?: string
  isActive?: boolean
}

export interface UpdateVehicleDTO {
  licensePlate?: string
  brand?: string
  model?: string
  year?: number
  color?: string
  vin?: string
  engineNumber?: string
  transmission?: TransmissionType
  fuelType?: FuelType
  mileage?: number
  lastServiceDate?: string
  nextServiceDate?: string
  notes?: string
  isActive?: boolean
}
