import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Package, AlertCircle } from 'lucide-react'
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

const getProductName = (
  product: ProductWarehouseItem | RentProductWarehouseItem
): string => {
  if (
    typeof product.product === 'object' &&
    product.product &&
    'name' in product.product
  ) {
    return product.product.name
  }
  return "Noma'lum mahsulot"
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
  if (
    typeof product.product === 'object' &&
    product.product &&
    'price' in product.product
  ) {
    return product.product.price
  }
  return 0
}

const getProductCurrency = (
  product: ProductWarehouseItem | RentProductWarehouseItem
): string => {
  if (
    typeof product.product === 'object' &&
    product.product &&
    'currency' in product.product
  ) {
    return product.product.currency || 'USD'
  }
  return 'USD'
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  if (!product) return null

  const productName = getProductName(product)
  const productCount = getProductCount(product)
  const productPrice = getProductPrice(product)
  const productCurrency = getProductCurrency(product)
  const isAvailable = productCount > 0
  const isRentProduct = 'product_rent_price' in product

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mahsulot ma'lumotlari</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Image and Basic Info */}
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src={
                    typeof product.product === 'object' &&
                    product.product &&
                    'images' in product.product &&
                    product.product.images?.length > 0
                      ? product.product.images[0]
                      : '/vite.svg'
                  }
                  alt={productName}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Product Name and Status */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {productName}
              </h3>
              <Badge
                variant={isAvailable ? 'default' : 'destructive'}
                className="text-sm"
              >
                {isAvailable ? (
                  <Package className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {isAvailable ? 'Mavjud' : 'Tugagan'}
              </Badge>
              {isRentProduct && (
                <Badge variant="secondary" className="text-sm ml-2">
                  Ijara mahsuloti
                </Badge>
              )}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">NARXI</div>
              <div className="text-lg font-bold text-green-600">
                {formatPrice(productPrice, productCurrency)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">MIQDORI</div>
              <div className="text-lg font-bold text-blue-600">
                {productCount} dona
              </div>
            </div>

            <div className="text-center col-span-2 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 font-medium">
                YARATILGAN SANA
              </div>
              <div className="text-lg font-bold text-purple-600">
                {product.created_at
                  ? new Date(product.created_at).toLocaleDateString('en-GB')
                  : "Noma'lum"}
              </div>
            </div>
          </div>

          {/* Product Details */}
          {typeof product.product === 'object' && product.product && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-900 mb-2">
                Qo'shimcha ma'lumotlar
              </div>
              <div className="space-y-1 text-blue-700">
                {(() => {
                  const prod = product.product as any
                  return (
                    <>
                      {prod?.category && (
                        <div className="text-sm">
                          Kategoriya: {String(prod.category)}
                        </div>
                      )}
                      {prod?.description && (
                        <div className="text-sm">
                          Tavsif: {String(prod.description)}
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Availability Status */}
          <div className="flex justify-center">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isAvailable ? 'Sotuvga tayyor' : "Kutish ro'yxatida"}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
