import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type {
  ProductWarehouseItem,
  RentProductWarehouseItem,
} from '@/store/product/types'

type ProductDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  product: ProductWarehouseItem | RentProductWarehouseItem | null
}

const formatPrice = (price?: string | number, currency?: string) => {
  if (price == null) return '0.00 USD'

  const numericPrice =
    typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : price

  return `${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${currency || 'USD'}`
}

// Helper functions to get consistent data from both product types
const getProductName = (
  product: ProductWarehouseItem | RentProductWarehouseItem
): string => {
  return product.product.name
}

const getProductCount = (
  product: ProductWarehouseItem | RentProductWarehouseItem
): number => {
  if ('product_count' in product) {
    return product.product_count
  }
  if ('product_total_count' in product) {
    return product.product_total_count
  }
  return 0
}

const getProductPrice = (
  product: ProductWarehouseItem | RentProductWarehouseItem
): number => {
  if ('product_rent_price' in product) {
    return product.product_rent_price
  }
  if ('price' in product.product) {
    return product.product.price
  }
  return 0
}

const getProductCurrency = (
  product: ProductWarehouseItem | RentProductWarehouseItem
): string => {
  if ('currency' in product.product) {
    return product.product.currency || 'USD'
  }
  return 'USD'
}

const getCategoryName = (
  categoryId: string | { _id: string; name: string }
): string => {
  if (typeof categoryId === 'object' && categoryId?.name) {
    return categoryId.name
  }
  return String(categoryId) || '—'
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader className="mb-5">
          <DialogTitle>Mahsulot tafsilotlari</DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-4">
            <div className="w-full h-40 border p-2 rounded-lg">
              <img
                src={product.product.images[0] || '/vite.svg'}
                alt={getProductName(product)}
                className="w-full h-full rounded-md object-contain"
              />
            </div>
            <div className="grid grid-cols-2 gap-y-4 items-start bg-slate-100 p-3 rounded-md">
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Nomi</span>
                <span className="text-[#111827] font-medium">
                  {getProductName(product)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Narxi</span>
                <span className="text-[#111827] font-medium">
                  {formatPrice(
                    getProductPrice(product),
                    getProductCurrency(product)
                  )}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Kategoriya</span>
                <span className="text-[#111827]">
                  {getCategoryName(product.product.category_id)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Miqdor</span>
                <span className="text-[#111827]">
                  {getProductCount(product)} dona
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Bar-kod</span>
                <span className="text-[#111827] font-mono text-sm">
                  {product.product_barcode}
                </span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm text-[#6B7280]">Holat</span>
                <span
                  className={
                    getProductCount(product) > 0
                      ? 'px-2 py-1 text-xs rounded-sm bg-green-100 text-green-800'
                      : 'px-2 py-1 text-xs rounded-sm bg-red-100 text-red-800'
                  }
                >
                  {getProductCount(product) > 0 ? 'Mavjud' : 'Tugagan'}
                </span>
              </div>
            </div>
            {product.product.description && (
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7280] mb-2">Tavsif</span>
                  <span className="text-[#111827] text-sm">
                    {product.product.description}
                  </span>
                </div>
              </div>
            )}
            {product.product.attributes &&
              product.product.attributes.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-md">
                  <span className="text-sm text-[#6B7280] mb-3 block">
                    Xususiyatlari
                  </span>
                  <div className="grid grid-cols-2 gap-y-2">
                    {product.product.attributes.map((attr, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-xs text-[#6B7280]">
                          {attr.key}
                        </span>
                        <span className="text-sm text-[#111827]">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
