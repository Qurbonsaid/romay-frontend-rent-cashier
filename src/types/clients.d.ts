export interface Client {
  _id: string
  username: string
  description: string
  phone: string
  profession: string
  birth_date: string
  branch_id: {
    _id: string
    name: string
    address: string
  }
  address: string
  debt: {
    sale_amount: number
    total_amount: number
    currency: string
  }
  customer_tier: string
  sales_count: number
  created_at: string
  updated_at: string
  service_count: number
  rent_count: number
  total_rent_amount?: number
  total_sale_amount?: number
  total_service_amount?: number
  bonus?: {
    _id: string
    bonus_type: {
      _id: string
      bonus_name: string
      target_amount: number
      discount_amount: number
    }
    client: string
    branch: string
    client_discount_amount: number
    start_date: string
    end_date: string
    type: 'SERVICE' | 'SALE' | 'RENT'
    created_at: string
    updated_at: string
  }
}
