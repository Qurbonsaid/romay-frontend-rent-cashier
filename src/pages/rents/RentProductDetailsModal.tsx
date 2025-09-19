import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetDetailedRentProductQuery } from '@/store/rent/rent.api'
import { Package, Calendar, Barcode, Hash, Tag, Info } from 'lucide-react'

interface RentProductDetailsModalProps {
  productId: string | null
  isOpen: boolean
  onClose: () => void
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-red-500">Xatolik yuz berdi</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {product.product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Images */}
          {product.product.images && product.product.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.product.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`${product.product.name} - ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mahsulot ma'lumotlari
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">Nomi</div>
                  <div className="text-sm text-gray-900">
                    {product.product.name}
                  </div>
                </div>
                {product.product.description && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Info className="h-4 w-4" />
                      Tavsif
                    </div>
                    <div className="text-sm text-gray-900">
                      {product.product.description}
                    </div>
                  </div>
                )}
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
                      : product.product.category_id || 'Kategoriyasiz'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Barcode className="h-4 w-4" />
                    Barkod
                  </div>
                  <div className="text-sm text-gray-900 font-mono">
                    {product.product.barcode}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Holat
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.product.status)}`}
                  >
                    {product.product.status === 'active' ? 'Faol' : 'Nofaol'}
                  </span>
                </div>
              </div>
            </div>

            {/* Rent Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Ijara ma'lumotlari
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Ijara narxi
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {product.product_rent_price > 0
                      ? `${formatPrice(product.product_rent_price)} so'm`
                      : 'Belgilanmagan'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Mavjud miqdori
                  </div>
                  <div className="text-sm text-gray-900">
                    {product.product_active_count} dona
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Jami miqdori
                  </div>
                  <div className="text-sm text-gray-900">
                    {product.product_total_count} dona
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Yaratilgan manbaa
                  </div>
                  <div className="text-sm text-gray-900">
                    {product.from_create === 'WAREHOUSE'
                      ? 'Ombor'
                      : product.from_create}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Attributes */}
          {product.product.attributes &&
            product.product.attributes.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mahsulot xususiyatlari
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.product.attributes.map((attribute) => (
                    <div
                      key={attribute._id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="text-sm font-medium text-gray-700">
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

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sanalar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Mahsulot yaratilgan
                </div>
                <div className="text-sm text-gray-900">
                  {formatDate(product.product.created_at)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Mahsulot yangilangan
                </div>
                <div className="text-sm text-gray-900">
                  {formatDate(product.product.updated_at)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Ijara yaratilgan
                </div>
                <div className="text-sm text-gray-900">
                  {formatDate(product.created_at)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Ijara yangilangan
                </div>
                <div className="text-sm text-gray-900">
                  {formatDate(product.updated_at)}
                </div>
              </div>
            </div>
          </div>

          {/* IDs for debugging */}
          <div className="text-xs text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Mahsulot ID:</span>{' '}
              {product.product._id}
            </div>
            <div>
              <span className="font-medium">Ijara ID:</span> {product._id}
            </div>
            <div>
              <span className="font-medium">Filial ID:</span> {product.branch}
            </div>
            <div>
              <span className="font-medium">Kategoriya ID:</span>{' '}
              {typeof product.product.category_id === 'object'
                ? (product.product.category_id as { _id: string; name: string })
                    ?._id || 'N/A'
                : product.product.category_id}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
