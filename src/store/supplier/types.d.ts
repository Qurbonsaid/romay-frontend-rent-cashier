/* eslint-export interface Supplier {
  _id: string
  full_name: string
  phone: string
  total_product_count: number
  total_debt: number
  type: 'PRODUCT_SUPPLIER' | 'RENTAL_SUPPLIER'
  supply_category: SupplierCategory[] | string[] // Support both formats
  created_at: string
  updated_at: string
}pescript-eslint/no-empty-object-type */

export interface SupplierCategory {
  _id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  _id: string
  full_name: string
  phone: string
  total_product_count: number
  total_debt: number
  type: 'PRODUCT_SUPPLIER' | string
  supply_category: SupplierCategory[]
  created_at: string
  updated_at: string
}

export interface GetAllSuppliersResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: Supplier[]
}

export interface GetAllSuppliersRequest {
  search?: string
  type?:
    | 'PRODUCT_SUPPLIER'
    | 'RENTAL_SUPPLIER'
    | 'PRODUCT_SUPPLIER'
    | 'RENTAL_SUPPLIER'
  page?: number
  limit?: number
}

export interface AddSupplierResponse {
  success: boolean
}

export interface AddSupplierRequest {
  full_name: string
  phone: string
  type: 'PRODUCT_SUPPLIER' | 'RENTAL_SUPPLIER'
  supply_category: string[]
}

export interface UpdateSupplierResponse {
  success: boolean
}
export interface UpdateSupplierRequest {
  id: string
  body: Partial<AddSupplierRequest>
}

export interface GetOneSupplierResponse {
  success: boolean
  data: Supplier
}

export interface GetOneSupplierRequest {
  id: string
}

export interface DebtPaymentRequest {
  id: string
  amount: number
}

export interface DebtPaymentResponse {
  success: boolean
}

export interface UpdateDebtPaymentRequest {
  id: string
  payId: string
  amount: number
}

export interface UpdateDebtPaymentResponse {
  success: boolean
}

export interface DebtPayment {
  _id: string
  supplier: string | Supplier
  total_debt: number
  paid_amount: number
  from_staff: string
  created_at: string
  updated_at: string
}

export interface GetAllDebtPaymentsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: DebtPayment[]
}

export interface GetAllDebtPaymentsRequest {
  id: string
}

export interface SaleProduct {
  _id: string
  name: string
  quantity: number
  price: number
  created_at: string
  updated_at: string
}

export interface RentProduct {
  _id: string
  name: string
  quantity: number
  daily_price: number
  created_at: string
  updated_at: string
}

export interface SaleProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: SaleProduct[]
}

export interface SaleProductRequest {
  id: string
}

export interface RentProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: RentProduct[]
}

export interface RentProductsRequest {
  id: string
}
