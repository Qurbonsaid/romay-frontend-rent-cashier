import { Search, Plus, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TablePagination } from '@/components/ui/table-pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  useGetAllSaleProductsQuery,
  useGetAllRentProductsQuery,
} from '@/store/product/product.api'
import type {
  ProductWarehouseItem,
  RentProductWarehouseItem,
} from '@/store/product/types'
import { useGetAllCategoryQuery } from '@/store/category/category.api'
import { Button } from '@/components/ui/button'
import ProductDetailsModal from '@/components/product-details-modal'
import { CreateProductDialog } from '@/components/products/CreateProductDialog'
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { CheckRole } from '@/utils/checkRole'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

function ProductPage() {
  const branch = useGetBranch()
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('sale')

  // API calls for both sale and rent products
  const { data: saleProductsData } = useGetAllSaleProductsQuery({
    search,
    page: currentPage,
    limit,
    branch: branch?._id,
  })

  const { data: rentProductsData } = useGetAllRentProductsQuery({
    search,
    page: currentPage,
    limit,
    branch: branch?._id,
  })

  // Use the appropriate data based on active tab
  const getAllProductsData =
    activeTab === 'sale' ? saleProductsData : rentProductsData

  const { data: getAllCategoriesData } = useGetAllCategoryQuery({})

  // Client-side filtering for category
  const filteredProducts = useMemo(() => {
    if (!getAllProductsData?.data) return []

    return getAllProductsData.data.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' ||
        (typeof item.product.category_id === 'string'
          ? item.product.category_id === selectedCategory
          : item.product.category_id._id === selectedCategory)

      return matchesCategory
    })
  }, [getAllProductsData?.data, selectedCategory])

  const role = useGetRole()

  const formatUsd = (value: string) => {
    const num = Number(String(value).replace(/[^0-9]/g, '')) || 0
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  const getCategoryName = (
    categoryId: string | { _id: string; name: string }
  ): string => {
    if (typeof categoryId === 'object' && categoryId?.name) {
      return categoryId.name
    }
    return String(categoryId) || '—'
  }
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<
    ProductWarehouseItem | RentProductWarehouseItem | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProductClick = (
    product: ProductWarehouseItem | RentProductWarehouseItem
  ) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // Helper functions to get consistent data from both product types
  const getProductName = (
    product: ProductWarehouseItem | RentProductWarehouseItem
  ): string => {
    return product.product.name
  }

  const getProductCount = (
    product: ProductWarehouseItem | RentProductWarehouseItem
  ): number => {
    if ('product_count' in product) {
      return product.product_count
    }
    if ('product_total_count' in product) {
      return product.product_total_count
    }
    return 0
  }

  const getProductPrice = (
    product: ProductWarehouseItem | RentProductWarehouseItem
  ): number => {
    if ('product_rent_price' in product) {
      return product.product_rent_price
    }
    if ('price' in product.product) {
      return product.product.price
    }
    return 0
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setLimit(itemsPerPage)
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset pagination when switching tabs
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Mahsulotlar
        </h1>
        <div className="flex items-center gap-3">
          {CheckRole(role, ['manager', 'storekeeper']) && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Mahsulot qo'shish
            </Button>
          )}
          <div className="ml-2 flex rounded-md border border-[#E4E4E7] overflow-hidden">
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="rounded-none"
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for Sale and Rent Products */}
      <Tabs
        defaultValue="sale"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sale">Sotish mahsulotlari</TabsTrigger>
          <TabsTrigger value="rent">Ijara mahsulotlari</TabsTrigger>
        </TabsList>

        <TabsContent value="sale" className="space-y-6">
          {/* Sale Products Content */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9 w-[300px]"
                placeholder="mahsulotni izlash"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategoriya tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                {getAllCategoriesData?.data?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {view === 'list' ? (
            <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">
                      Mahsulot
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      Miqdor
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      Kategoriya
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      Bar-kod
                    </th>
                    <th className="px-6 py-3 text-center font-medium">Narxi</th>
                    <th className="px-6 py-3 text-center font-medium">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Hech qanday mahsulot topilmadi
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-[#F9F9F9] cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                              <img
                                src={
                                  product.product.images[0] ||
                                  '/placeholder.png'
                                }
                                alt={getProductName(product)}
                                className="h-8 w-8 object-cover rounded"
                              />
                            </div>
                            <div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-sm font-medium text-[#18181B] cursor-pointer">
                                    {getProductName(product).length > 30
                                      ? `${getProductName(product).substring(0, 30)}...`
                                      : getProductName(product)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {getProductName(product)}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-[#18181B]">
                            {getProductCount(product)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                            {getCategoryName(product.product.category_id)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-[#E4E4E7] text-[#18181B]">
                            {product.product_barcode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-[#18181B]">
                            {formatUsd(getProductPrice(product) + '')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getProductCount(product) > 0 ? (
                            <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">
                              Mavjud
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700">
                              Tugagan
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    Hech qanday mahsulot topilmadi
                  </p>
                  <p className="text-gray-400 text-sm">
                    Filterlarni o'zgartirib ko'ring
                  </p>
                </div>
              ) : (
                filteredProducts.map((product, idx) => (
                  <Card
                    key={`${product._id}-${idx}`}
                    className="overflow-hidden border border-[#E4E4E7] rounded-xl cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="px-3">
                      <div className="w-full h-48 bg-[#f0f0f0] rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src={product.product.images[0] || '/placeholder.png'}
                          alt={getProductName(product)}
                          className="w-7/12"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-[#18181B]">
                        {getProductName(product)}
                      </div>
                      <div className="text-xs text-[#71717A]">
                        {getCategoryName(product.product.category_id)}
                      </div>
                      <div className="mt-2 text-xl font-bold text-[#09090B]">
                        {formatUsd(getProductPrice(product) + '')}
                      </div>
                      <div className="mt-2 text-xs text-[#71717A]">
                        Miqdor: {getProductCount(product)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          <TablePagination
            currentPage={getAllProductsData?.current_page || 1}
            totalPages={getAllProductsData?.page_count || 1}
            totalItems={getAllProductsData?.after_filtering_count || 0}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </TabsContent>

        <TabsContent value="rent" className="space-y-6">
          {/* Rent Products Content - Same structure as sale products */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9 w-[300px]"
                placeholder="mahsulotni izlash"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategoriya tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                {getAllCategoriesData?.data?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {view === 'list' ? (
            <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">
                      Mahsulot
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      Miqdor
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      Kategoriya
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      Bar-kod
                    </th>
                    <th className="px-6 py-3 text-center font-medium">
                      Kunlik narx
                    </th>
                    <th className="px-6 py-3 text-center font-medium">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Hech qanday mahsulot topilmadi
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-[#F9F9F9] cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                              <img
                                src={
                                  product.product.images[0] ||
                                  '/placeholder.png'
                                }
                                alt={getProductName(product)}
                                className="h-8 w-8 object-cover rounded"
                              />
                            </div>
                            <div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="text-sm font-medium text-[#18181B] cursor-pointer">
                                    {getProductName(product).length > 30
                                      ? `${getProductName(product).substring(0, 30)}...`
                                      : getProductName(product)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {getProductName(product)}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-[#18181B]">
                            {getProductCount(product)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-[#F4F4F5] text-[#18181B]">
                            {getCategoryName(product.product.category_id)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2 py-1 text-xs rounded-md border border-[#E4E4E7] text-[#18181B]">
                            {product.product_barcode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-[#18181B]">
                            {formatUsd(getProductPrice(product) + '')} / kun
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getProductCount(product) > 0 ? (
                            <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700">
                              Mavjud
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-md bg-red-100 text-red-700">
                              Tugagan
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-500 text-lg">
                    Hech qanday mahsulot topilmadi
                  </p>
                  <p className="text-gray-400 text-sm">
                    Filterlarni o'zgartirib ko'ring
                  </p>
                </div>
              ) : (
                filteredProducts.map((product, idx) => (
                  <Card
                    key={`${product._id}-${idx}`}
                    className="overflow-hidden border border-[#E4E4E7] rounded-xl cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="px-3">
                      <div className="w-full h-48 bg-[#f0f0f0] rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                          src={product.product.images[0] || '/placeholder.png'}
                          alt={getProductName(product)}
                          className="w-7/12"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-[#18181B]">
                        {getProductName(product)}
                      </div>
                      <div className="text-xs text-[#71717A]">
                        {getCategoryName(product.product.category_id)}
                      </div>
                      <div className="mt-2 text-xl font-bold text-[#09090B]">
                        {formatUsd(getProductPrice(product) + '')} / kun
                      </div>
                      <div className="mt-2 text-xs text-[#71717A]">
                        Miqdor: {getProductCount(product)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          <TablePagination
            currentPage={getAllProductsData?.current_page || 1}
            totalPages={getAllProductsData?.page_count || 1}
            totalItems={getAllProductsData?.after_filtering_count || 0}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </TabsContent>
      </Tabs>

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />

      {/* Create Product Dialog */}
      <CreateProductDialog
        open={open}
        onOpenChange={setOpen}
        categories={getAllCategoriesData?.data || []}
        onSuccess={() => {
          // Optionally refetch data or show success message
          console.log('Product created successfully')
        }}
      />
    </div>
  )
}

export default ProductPage
