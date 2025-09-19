import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, X } from 'lucide-react'
import ProductSearch from '@/components/ProductSearch'
import type { ProductWarehouseItem } from '@/store/product/types.d'

interface SelectedProduct {
  product: ProductWarehouseItem
  quantity: number
}

interface ServiceProductSelectorProps {
  selectedProducts: { [productId: string]: SelectedProduct }
  onProductSelect: (product: ProductWarehouseItem) => void
  onQuantityChange: (productId: string, quantity: number) => void
  onProductRemove: (productId: string) => void
}

export function ServiceProductSelector({
  selectedProducts,
  onProductSelect,
  onQuantityChange,
  onProductRemove,
}: ServiceProductSelectorProps) {
  const selectedProductsList = Object.values(selectedProducts)
  const selectedProductIds = Object.keys(selectedProducts)
  const totalProductsPrice = selectedProductsList.reduce(
    (sum, item) => sum + item.product.product.price * item.quantity,
    0
  )

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  return (
    <div className="space-y-6">
      {/* Product Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mahsulot qidirish</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSearch
            onProductSelect={onProductSelect}
            selectedProductIds={selectedProductIds}
          />
        </CardContent>
      </Card>

      {/* Selected Products */}
      {selectedProductsList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tanlangan mahsulotlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedProductsList.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.product.product.images?.[0] ? (
                        <img
                          src={item.product.product.images[0]}
                          alt={item.product.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.product.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Narx: {formatPrice(item.product.product.price)} so'm
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {item.product.product_barcode}
                      </Badge>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onQuantityChange(item.product._id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onQuantityChange(
                          item.product._id,
                          Number(e.target.value)
                        )
                      }
                      className="w-16 text-center"
                      min="1"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onQuantityChange(item.product._id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onProductRemove(item.product._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right ml-4">
                    <p className="font-medium">
                      {formatPrice(item.product.product.price * item.quantity)}{' '}
                      so'm
                    </p>
                  </div>
                </div>
              ))}

              {/* Total Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">
                    Jami mahsulotlar narxi:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(totalProductsPrice)} so'm
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedProductsList.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <p>Hozircha hech qanday mahsulot tanlanmagan</p>
              <p className="text-sm">
                Yuqoridagi qidiruv orqali mahsulot tanlang
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
