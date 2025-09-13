import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'
import { useGetAllSaleProductsQuery } from '@/store/product/product.api'
import type { ProductWarehouseItem } from '@/store/product/types.d'
import { useDebounce } from '@/hooks/use-debounce'

interface ProductSearchProps {
  onProductSelect: (product: ProductWarehouseItem) => void
  selectedProductIds: string[]
}

export default function ProductSearch({
  onProductSelect,
  selectedProductIds,
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data: productsData, isLoading } = useGetAllSaleProductsQuery(
    {
      page: 1,
      limit: 10,
      search: debouncedSearchTerm,
    },
    {
      skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2,
    }
  )

  const products = productsData?.data || []
  const availableProducts = products.filter(
    (product) => !selectedProductIds.includes(product._id)
  )

  const handleProductSelect = (product: ProductWarehouseItem) => {
    onProductSelect(product)
    setSearchTerm('')
    setIsOpen(false)
  }

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`
  }

  useEffect(() => {
    setIsOpen(debouncedSearchTerm.length >= 2 && availableProducts.length > 0)
  }, [debouncedSearchTerm, availableProducts.length])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Mahsulot nomi yoki kodi kiriting..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10"
          onFocus={() => {
            if (
              debouncedSearchTerm.length >= 2 &&
              availableProducts.length > 0
            ) {
              setIsOpen(true)
            }
          }}
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Qidirilmoqda...</div>
          ) : availableProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Mahsulot topilmadi
            </div>
          ) : (
            <div className="py-2">
              {availableProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleProductSelect(product)}
                >
                  {/* Product Image */}
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {product.product.images &&
                    product.product.images.length > 0 ? (
                      <img
                        src={product.product.images[0]}
                        alt={product.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">N/A</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {product.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(
                        product.product.price,
                        product.product.currency
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      Mavjud: {product.product_count} dona
                    </p>
                  </div>

                  {/* Add Button */}
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
