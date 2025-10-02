export type RentStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface RentProduct {
  rent_product: string | RentProductDetail | null
  rent_product_count: number
  rent_change_price?: number
  _id: string
}

export interface Payment {
  amount: number
  type: string
  _id?: string
}

export interface Client {
  debt: {
    amount: number
    currency: string
  }
  sales_count?: number
  _id: string
  username: string
  description: string
  phone: string
  profession: string
  birth_date: string
  branch_id: string
  address: string
  customer_tier: string
  created_at: string
  updated_at: string
}

export interface Branch {
  _id: string
  name: string
  address: string
  manager_ids: string[]
  sales_balance: number
  service_balance: number
  total_balance: number
  created_at: string
  updated_at: string
}

export interface Rent {
  _id: string
  client: Client | null
  branch: Branch
  client_name: string
  total_rent_price: number
  received_date: string
  delivery_date: string
  status: RentStatus
  rent_products: RentProduct[]
  payments: Payment[]
  comment?: string
  created_at: string
  updated_at: string
}

export interface ProductAttribute {
  key: string
  value: string
  _id: string
}

export interface Product {
  _id: string
  name: string
  description: string
  category_id: string | { _id: string; name: string }
  status: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  from_create: string
  created_at: string
  updated_at: string
}

export interface RentProductDetail {
  _id: string
  product_rent_price: number
  product: Product
  product_total_count: number
  product_active_count: number
  branch: string | { _id: string; name: string; address: string }
  product_barcode: string
  from_create: string
  created_at: string
  updated_at: string
}

export interface AddRentRequest {
  branch: string
  client: string
  client_name: string
  rent_products: {
    rent_product: string
    rent_product_count: number
  }[]
  received_date: string
  delivery_date: string
  comment?: string
}

export interface UpdateRentRequest {
  branch?: string
  client?: string
  client_name?: string
  rent_products?: {
    rent_product: string
    rent_product_count: number
  }[]
  received_date?: string
  delivery_date?: string
  comment?: string
}

export interface CompleteRentRequest {
  payments: Payment[]
}

export interface AddRentResponse {
  success: boolean
  data: Rent
  message: string
}

export interface GetAllRentsRequest {
  branch?: string
  client?: string
  status?: RentStatus
  search?: string
  page?: number
  limit?: number
}

export interface GetAllRentsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: Rent[]
}

export interface GetRentResponse {
  success: boolean
  data: Rent
}

export interface GetAllRentProductsRequest {
  search?: string
  page?: number
  limit?: number
  branch?: string
}

export interface GetAllRentProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: RentProductDetail[]
}

export interface GetRentProductResponse {
  success: boolean
  data: RentProductDetail
}

export interface DetailedRentProduct {
  _id: string
  branch: string
  product_barcode: string
  created_at: string
  from_create: string
  product: {
    _id: string
    name: string
    description: string
    category_id: string
    status: string
    images: string[]
    barcode: string
    attributes: Array<{
      key: string
      value: string
      _id: string
    }>
    from_create: string
    created_at: string
    updated_at: string
  }
  product_active_count: number
  product_rent_price: number
  product_total_count: number
  updated_at: string
}

export interface GetDetailedRentProductResponse {
  success: boolean
  data: DetailedRentProduct
}

export interface UpdateDeliveryDateRequest {
  delivery_date: string
}

export interface GenericResponse {
  success: boolean
  message: string
}
