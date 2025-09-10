export interface Product {
  id: string | number
  name: string
  category?: string
  status?: string
  price?: string | number
  note?: string
  sku?: string
  stock?: number
  image?: string
  subtitle?: string
  barcode?: string
}
