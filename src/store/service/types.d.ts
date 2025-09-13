export type ServiceStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Service {
  _id: string
  totalAmount: number
  mechanic: string | null
  branch: string
  client_name: string
  client_phone: string
  mechanic_salary: number
  received_date: string
  delivery_date: string
  status: ServiceStatus
  products: Product[]
  payments: any[]
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
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: Service[]
}
