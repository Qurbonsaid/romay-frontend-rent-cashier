import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TablePagination } from '@/components/ui/table-pagination'

interface RentProduct {
  _id: string
  product: {
    name: string
    description?: string
    category_id: string | { _id: string; name: string }
    images?: string[]
    barcode?: string
  }
  product_rent_price: number
  product_active_count: number
}

interface ProductSelectionTableProps {
  products: RentProduct[]
  loading: boolean
  selectedProducts: Record<string, number>
  productSearch: string
  setProductSearch: (search: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (items: number) => void
  updateProductCount: (productId: string, change: number) => void
}

export default function ProductSelectionTable({
  products,
  loading,
  selectedProducts,
  productSearch,
  setProductSearch,
  selectedCategory,
  setSelectedCategory,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  updateProductCount,
}: ProductSelectionTableProps) {
  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product.name
      .toLowerCase()
      .includes(productSearch.toLowerCase())
    const categoryValue =
      typeof product.product.category_id === 'object'
        ? (product.product.category_id as { _id: string; name: string })?._id
        : product.product.category_id
    const matchesCategory =
      selectedCategory === 'all' || categoryValue === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Get unique categories for filter
  const categories = products.reduce(
    (acc, product) => {
      const category = product.product.category_id
      if (category) {
        const categoryId =
          typeof category === 'object'
            ? (category as { _id: string; name: string })._id
            : category
        const categoryName =
          typeof category === 'object'
            ? (category as { _id: string; name: string }).name
            : category
        if (!acc.some((cat) => cat.value === categoryId)) {
          acc.push({ value: categoryId, label: categoryName })
        }
      }
      return acc
    },
    [] as { value: string; label: string }[]
  )

  const resetPage = () => setCurrentPage(1)

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ijara mahsulotlarini tanlang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Mahsulot qidirish..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value)
                  resetPage()
                }}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value)
                  resetPage()
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategoriya tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mahsulot
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategoriya
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mavjud
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ijara Narxi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miqdor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Yuklanmoqda...
                      </td>
                    </tr>
                  ) : paginatedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Mahsulotlar topilmadi
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product._id}
                        className={`hover:bg-gray-50 ${
                          selectedProducts[product._id] ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              {product.product.images &&
                              product.product.images.length > 0 ? (
                                <img
                                  src={product.product.images[0]}
                                  alt={product.product.name}
                                  className="w-10 h-10 object-cover rounded-lg border"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    target.nextElementSibling!.classList.remove(
                                      'hidden'
                                    )
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-10 h-10 bg-gray-200 rounded-lg border flex items-center justify-center text-gray-400 text-xs ${
                                  product.product.images &&
                                  product.product.images.length > 0
                                    ? 'hidden'
                                    : ''
                                }`}
                              >
                                📦
                              </div>
                            </div>
                            {/* Product Details */}
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">
                                {product.product.name}
                              </div>
                              {product.product.barcode && (
                                <div className="text-sm text-gray-500">
                                  {product.product.barcode}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {typeof product.product.category_id === 'object' &&
                          (
                            product.product.category_id as {
                              _id: string
                              name: string
                            }
                          )?.name
                            ? (
                                product.product.category_id as {
                                  _id: string
                                  name: string
                                }
                              ).name
                            : typeof product.product.category_id === 'string'
                              ? product.product.category_id
                              : 'Kategoriyasiz'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.product_active_count > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.product_active_count}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {formatPrice(product.product_rent_price)} so'm
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateProductCount(product._id, -1)
                              }
                              disabled={
                                !selectedProducts[product._id] ||
                                selectedProducts[product._id] <= 0
                              }
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium min-w-[2rem] text-center">
                              {selectedProducts[product._id] || 0}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateProductCount(product._id, 1)}
                              disabled={
                                (selectedProducts[product._id] || 0) >=
                                  product.product_active_count ||
                                product.product_active_count === 0
                              }
                            >
                              +
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {filteredProducts.length > itemsPerPage && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage)
                setCurrentPage(1) // Reset to first page when changing items per page
              }}
              className="mt-4"
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
