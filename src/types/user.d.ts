import type { Role } from '@/constants/roles'

export interface User {
  _id: string
  username: string
  phone: string
  role: Role
  branch_id: {
    _id: string
    name: string
    address: string
  }
}
