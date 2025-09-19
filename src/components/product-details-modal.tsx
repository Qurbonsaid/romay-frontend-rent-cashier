import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate } from '@/utils/formatDate'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Package,
  Barcode,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Settings,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
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
  // Check if product.product is an object and has price property
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
  // Check if product.product is an object and has currency property
  if (
    typeof product.product === 'object' &&
    product.product &&
    'currency' in product.product
  ) {
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

  const productCount = getProductCount(product)
  const productPrice = getProductPrice(product)
  const productCurrency = getProductCurrency(product)
  const isAvailable = productCount > 0
  const isRentProduct = 'product_rent_price' in product

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Mahsulot tafsilotlari
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Image Section */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square w-full max-w-md mx-auto bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={
                      typeof product.product === 'object' &&
                      product.product &&
                      'images' in product.product &&
                      product.product.images?.length > 0
                        ? product.product.images[0]
                        : '/vite.svg'
                    }
                    alt={getProductName(product)}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Additional Images */}
                {typeof product.product === 'object' &&
                  product.product &&
                  'images' in product.product &&
                  product.product.images?.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {product.product.images
                        .slice(1, 5)
                        .map((image, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-md overflow-hidden"
                          >
                            <img
                              src={image}
                              alt={`${getProductName(product)} ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Status and Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Holat va ko'rsatkichlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mavjudlik:</span>
                  <Badge
                    variant={isAvailable ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {isAvailable ? (
                      <Package className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {isAvailable ? 'Mavjud' : 'Tugagan'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Turi:</span>
                  <Badge variant="outline">
                    {isRentProduct ? 'Ijaraga' : 'Sotuvga'}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {productCount}
                    </div>
                    <div className="text-xs text-blue-700">Jami miqdor</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {formatPrice(productPrice, productCurrency)}
                    </div>
                    <div className="text-xs text-green-700">Narx</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Asosiy ma'lumotlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mahsulot nomi
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {getProductName(product)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        Kategoriya
                      </label>
                      <p className="text-gray-900 mt-1">
                        {typeof product.product === 'object' &&
                        product.product &&
                        'category_id' in product.product
                          ? getCategoryName(product.product.category_id)
                          : '—'}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Barcode className="h-4 w-4" />
                        Bar-kod
                      </label>
                      <p className="text-gray-900 font-mono text-sm mt-1">
                        {product.product_barcode}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Narx
                      </label>
                      <p className="text-xl font-bold text-green-600 mt-1">
                        {formatPrice(productPrice, productCurrency)}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Miqdor
                      </label>
                      <p className="text-xl font-bold text-blue-600 mt-1">
                        {productCount} dona
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {typeof product.product === 'object' &&
              product.product &&
              'description' in product.product &&
              product.product.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Tavsif
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {product.product.description}
                    </p>
                  </CardContent>
                </Card>
              )}

            {/* Attributes */}
            {typeof product.product === 'object' &&
              product.product &&
              'attributes' in product.product &&
              product.product.attributes &&
              product.product.attributes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Xususiyatlari
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {product.product.attributes.map((attr, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium text-gray-700">
                            {attr.key}
                          </span>
                          <span className="text-gray-900 bg-white px-3 py-1 rounded-md">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Timeline/Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tarix ma'lumotlari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Yaratilgan:</span>
                  <span className="text-gray-900">
                    {isRentProduct
                      ? formatDate(product.created_at, false)
                      : typeof product.product === 'object' &&
                          product.product &&
                          'created_at' in product.product
                        ? formatDate(product.product.created_at, false)
                        : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Yangilangan:</span>
                  <span className="text-gray-900">
                    {isRentProduct
                      ? formatDate(product.updated_at, false)
                      : typeof product.product === 'object' &&
                          product.product &&
                          'updated_at' in product.product
                        ? formatDate(product.product.updated_at, false)
                        : '—'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
