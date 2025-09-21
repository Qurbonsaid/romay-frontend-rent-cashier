import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useGetDetailedRentProductQuery } from '@/store/rent/rent.api'

interface RentProductDetailsModalProps {
  productId: string | null
  isOpen: boolean
  onClose: () => void
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'out_of_stock':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-blue-100 text-blue-800'
  }
}

export default function RentProductDetailsModal({
  productId,
  isOpen,
  onClose,
}: RentProductDetailsModalProps) {
  const {
    data: productData,
    isLoading,
    error,
  } = useGetDetailedRentProductQuery(productId!, {
    skip: !productId || !isOpen,
  })

  const product = productData?.data

  if (!isOpen || !productId) return null

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-500">Yuklanmoqda...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !product) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-red-500">Xatolik yuz berdi</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

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
              {product.product.images && product.product.images.length > 0 ? (
                <img
                  src={product.product.images[0]}
                  alt={product.product.name}
                  className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400 text-lg">Rasm yo'q</span>
                </div>
              )}
            </div>

            {/* Product Name and Category */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {typeof product.product.category_id === 'object'
                  ? (
                      product.product.category_id as {
                        _id: string
                        name: string
                      }
                    )?.name
                  : 'Kategoriyasiz'}
              </p>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">
                MAVJUD MIQDOR
              </div>
              <div className="text-xl font-bold text-blue-600">
                {product.product_active_count}
              </div>
              <div className="text-xs text-gray-400">dona</div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">
                KUNLIK NARX
              </div>
              <div className="text-xl font-bold text-green-600">
                {product.product_rent_price > 0
                  ? formatPrice(product.product_rent_price)
                  : '0'}
              </div>
              <div className="text-xs text-gray-400">so'm</div>
            </div>
          </div>

          {/* Additional Information */}
          {product.product.barcode && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Barcode</div>
              <div className="font-mono text-blue-700">
                {product.product.barcode}
              </div>
            </div>
          )}

          {/* Product Description */}
          {product.product.description && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">
                Ta'rif
              </div>
              <p className="text-gray-600 text-sm">
                {product.product.description}
              </p>
            </div>
          )}

          {/* Product Attributes */}
          {product.product.attributes &&
            product.product.attributes.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Mahsulot xususiyatlari
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.product.attributes.map((attribute) => (
                    <div key={attribute._id} className="bg-gray-50 rounded p-2">
                      <div className="text-xs font-medium text-gray-600">
                        {attribute.key}
                      </div>
                      <div className="text-sm text-gray-900">
                        {attribute.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Status */}
          <div className="flex justify-center">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(product.product.status)}`}
            >
              {product.product.status === 'active' ? 'Faol' : 'Nofaol'}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Yopish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
