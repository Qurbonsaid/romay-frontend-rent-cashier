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
  comment?: string
  created_at: string
  updated_at: string
}

export interface DetailedService {
  _id: string
  totalAmount: number
  mechanic: {
    _id: string
    fullName: string
    phone: string
    work_type: string
    service_count: number
    branch_id: string
    created_at: string
    updated_at: string
  }
  branch: string
  client_name: string
  client_phone: string
  mechanic_salary: number
  received_date: string
  delivery_date: string
  status: ServiceStatus
  products: DetailedProduct[]
  payments: any[]
  comment?: string
  created_at: string
  updated_at: string
}

export interface DetailedProduct {
  product: {
    _id: string
    name: string
    category?: string
    category_id?:
      | string
      | {
          _id: string
          name: string
          description: string
          created_at: string
          updated_at: string
        }
    images: string[]
    price: number
    status?: string
    currency?: string
    barcode?: string
    attributes?: any[]
    from_create?: string
    from_create_branch_id?: string
    description?: string
    created_at?: string
    updated_at?: string
  }
  product_count: number
  product_change_price: number
  _id: string
}

export interface Product {
  product: string
  product_count: number
}

export interface AddServiceRequest {
  branch: string
  client_name: string
  client_phone: string
  mechanic?: string
  mechanic_salary?: number
  products: Product[]
  received_date: string
  delivery_date: string
  comment?: string
  discount?: number
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

export interface GetServiceResponse {
  success: boolean
  data: DetailedService
  message: string
}

export interface UpdateServiceRequest {
  id: string
  branch: string
  client_name: string
  client_phone: string
  mechanic: string
  mechanic_salary: number
  products: Product[]
  received_date: string
  delivery_date: string
  comment?: string
}

export interface UpdateServiceResponse {
  success: boolean
  data: Service
  message: string
}

export interface DeleteServiceResponse {
  success: boolean
  message: string
}
