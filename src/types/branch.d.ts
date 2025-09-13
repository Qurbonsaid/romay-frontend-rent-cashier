export interface Branch {
  _id: string
  name: string
  address: string
  manager_ids: {
    _id: string
    username: string
    phone: string
  }[]
  sales_balance: number
  service_balance: number
  total_balance: number
  created_at: string
  updated_at: string
}
