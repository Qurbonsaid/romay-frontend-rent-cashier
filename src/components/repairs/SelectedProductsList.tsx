import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/utils/numberFormat'
import { useState } from 'react'
import { Search } from 'lucide-react'

interface Product {
  _id: string
  product: {
    name: string
    images?: string[]
    price?: number
    currency?: string
    category_id?: {
      name: string
    }
  }
  product_count: number
}

interface SelectedProduct {
  product: Product
  product_count: number
}

interface SelectedProductsListProps {
  selectedProducts: SelectedProduct[]
  onRemoveProduct?: (productId: string) => void
  onUpdateQuantity?: (productId: string, change: number) => void
  availableProducts?: Product[] // Add this to get stock information
}

export default function SelectedProductsList({
  selectedProducts,
  onRemoveProduct,
  onUpdateQuantity,
  availableProducts = [],
}: SelectedProductsListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  if (selectedProducts.length === 0) {
    return null
  }

  // Filter products based on search term
  const filteredProducts = selectedProducts.filter((item) =>
    item.product.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Helper function to get available stock for a product
  const getAvailableStock = (productId: string) => {
    const product = availableProducts.find((p) => p._id === productId)
    return product?.product_count || 0
  }

  // Calculate totals
  const totalQuantity = selectedProducts.reduce(
    (sum, item) => sum + item.product_count,
    0
  )
  const totalPrice = selectedProducts.reduce((sum, item) => {
    const price = item.product.product.price || 0
    return sum + price * item.product_count
  }, 0)

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Tanlangan mahsulotlar ({selectedProducts.length})
          </CardTitle>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Jami miqdor: {totalQuantity}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(totalPrice)}
            </div>
          </div>
        </div>
        {selectedProducts.length > 3 && (
          <div className="relative mt-4">
            <Input
              type="text"
              placeholder="Mahsulotlarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          className={`space-y-3 ${selectedProducts.length > 5 ? 'max-h-96 overflow-y-auto' : ''}`}
        >
          {filteredProducts.length === 0 && searchTerm ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-900 font-medium text-lg mb-2">
                "{searchTerm}" bo'yicha mahsulot topilmadi
              </p>
              <p className="text-gray-500">
                Tanlangan mahsulotlar orasida bunday nom yo'q
              </p>
            </div>
          ) : (
            filteredProducts.map((item, index) => {
              const itemPrice = item.product.product.price || 0
              const itemTotal = itemPrice * item.product_count

              return (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Left Side: Image, Name, Category */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-gray-400 text-sm font-medium min-w-[20px]">
                      {index + 1}.
                    </span>

                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          item.product.product.images?.[0] || '/placeholder.png'
                        }
                        alt={item.product.product.name}
                        className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.product.product.category_id?.name && (
                          <p className="text-sm text-gray-500">
                            {item.product.product.category_id.name}
                          </p>
                        )}
                        <span className="text-sm text-gray-500">
                          • Omborda: {getAvailableStock(item.product._id)} dona
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Counter, Price, Actions */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Quantity Counter */}
                    {onUpdateQuantity && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onUpdateQuantity(item.product._id, -1)}
                          disabled={item.product_count <= 1}
                        >
                          -
                        </Button>
                        <span className="font-medium text-center min-w-[2rem]">
                          {item.product_count}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onUpdateQuantity(item.product._id, 1)}
                          disabled={
                            item.product_count >=
                            getAvailableStock(item.product._id)
                          }
                        >
                          +
                        </Button>
                      </div>
                    )}

                    {/* Price Info */}
                    <div className="text-right min-w-[80px]">
                      <div className="text-sm text-gray-600">
                        {formatCurrency(itemPrice)}
                      </div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(itemTotal)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    {onRemoveProduct && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveProduct(item.product._id)}
                        className="h-8 px-3 border-red-500 text-red-500 hover:bg-red-50"
                      >
                        O'chirish
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
