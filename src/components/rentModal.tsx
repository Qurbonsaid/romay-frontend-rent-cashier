import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Package, User } from 'lucide-react'

type Rent = {
  id: string
  name: string
  oluvchi: string
  muddat: string
  status: string
  price: string
  olingan_muddat: string
  ijara_summasi: string
  date: string
}

type RentDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  product: Rent | null
}

export function RentDetailsModal({
  isOpen,
  onClose,
  product,
}: RentDetailsModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ijara mahsuloti ma'lumotlari</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Image and Basic Info */}
          <div className="flex gap-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                <img
                  src="/vite.svg"
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Product Name and Status */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <Badge
                variant={product.status === 'Mavjud' ? 'default' : 'secondary'}
                className="text-sm"
              >
                <Package className="h-3 w-3 mr-1" />
                {product.status}
              </Badge>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">NARXI</div>
              <div className="text-lg font-bold text-green-600">
                {product.price}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-500 font-medium">MUDDAT</div>
              <div className="text-lg font-bold text-blue-600">
                {product.muddat}
              </div>
            </div>
          </div>

          {/* Rental Details (if rented) */}
          {product.status === 'Ijarada' && (
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-yellow-900 flex items-center gap-2">
                <User className="h-4 w-4" />
                Ijara ma'lumotlari
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-yellow-700 font-medium">
                    OLUVCHI
                  </div>
                  <div className="text-yellow-900 font-semibold">
                    {product.oluvchi}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-yellow-700 font-medium">
                    IJARA SUMMASI
                  </div>
                  <div className="text-yellow-900 font-semibold">
                    {product.ijara_summasi}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-yellow-700 font-medium">
                    OLINGAN MUDDAT
                  </div>
                  <div className="text-yellow-900 font-semibold">
                    {product.olingan_muddat}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-yellow-700 font-medium">
                    OLINGAN SANA
                  </div>
                  <div className="text-yellow-900 font-semibold">
                    {product.date}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
