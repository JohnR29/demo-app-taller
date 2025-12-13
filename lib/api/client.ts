/**
 * API Client
 * Cliente HTTP configurado con interceptores para autenticación y manejo de errores
 */

type RequestConfig = {
  headers?: Record<string, string>
  cache?: RequestCache
  next?: { revalidate?: number }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    const token = this.getAuthToken()
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }

      // Si es 401, limpiar token y redirigir a login
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      throw new ApiError(
        response.status,
        errorData.message || 'Error en la solicitud',
        errorData
      )
    }

    // Si la respuesta es 204 (No Content), devolver null
    if (response.status === 204) {
      return null as T
    }

    return response.json()
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(config?.headers),
      cache: config?.cache,
      next: config?.next,
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data),
      cache: config?.cache,
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(url: string, data: any, config?: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data),
      cache: config?.cache,
    })
    return this.handleResponse<T>(response)
  }

  async patch<T>(url: string, data: any, config?: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(config?.headers),
      body: JSON.stringify(data),
      cache: config?.cache,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(config?.headers),
      cache: config?.cache,
    })
    return this.handleResponse<T>(response)
  }

  // Upload de archivos (multipart/form-data)
  async upload<T>(url: string, formData: FormData, config?: RequestConfig): Promise<T> {
    const headers = { ...config?.headers }
    const token = this.getAuthToken()
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // No establecer Content-Type, el navegador lo hará automáticamente con el boundary
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })
    return this.handleResponse<T>(response)
  }
}

export const apiClient = new ApiClient()

// Hook para uso en componentes de React
export function useApiClient() {
  return apiClient
}
