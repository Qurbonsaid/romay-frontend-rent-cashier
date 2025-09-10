export interface Branch {
  _id: string
  name: string
  address: string
  manager_ids: {
    _id: string
    username: string
    phone: string
  }[]
}
