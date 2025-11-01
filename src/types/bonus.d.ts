// ==================== BONUS TYPE (Shablon) ====================
export interface BonusType {
  _id: string
  bonus_name: string
  target_amount: number
  discount_amount: number
  branch:
    | string
    | {
        _id: string
        name: string
      }
  created_at: string
  updated_at: string
}

export interface BonusTypeResponse {
  success: boolean
  data: BonusType[]
  pagination: {
    total: number
    total_pages: number
    page: number
    limit: number
    next_page: boolean
    prev_page: boolean
  }
}

export interface SingleBonusTypeResponse {
  success: boolean
  data: BonusType
}

export interface BonusTypeRequest {
  search?: string
  branch_id?: string
  page?: number
  limit?: number
}

export interface AddBonusTypeRequest {
  bonus_name: string
  target_amount: number
  discount_amount: number
  branch: string
}

export interface AddBonusTypeResponse {
  success: boolean
  msg: string
}

export interface UpdateBonusTypeRequest {
  id: string
  body: Partial<AddBonusTypeRequest>
}

export interface UpdateBonusTypeResponse {
  success: boolean
  msg: string
}

// ==================== BONUS (Mijozga berilgan) ====================
export interface ClientBonus {
  _id: string
  bonus_type: {
    _id: string
    bonus_name: string
    target_amount: number
    discount_amount: number
    branch: string
    created_at: string
    updated_at: string
  }
  client: {
    debt: {
      sale_amount: number
      total_amount: number
      currency: string
    }
    _id: string
    username: string
    description: string
    phone: string
    profession: string
    birth_date: string
    branch_id: string
    address: string
    customer_tier: string
    sales_count: number
    created_at: string
    updated_at: string
    service_count: number
    rent_count: number
    total_rent_amount: number
    total_sale_amount: number
    total_service_amount: number
    bonus: string
  }
  branch: {
    _id: string
    name: string
    address: string
    manager_ids: string[]
    sales_balance: number
    service_balance: number
    another_branch_incoming_transfer_balance: number
    total_balance: number
    created_at: string
    updated_at: string
  }
  client_discount_amount: number
  type: 'SERVICE' | 'SALE' | 'RENT'
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface ClientBonusResponse {
  success: boolean
  data: ClientBonus[]
  page_count: number
  current_page: number
  next_page: number
  after_filtering_count: number
}

export interface SingleClientBonusResponse {
  success: boolean
  data: ClientBonus
}

export interface ClientBonusRequest {
  page?: number
  limit?: number
  client?: string
  branch?: string
  type?: 'SERVICE' | 'SALE' | 'RENT'
  search?: string
}

export interface AddClientBonusRequest {
  bonus_type: string
  client: string
  type: 'SERVICE' | 'SALE' | 'RENT'
}

export interface AddClientBonusResponse {
  success: boolean
  msg: string
  data: ClientBonus
}
