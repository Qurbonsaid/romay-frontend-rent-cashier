export type ServiceStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Service {
  _id: string
  branch: string
  client_name: string
  client_phone: string
  mechanic: string
  servicePrice: number
  received_date: string
  delivery_date: string
  status: ServiceStatus
  created_at: string
  updated_at: string
}

export interface Product {
  product: string
  product_count: number
}

export interface AddServiceRequest {
  branch: string
  client_name: string
  client_phone: string
  mechanic: string
  mechanic_salary: number
  products?: Product[]
  received_date: string
  delivery_date: string
}

export interface AddServiceResponse {
  success: boolean
  data: Service
  message: string
}

export interface GetAllServicesRequest {
  status?: ServiceStatus
  search?: string
  branch?: string
  mechanic?: string
  page?: number
  limit?: number
}

export interface GetAllServicesResponse {
  success: boolean
  data: Service[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}
