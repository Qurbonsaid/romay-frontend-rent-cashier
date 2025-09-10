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
}
