 

import type { User } from '@/types/user'

export type LoginRequest = {
  phone: string
  password: string
}

export type LoginResponse = {
  success: true
  access_token: string
  refresh_token: string
}

export type UserResponse = {
  data: User
}
