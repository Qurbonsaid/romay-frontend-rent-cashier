import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatNumberInput, formatCurrency } from '@/utils/numberFormat'
import { useState } from 'react'
import { Search } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SelectedRentProduct {
  rent_product: string
  rent_product_count: number
  name: string
  rent_price: number
  rent_change_price: number
  available_quantity: number
}

interface SelectedProductsListProps {
  selectedProducts: SelectedRentProduct[]
  onRemoveProduct?: (productId: string) => void
  onUpdateQuantity?: (productId: string, change: number) => void
  onUpdatePrice?: (productId: string, newPrice: number) => void
  images?: Record<string, string[]> // product_id -> images mapping
}

export default function SelectedProductsList({
  selectedProducts,
  onRemoveProduct,
  onUpdateQuantity,
  onUpdatePrice,
  images = {},
}: SelectedProductsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [priceDisplays, setPriceDisplays] = useState<{ [key: string]: string }>(
    {}
  )

  if (selectedProducts.length === 0) {
    return null
  }

  // Filter products based on search term
  const filteredProducts = selectedProducts.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate totals
  const totalQuantity = selectedProducts.reduce(
    (sum, item) => sum + item.rent_product_count,
    0
  )
  const totalPrice = selectedProducts.reduce((sum, item) => {
    return sum + item.rent_change_price * item.rent_product_count
  }, 0)

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Tanlangan ijara mahsulotlari ({selectedProducts.length})
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
              const originalPrice = item.rent_price
              const currentPrice = item.rent_change_price
              const itemTotal = currentPrice * item.rent_product_count
              const productImages = images[item.rent_product] || []

              return (
                <div
                  key={item.rent_product}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Left Side: Image, Name, Details */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-gray-400 text-sm font-medium min-w-[20px]">
                      {index + 1}.
                    </span>

                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          productImages.length > 0
                            ? productImages[0]
                            : '/placeholder.png'
                        }
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h4 className="font-medium text-gray-900 cursor-pointer">
                            {item.name.length > 30
                              ? `${item.name.substring(0, 30)}...`
                              : item.name}
                          </h4>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-gray-500">
                          Mavjud: {item.available_quantity} dona
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
                          onClick={() =>
                            onUpdateQuantity(item.rent_product, -1)
                          }
                        >
                          -
                        </Button>
                        <span className="font-medium text-center min-w-[2rem]">
                          {item.rent_product_count}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onUpdateQuantity(item.rent_product, 1)}
                          disabled={
                            item.rent_product_count >= item.available_quantity
                          }
                        >
                          +
                        </Button>
                      </div>
                    )}

                    {/* Price Input */}
                    <div className="text-right min-w-[140px]">
                      {onUpdatePrice ? (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">
                            Asl: {formatCurrency(originalPrice)}
                          </div>
                          <Input
                            type="text"
                            placeholder="0"
                            value={
                              item.rent_product in priceDisplays
                                ? priceDisplays[item.rent_product]
                                : currentPrice > 0
                                  ? formatNumberInput(currentPrice.toString())
                                      .display
                                  : ''
                            }
                            onChange={(e) => {
                              const inputValue = e.target.value

                              // Agar input bo'sh bo'lsa
                              if (inputValue === '') {
                                setPriceDisplays((prev) => ({
                                  ...prev,
                                  [item.rent_product]: '',
                                }))
                                onUpdatePrice(item.rent_product, 0)
                                return
                              }

                              // Faqat raqamlarni olish
                              const digitsOnly = inputValue.replace(/\D/g, '')

                              // Agar raqam bo'lmasa
                              if (digitsOnly === '') {
                                setPriceDisplays((prev) => ({
                                  ...prev,
                                  [item.rent_product]: '',
                                }))
                                onUpdatePrice(item.rent_product, 0)
                                return
                              }

                              // Raqamni formatlash
                              const numericValue = parseInt(digitsOnly, 10)
                              const formattedDisplay =
                                formatNumberInput(digitsOnly).display

                              setPriceDisplays((prev) => ({
                                ...prev,
                                [item.rent_product]: formattedDisplay,
                              }))
                              onUpdatePrice(item.rent_product, numericValue)
                            }}
                            onBlur={() => {
                              // Display ni haqiqiy qiymat bilan sinxronlashtirish
                              if (currentPrice > 0) {
                                setPriceDisplays((prev) => ({
                                  ...prev,
                                  [item.rent_product]: formatNumberInput(
                                    currentPrice.toString()
                                  ).display,
                                }))
                              } else {
                                setPriceDisplays((prev) => ({
                                  ...prev,
                                  [item.rent_product]: '',
                                }))
                              }
                            }}
                            className="h-8 w-28 text-sm text-right"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(itemTotal)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(currentPrice)}
                          </div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(itemTotal)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    {onRemoveProduct && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveProduct(item.rent_product)}
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
