/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ClientResponse {
  success: boolean
  data: Client[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}

export interface SingleClientResponse {
  success: boolean
  data: Client
}

export interface ClientRequest {
  search?: string
  branch_id?: string
  page?: number
  limit?: number
}

export interface AddClientResponse {}

export interface AddClientRequest {
  username: string
  description: string
  phone: string
  profession: string
  birth_date: string
  branch_id: string
  address: string
}

export interface UpdateClientResponse {}

export interface UpdateClientRequest {
  id: string
  body: Partial<Client>
}
