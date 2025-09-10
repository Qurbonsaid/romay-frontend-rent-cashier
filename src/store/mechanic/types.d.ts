export type WorkType = 'SERVICE' | 'FIELD_SERVICE'

export interface Mechanic {
  _id: string
  fullName: string
  phone: string
  work_type: WorkType
  branch_id: string
  service_count: number
  created_at: string
  updated_at: string
}

export interface AddMechanicRequest {
  fullName: string
  phone: string
  work_type: WorkType
  branch_id: string
}

export interface AddMechanicResponse {
  success: boolean
  data: Mechanic
  message: string
}

export interface GetAllMechanicsRequest {
  search?: string
  work_type?: WorkType
  branch_id?: string
  page?: number
  limit?: number
}

export interface GetAllMechanicsResponse {
  success: boolean
  data: Mechanic[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}
