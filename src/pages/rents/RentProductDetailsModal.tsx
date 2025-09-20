import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetDetailedRentProductQuery } from '@/store/rent/rent.api'
import { Package, Barcode, Tag, Info } from 'lucide-react'

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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {product.product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Image */}
          {product.product.images && product.product.images.length > 0 && (
            <div className="flex justify-center">
              <img
                src={product.product.images[0]}
                alt={product.product.name}
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Product Information - Arranged in two rows */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mahsulot ma'lumotlari
            </h3>

            {/* First Row */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Kategoriya
                </div>
                <div className="text-sm text-gray-900">
                  {typeof product.product.category_id === 'object'
                    ? (
                        product.product.category_id as {
                          _id: string
                          name: string
                        }
                      )?.name || 'Kategoriyasiz'
                    : 'Kategoriyasiz'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Barcode className="h-4 w-4" />
                  Bar kod
                </div>
                <div className="text-sm text-gray-900 font-mono">
                  {product.product.barcode || "Kod yo'q"}
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Ijara narxi
                </div>
                <div className="text-lg font-bold text-green-600">
                  {product.product_rent_price > 0
                    ? `${formatPrice(product.product_rent_price)} so'm`
                    : 'Belgilanmagan'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Mavjud miqdori
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {product.product_active_count} dona
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.product.description && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                <Info className="h-4 w-4" />
                Tavsif
              </h4>
              <div className="text-sm text-gray-900">
                {product.product.description}
              </div>
            </div>
          )}

          {/* Product Attributes */}
          {product.product.attributes &&
            product.product.attributes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Mahsulot xususiyatlari
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {product.product.attributes.map((attribute) => (
                    <div key={attribute._id} className="bg-gray-50 rounded p-3">
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
      </DialogContent>
    </Dialog>
  )
}
