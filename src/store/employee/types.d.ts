/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Employee {
  _id: string
  username: string
  phone: string
  address: string
  role: string
  branch_id: {
    _id: string
    name: string
    address: string
  }
}

export interface GetEmployeesRequest {
  page?: number
  limit?: number
  search?: string
  branch?: string
}

export interface GetEmployeesResponse {
  data: Employee[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AddEmployeeRequest {
  username: string
  phone: string
  password: string
  address: string
  branch_id: string
  role: string
}

export interface UpdateEmployeeRequest {
  id: string
  body: Partial<Omit<AddEmployeeRequest, 'id' | 'password'>>
}

export interface AddEmployeeResponse extends Employee {}
export interface UpdateEmployeeResponse extends Employee {}

export interface GetEmployeeResponse {
  data: Employee
}
