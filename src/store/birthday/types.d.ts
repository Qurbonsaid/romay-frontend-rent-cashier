/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Birthday {
  id: string
  employeeId: string
  employeeName: string
  date: string
  department: string
  position: string
  photo?: string
  createdAt: string
  updatedAt: string
}

export interface GetBirthdaysRequest {
  month?: number
  page?: number
  limit?: number
  search?: string
}

export interface GetBirthdaysResponse {
  data: Birthday[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AddBirthdayRequest {
  employeeId: string
  date: string
}

export interface UpdateBirthdayRequest {
  id: string
  body: {
    date?: string
    isCelebrated?: boolean
  }
}

export interface AddBirthdayResponse extends Birthday {}
export interface UpdateBirthdayResponse extends Birthday {}
