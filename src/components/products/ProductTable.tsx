import type {
  ProductWarehouseItem,
  RentProductWarehouseItem,
} from '@/store/product/types'

interface ProductTableProps {
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

export function ProductTable({
  products,
  onProductClick,
  isRentProducts = false,
}: ProductTableProps) {
  return (
    <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
          <tr>
            <th className="px-6 py-3 text-left font-medium">Mahsulot</th>
            <th className="px-6 py-3 text-center font-medium">Miqdor</th>
            <th className="px-6 py-3 text-center font-medium">Kategoriya</th>
            <th className="px-6 py-3 text-center font-medium">Bar-kod</th>
            <th className="px-6 py-3 text-center font-medium">
              {isRentProducts ? 'Kunlik narx' : 'Narxi'}
            </th>
            <th className="px-6 py-3 text-center font-medium">Holat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E4E4E7]">
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                Hech qanday mahsulot topilmadi
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-[#F9F9F9] cursor-pointer transition-colors"
                onClick={() => onProductClick(product)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {product.product.images[0] ? (
                        <img
                          src={product.product.images[0]}
                          alt={getProductName(product)}
                          className="h-8 w-8 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">📱</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#18181B] max-w-xs truncate">
                        {getProductName(product)}
                      </div>
                      {product.product.description && (
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {product.product.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-[#18181B]">
                    {getProductCount(product)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B] max-w-24 truncate">
                    {getCategoryName(product.product.category_id)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-[#E4E4E7] text-[#18181B] font-mono">
                    {product.product_barcode}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B] font-medium">
                    {formatUsd(getProductPrice(product) + '')}
                    {isRentProducts ? ' / kun' : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getProductCount(product) > 0 ? (
                    <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700 font-medium">
                      Mavjud
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700 font-medium">
                      Tugagan
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
