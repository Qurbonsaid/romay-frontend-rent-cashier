/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface AddBranchResponse {}
export interface AddBranchRequest {
  name: string
  address: string
  manager_ids?: string[]
}

export interface UpdateBranchResponse {}
export interface UpdateBranchRequest {
  id: string
  body: {
    name?: string
    address?: string
    manager_ids?: string[]
  }
}

export interface GetBranchesResponse {
  success: boolean
  data: Branch[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: false
  }
}
export interface GetBranchesRequest {
  search?: string
  page?: number
  limit?: number
}
