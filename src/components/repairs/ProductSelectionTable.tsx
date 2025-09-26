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

interface Product {
  _id: string
  product: {
    name: string
    description?: string
    barcode?: string
    category_id?: {
      name: string
    }
    price?: number
    currency?: string
    images?: string[]
  }
  product_count: number
}

interface SelectedProduct {
  product: Product
  product_count: number
}

interface ProductSelectionTableProps {
  products: Product[]
  loading: boolean
  selectedProducts: Record<string, SelectedProduct>
  productSearch: string
  setProductSearch: (search: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  setItemsPerPage: (items: number) => void
  updateProductCount: (productId: string, change: number) => void
  totalPages?: number
  totalItems?: number
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
  totalPages,
  totalItems,
}: ProductSelectionTableProps) {
  // Apply only category filter client-side (search is handled by backend)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      product.product.category_id?.name === selectedCategory
    return matchesCategory
  })

  // Use filtered products for display (no client-side pagination needed as backend handles it)
  const paginatedProducts = filteredProducts

  // Get unique categories for filter
  const categories = products.reduce(
    (acc, product) => {
      const categoryName = product.product.category_id?.name
      if (categoryName && !acc.some((cat) => cat.value === categoryName)) {
        acc.push({ value: categoryName, label: categoryName })
      }
      return acc
    },
    [] as { value: string; label: string }[]
  )

  const resetPage = () => setCurrentPage(1)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mahsulotlarni tanlang</CardTitle>
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
                      Barcode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategoriya
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mavjud
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Narxi
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
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Yuklanmoqda...
                      </td>
                    </tr>
                  ) : paginatedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
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
                              <img
                                src={
                                  product.product.images?.[0] ||
                                  '/placeholder.png'
                                }
                                alt={product.product.name}
                                className="w-10 h-10 object-cover rounded-lg border"
                              />
                            </div>
                            {/* Product Details */}
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">
                                {product.product.name}
                              </div>
                              {product.product.description && (
                                <div className="text-sm text-gray-500">
                                  {product.product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {product.product.barcode || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {product.product.category_id?.name || 'Kategoriyasiz'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.product_count > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.product_count}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {product.product.price
                            ? `${product.product.price.toLocaleString()} ${product.product.currency || "so'm"}`
                            : "Narx ko'rsatilmagan"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateProductCount(product._id, -1)
                              }
                              disabled={!selectedProducts[product._id]}
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium min-w-[2rem] text-center">
                              {selectedProducts[product._id]?.product_count ||
                                0}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateProductCount(product._id, 1)}
                              disabled={
                                selectedProducts[product._id]?.product_count >=
                                  product.product_count ||
                                product.product_count === 0
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
          {totalPages && totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems || 0}
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
