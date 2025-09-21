import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { RentProduct } from '@/store/rent/types'

interface ProductDetailsModalProps {
  selectedProduct: RentProduct | null
  isOpen: boolean
  onClose: () => void
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

export default function ProductDetailsModal({
  selectedProduct,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mahsulot ma'lumotlari</DialogTitle>
        </DialogHeader>

        {selectedProduct && (
          <div className="space-y-4">
            {/* Product Image and Basic Info */}
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {typeof selectedProduct.rent_product === 'object' &&
                selectedProduct.rent_product?.product?.images &&
                selectedProduct.rent_product.product.images.length > 0 ? (
                  <img
                    src={selectedProduct.rent_product.product.images[0]}
                    alt={selectedProduct.rent_product.product.name}
                    className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="text-gray-400 text-lg">Rasm yo'q</span>
                  </div>
                )}
              </div>

              {/* Product Name and Category */}
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {typeof selectedProduct.rent_product === 'object'
                    ? selectedProduct.rent_product?.product?.name
                    : "Noma'lum mahsulot"}
                </h3>
                {typeof selectedProduct.rent_product === 'object' &&
                  selectedProduct.rent_product?.product?.category_id && (
                    <p className="text-sm text-gray-600">
                      {typeof selectedProduct.rent_product.product
                        .category_id === 'object'
                        ? selectedProduct.rent_product.product.category_id.name
                        : selectedProduct.rent_product.product.category_id}
                    </p>
                  )}
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">MIQDOR</div>
                <div className="text-xl font-bold text-blue-600">
                  {selectedProduct.rent_product_count}
                </div>
                <div className="text-xs text-gray-400">dona</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-500 font-medium">
                  KUNLIK NARX
                </div>
                <div className="text-xl font-bold text-green-600">
                  {typeof selectedProduct.rent_product === 'object' &&
                  selectedProduct.rent_product?.product_rent_price
                    ? formatPrice(
                        selectedProduct.rent_product.product_rent_price
                      )
                    : '0'}
                </div>
                <div className="text-xs text-gray-400">so'm</div>
              </div>

              <div className="text-center col-span-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 font-medium">
                  JAMI NARX
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {typeof selectedProduct.rent_product === 'object' &&
                  selectedProduct.rent_product?.product_rent_price
                    ? formatPrice(
                        selectedProduct.rent_product.product_rent_price *
                          selectedProduct.rent_product_count
                      )
                    : '0'}
                </div>
                <div className="text-xs text-gray-400">so'm</div>
              </div>
            </div>

            {/* Additional Information */}
            {typeof selectedProduct.rent_product === 'object' &&
              selectedProduct.rent_product?.product_barcode && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    Barcode
                  </div>
                  <div className="font-mono text-blue-700">
                    {selectedProduct.rent_product.product_barcode}
                  </div>
                </div>
              )}

            {/* Available Stock */}
            {typeof selectedProduct.rent_product === 'object' &&
              selectedProduct.rent_product?.product_active_count && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-green-900">
                    Mavjud miqdor
                  </div>
                  <div className="text-green-700">
                    {selectedProduct.rent_product.product_active_count} dona
                  </div>
                </div>
              )}

            {/* Product Creation Date */}
            {typeof selectedProduct.rent_product === 'object' &&
              selectedProduct.rent_product?.product?.created_at && (
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">
                    Yaratilgan sana
                  </div>
                  <div className="text-purple-700">
                    {new Date(
                      selectedProduct.rent_product.product.created_at
                    ).toLocaleDateString('en-GB')}
                  </div>
                </div>
              )}

            {/* Product Status Badge */}
            {typeof selectedProduct.rent_product === 'object' &&
              selectedProduct.rent_product?.product?.status && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-yellow-900">
                    Mahsulot holati
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        selectedProduct.rent_product.product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {selectedProduct.rent_product.product.status === 'active'
                        ? 'Faol'
                        : 'Nofaol'}
                    </span>
                  </div>
                </div>
              )}

            {/* Product Description */}
            {typeof selectedProduct.rent_product === 'object' &&
              selectedProduct.rent_product?.product?.description && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Ta'rif
                  </div>
                  <p className="text-gray-600 text-sm">
                    {selectedProduct.rent_product.product.description}
                  </p>
                </div>
              )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Yopish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
