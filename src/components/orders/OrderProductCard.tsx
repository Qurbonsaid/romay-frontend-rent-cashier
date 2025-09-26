import { useState } from 'react'
import { useGetDetailedRentProductQuery } from '@/store/rent/rent.api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronDown,
  ChevronUp,
  Tag,
  Barcode,
  AlertCircle,
  Package,
} from 'lucide-react'
import type { RentProduct } from '@/store/rent/types'

interface OrderProductCardProps {
  rentProduct: RentProduct
}

export function OrderProductCard({ rentProduct }: OrderProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Debug logging to see what data we're getting
  // console.log('RentProduct data:', rentProduct)

  const {
    data: productDetails,
    isLoading,
    isError,
  } = useGetDetailedRentProductQuery(
    typeof rentProduct.rent_product === 'string'
      ? rentProduct.rent_product
      : rentProduct.rent_product?._id || '',
    {
      skip: !rentProduct.rent_product,
    }
  )

  // Debug logging for API response
  // console.log('Product details:', productDetails, 'Error:', error)

  // Show basic info even when detailed API fails
  const productName =
    productDetails?.data?.product?.name ||
    (typeof rentProduct.rent_product === 'object' &&
      rentProduct.rent_product?.product_barcode) ||
    (typeof rentProduct.rent_product === 'string'
      ? rentProduct.rent_product
      : null) ||
    "Noma'lum mahsulot"
  const productId = rentProduct._id || 'N/A'

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
        <Skeleton className="h-10 w-10 rounded" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-12" />
      </div>
    )
  }

  return (
    <Card className="overflow-hidden border">
      <CardContent className="p-0">
        {/* Basic Info - Always Visible */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Product Image or Placeholder */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <img
                  src={
                    productDetails?.data?.product?.images?.[0] ||
                    '/placeholder.png'
                  }
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {productName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {productDetails?.data?.product?.description ||
                      "Mahsulot ma'lumotlari"}
                  </p>
                  {isError && (
                    <div title="Ma'lumotlar to'liq yuklanmadi">
                      <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="secondary" className="font-medium">
                {rentProduct.rent_product_count}x
              </Badge>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={
                  isExpanded ? "Kamroq ko'rsatish" : "Batafsil ko'rish"
                }
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Info - Expandable */}
        {isExpanded && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            {productDetails?.data ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Kategoriya:</span>
                  <span className="font-medium text-gray-900">
                    {typeof productDetails.data.product.category_id ===
                      'object' &&
                    productDetails.data.product.category_id &&
                    'name' in productDetails.data.product.category_id
                      ? (productDetails.data.product.category_id as any).name
                      : String(productDetails.data.product.category_id) || '—'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Barcode className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Bar-kod:</span>
                  <span className="font-mono text-gray-900">
                    {productDetails.data.product_barcode || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Ijara narxi:</span>
                  <span className="font-medium text-green-600">
                    {productDetails.data.product_rent_price?.toLocaleString(
                      'uz-UZ'
                    ) || '0'}{' '}
                    so'm
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Jami narx:</span>
                  <span className="font-semibold text-blue-600">
                    {(
                      (productDetails.data.product_rent_price || 0) *
                      rentProduct.rent_product_count
                    ).toLocaleString('uz-UZ')}{' '}
                    so'm
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Mahsulot ma'lumotlari batafsil yuklanmadi
                </p>
                <p className="text-xs text-gray-400 mt-1">ID: {productId}</p>
              </div>
            )}

            {/* Product Attributes */}
            {productDetails?.data?.product?.attributes &&
              productDetails.data.product.attributes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Xususiyatlari:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {productDetails.data.product.attributes.map(
                      (attr, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {attr.key}: {attr.value}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
