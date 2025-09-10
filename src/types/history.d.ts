export interface History {
  _id: string
  user_id: {
    _id: string
    username: string
    phone: string
  }
  action: string
  model: string
  document_id: string
  oldData: {
    username: string
    phone: string
  }
  newData: {
    username: string
    phone: string
  }
  description: string
  created_at: string
}
