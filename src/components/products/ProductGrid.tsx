import { Card, CardContent } from '@/components/ui/card'
import type {
  ProductWarehouseItem,
  RentProductWarehouseItem,
} from '@/store/product/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ProductGridProps {
  products: (ProductWarehouseItem | RentProductWarehouseItem)[]
  onProductClick: (
    product: ProductWarehouseItem | RentProductWarehouseItem
  ) => void
  isRentProducts?: boolean
}

// Helper functions
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

const getCategoryName = (
  categoryId: string | { _id: string; name: string }
): string => {
  if (typeof categoryId === 'object' && categoryId?.name) {
    return categoryId.name
  }
  return String(categoryId) || '—'
}

const formatUsd = (price: string): string => {
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''))
  return `$${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export function ProductGrid({
  products,
  onProductClick,
  isRentProducts = false,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-lg">Hech qanday mahsulot topilmadi</p>
        <p className="text-gray-400 text-sm">Filterlarni o'zgartirib ko'ring</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, idx) => (
        <Tooltip key={`${product._id}-${idx}`}>
          <TooltipTrigger asChild>
            <Card
              className="overflow-hidden border border-[#E4E4E7] rounded-xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onProductClick(product)}
            >
              <CardContent className="p-3">
                <div className="w-full h-36 flex items-center justify-center">
                  <img
                    src={product.product.images[0] || '/placeholder.png'}
                    alt={getProductName(product)}
                    className="max-h-full object-contain hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="mt-2 text-sm font-medium text-[#18181B]">
                  {getProductName(product).length > 25
                    ? `${getProductName(product).substring(0, 25)}...`
                    : getProductName(product)}
                </div>
                <div className="text-xs text-[#71717A] truncate">
                  {getCategoryName(product.product.category_id)}
                </div>
                <div className="mt-2 text-xl font-bold text-[#09090B]">
                  {formatUsd(getProductPrice(product) + '')}
                  {isRentProducts ? ' / kun' : ''}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-[#71717A]">
                    Miqdor: {getProductCount(product)}
                  </div>
                  <div
                    className={`px-2 py-1 text-xs rounded-md ${
                      getProductCount(product) > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {getProductCount(product) > 0 ? 'Mavjud' : 'Tugagan'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{getProductName(product)}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
