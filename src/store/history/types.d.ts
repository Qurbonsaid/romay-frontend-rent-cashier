import type { History } from '@/types/history'

export type GetHistoryRequest = {
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ'
  model?: 'Client' | 'Employee' | 'Branch' | 'Birthday'
  user_id?: string
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
}

export type GetHistoryResponse = {
  data: History[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}

export type GetOneHistoryResponse = {
  data: History
}
