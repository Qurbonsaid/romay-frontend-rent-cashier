import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Minus } from 'lucide-react'
import type { ProductWarehouseItem } from '@/store/product/types.d'

interface ProductCardProps {
  product: ProductWarehouseItem
  quantity: number
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export default function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editQuantity, setEditQuantity] = useState(quantity.toString())

  const handleQuantitySubmit = () => {
    const newQuantity = parseInt(editQuantity) || 0
    onQuantityChange(product._id, newQuantity)
    setIsEditing(false)
  }

  const handleIncrement = () => {
    onQuantityChange(product._id, quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(product._id, quantity - 1)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`
  }

  const totalPrice = product.product.price * quantity

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white">
      {/* Product Image */}
      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
        <img
          src={product.product.images?.[0] || '/placeholder.png'}
          alt={product.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {product.product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {formatPrice(product.product.price, product.product.currency)}
        </p>
        {/* Show total price */}
        <p className="text-sm font-medium text-blue-600 mt-1">
          Jami: {formatPrice(totalPrice, product.product.currency)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              className="w-16 h-8 text-center"
              min="0"
              onBlur={handleQuantitySubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleQuantitySubmit()
                }
                if (e.key === 'Escape') {
                  setEditQuantity(quantity.toString())
                  setIsEditing(false)
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleDecrement}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div
              className="w-12 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded border"
              onClick={() => setIsEditing(true)}
            >
              <span className="text-sm font-medium">{quantity}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Remove Button */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={() => onRemove(product._id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
