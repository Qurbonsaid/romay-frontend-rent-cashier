/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface ProductAttribute {
  key: string
  value: string
  _id: string
}

export interface Product {
  _id: string
  name: string
  description: string
  category_id: {
    _id: string
    name: string
    description: string
    created_at: string
    updated_at: string
  }
  price: number
  status: string
  currency: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  from_create: string
  created_at: string
  updated_at: string
}

export interface ProductWarehouseItem {
  _id: string
  product: Product
  product_count: number
  branch: string
  product_barcode: string
  from_create: string
  created_at: string
  updated_at: string
}

export interface RentProduct {
  _id: string
  name: string
  description: string
  category_id: {
    _id: string
    name: string
    description: string
    created_at: string
    updated_at: string
  }
  status: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  from_create: string
  created_at: string
  updated_at: string
}

export interface RentProductWarehouseItem {
  _id: string
  product: RentProduct
  product_rent_price: number
  product_total_count: number
  product_active_count: number
  branch: {
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
  product_barcode: string
  from_create: string
  created_at: string
  updated_at: string
  branchObjId: string
}

export interface GetAllProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: ProductWarehouseItem[]
}

export interface GetAllRentProductsResponse {
  success: boolean
  page_count: number
  current_page: number
  next_page: number | null
  after_filtering_count: number
  data: RentProductWarehouseItem[]
}

export interface GetAllProductsRequest {
  page?: number
  limit?: number
  search?: string
  branch?: string
}

export interface CreateProductRequest {
  name: string
  description: string
  category_id: string
  price: number
  status: string
  currency: string
  images: string[]
  barcode: string
  attributes: ProductAttribute[]
  product_count: number
  from_create: string
}

export interface CreateProductResponse {}
