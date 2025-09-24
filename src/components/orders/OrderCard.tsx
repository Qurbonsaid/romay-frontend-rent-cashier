import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ProductDetailsModal from '@/components/ProductDetailsModal'
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import type { Rent, RentProduct } from '@/store/rent/types'
import { useState } from 'react'

interface OrderCardProps {
  rent: Rent
  isExpanded: boolean
  onToggleExpansion: () => void
}

// Helper component for status badge
function RentStatusBadge({ status }: { status: Rent['status'] }) {
  const config = {
    IN_PROGRESS: {
      icon: Clock,
      label: 'Davom etmoqda',
      className: 'bg-blue-100 text-blue-800',
    },
    COMPLETED: {
      icon: CheckCircle,
      label: 'Yakunlangan',
      className: 'bg-green-100 text-green-800',
    },
    CANCELLED: {
      icon: XCircle,
      label: 'Bekor qilingan',
      className: 'bg-red-100 text-red-800',
    },
  }

  const { icon: Icon, label, className } = config[status]

  return (
    <Badge className={`inline-flex items-center gap-1 ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

// Helper function to calculate balance and get status
function getBalanceInfo(totalPrice: number, payments: { amount: number }[]) {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const balance = totalPrice - totalPaid

  if (balance === 0)
    return {
      text: "To'liq to'langan",
      color: 'text-green-600',
      bg: 'bg-green-100',
    }
  if (balance < 0)
    return {
      text: "Ortiqcha to'lov",
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    }
  return { text: 'Qarz', color: 'text-red-600', bg: 'bg-red-100' }
}

export function OrderCard({
  rent,
  isExpanded,
  onToggleExpansion,
}: OrderCardProps) {
  const [selectedProduct, setSelectedProduct] = useState<RentProduct | null>(
    null
  )
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  const totalPaid = rent.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  )
  const balance = rent.total_rent_price - totalPaid
  const balanceInfo = getBalanceInfo(rent.total_rent_price, rent.payments)

  const openProductModal = (product: RentProduct) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setIsProductModalOpen(false)
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Order Header - ID removed, layout updated */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <RentStatusBadge status={rent.status} />
            <Badge
              className={`${balanceInfo.bg} ${balanceInfo.color} border-0`}
            >
              {balanceInfo.text}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date(rent.created_at).toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        {/* Product Summary - Totals moved to right */}
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Mahsulotlar
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-blue-600 font-medium">
                MAHSULOTLAR
              </div>
              <div className="text-lg font-bold text-blue-900">
                {rent.rent_products?.length || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-green-600 font-medium">
                JAMI MIQDOR
              </div>
              <div className="text-lg font-bold text-green-900">
                {rent.rent_products?.reduce(
                  (sum, item) => sum + item.rent_product_count,
                  0
                ) || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-purple-600 font-medium">
                JAMI SUMMA
              </div>
              <div className="text-lg font-bold text-purple-900">
                {(rent.total_rent_price || 0).toLocaleString()} so'm
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Ijara davri</div>
            <div className="font-medium text-xs text-gray-900">
              {new Date(rent.received_date).toLocaleDateString('en-GB')}
            </div>
            <div className="text-xs text-gray-500">—</div>
            <div className="font-medium text-xs text-gray-900">
              {new Date(rent.delivery_date).toLocaleDateString('en-GB')}
            </div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Umumiy</div>
            <div className="font-semibold text-blue-600 text-sm">
              {rent.total_rent_price.toLocaleString('uz-UZ')}
            </div>
            <div className="text-xs text-blue-600">so'm</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">To'langan</div>
            <div className="font-semibold text-green-600 text-sm">
              {totalPaid.toLocaleString('uz-UZ')}
            </div>
            <div className="text-xs text-green-600">so'm</div>
          </div>

          <div
            className={`text-center p-3 rounded-lg ${balance === 0 ? 'bg-gray-50' : balance > 0 ? 'bg-red-50' : 'bg-blue-50'}`}
          >
            <div className="text-xs text-gray-500 mb-1">Qoldiq</div>
            <div
              className={`font-semibold text-sm ${balance === 0 ? 'text-gray-600' : balance > 0 ? 'text-red-600' : 'text-blue-600'}`}
            >
              {Math.abs(balance).toLocaleString('uz-UZ')}
            </div>
            <div
              className={`text-xs ${balance === 0 ? 'text-gray-600' : balance > 0 ? 'text-red-600' : 'text-blue-600'}`}
            >
              so'm
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <Button
          variant="ghost"
          onClick={onToggleExpansion}
          className="w-full mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Kamroq ko'rsatish
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Batafsil ko'rish
            </>
          )}
        </Button>
      </CardHeader>

      {/* Expandable Details */}
      {isExpanded && (
        <CardContent className="pt-0">
          <Separator className="mb-6" />

          <div className="space-y-6">
            {/* Payment History */}
            {rent.payments.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  To'lov tarixi ({rent.payments.length})
                </h4>
                <div className="space-y-2">
                  {rent.payments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-900">
                          {payment.amount.toLocaleString('uz-UZ')} so'm
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {payment.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section - Table Format like RentDetails */}
            {rent.rent_products && rent.rent_products.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Mahsulotlar ({rent.rent_products.length})
                </h4>

                {/* Products Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mahsulot
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Barcode
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kategoriya
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Miqdor
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Narx
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jami
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rent.rent_products.map(
                          (rentProduct: RentProduct, index: number) => (
                            <TableRow
                              key={index}
                              className="hover:bg-gray-50 cursor-pointer h-12"
                              onClick={() => openProductModal(rentProduct)}
                            >
                              {/* Product Column */}
                              <TableCell className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                  {/* Product Image */}
                                  <div className="flex-shrink-0">
                                    {typeof rentProduct.rent_product ===
                                      'object' &&
                                    rentProduct.rent_product?.product?.images &&
                                    rentProduct.rent_product.product.images
                                      .length > 0 ? (
                                      <img
                                        src={
                                          rentProduct.rent_product.product
                                            .images[0]
                                        }
                                        alt={
                                          rentProduct.rent_product.product.name
                                        }
                                        className="w-8 h-8 object-cover rounded border"
                                        onError={(e) => {
                                          const target =
                                            e.target as HTMLImageElement
                                          target.src =
                                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMEMyNS41MjI5IDMwIDMwIDI1LjUyMjkgMzAgMjBDMzAgMTQuNDc3MSAyNS41MjI5IDEwIDIwIDEwQzE0LjQ3NzEgMTAgMTAgMTQuNDc3MSAxMCAyMEMxMCAyNS41MjI5IDE0LjQ3NzEgMzAgMjAgMzBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xNCAyMEwxNy41IDIzLjVMMjYgMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=='
                                        }}
                                      />
                                    ) : (
                                      <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">
                                          📦
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {/* Product Name */}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-gray-900 text-sm truncate">
                                      {typeof rentProduct.rent_product ===
                                        'object' &&
                                      rentProduct.rent_product?.product?.name
                                        ? rentProduct.rent_product.product.name
                                        : "Noma'lum mahsulot"}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Barcode Column */}
                              <TableCell className="px-4 py-2 text-gray-600 text-sm font-mono">
                                {typeof rentProduct.rent_product === 'object' &&
                                rentProduct.rent_product?.product?.barcode
                                  ? rentProduct.rent_product.product.barcode
                                  : '—'}
                              </TableCell>

                              {/* Category Column */}
                              <TableCell className="px-4 py-2 text-gray-600 text-sm">
                                {typeof rentProduct.rent_product === 'object' &&
                                rentProduct.rent_product?.product?.category_id
                                  ? typeof rentProduct.rent_product.product
                                      .category_id === 'object'
                                    ? rentProduct.rent_product.product
                                        .category_id.name
                                    : rentProduct.rent_product.product
                                        .category_id
                                  : "Noma'lum"}
                              </TableCell>

                              {/* Quantity Column */}
                              <TableCell className="px-4 py-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                  {rentProduct.rent_product_count}
                                </span>
                              </TableCell>

                              {/* Price Column */}
                              <TableCell className="px-4 py-2 font-medium text-gray-900 text-sm">
                                {typeof rentProduct.rent_product === 'object' &&
                                rentProduct.rent_product?.product_rent_price
                                  ? formatPrice(
                                      rentProduct.rent_product
                                        .product_rent_price
                                    )
                                  : "Narx yo'q"}
                              </TableCell>

                              {/* Total Column */}
                              <TableCell className="px-4 py-2 font-semibold text-purple-600 text-sm">
                                {typeof rentProduct.rent_product === 'object' &&
                                rentProduct.rent_product?.product_rent_price
                                  ? formatPrice(
                                      rentProduct.rent_product
                                        .product_rent_price *
                                        rentProduct.rent_product_count
                                    )
                                  : 'Hisoblanmagan'}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        selectedProduct={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
      />
    </Card>
  )
}
