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
}
