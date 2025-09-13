/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface Category {
  _id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface GetAllCategoryResponse {
  success: boolean
  data: Category[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}

export interface GetAllCategoryRequest {}
