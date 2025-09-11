import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Search } from 'lucide-react'
import {
  useAddRentMutation,
  useGetAllRentProductsQuery,
} from '@/store/rent/rent.api'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import type { Client } from '@/types/clients'
import type { RentProductDetail } from '@/store/rent/types'
import { useGetRole } from '@/hooks/use-get-role'
import { CheckRole } from '@/utils/checkRole'
import { useGetBranch } from '@/hooks/use-get-branch'

interface SelectedProduct {
  rent_product: string
  rent_product_count: number
  name: string
  rent_price: number
  available_quantity: number
}

export default function AddRent() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const branch = useGetBranch()
  const [formData, setFormData] = useState({
    branch: '',
    client: '',
    client_name: '',
    received_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
  })
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  )
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [selectedProductForAdd, setSelectedProductForAdd] =
    useState<RentProductDetail | null>(null)
  const [productQuantity, setProductQuantity] = useState(1)

  // Check permissions
  const canAddRent = CheckRole(userRole, ['rent_cashier'])

  const { data: branchesData } = useGetAllBranchesQuery(
    { page: 1, limit: 100 },
    { skip: userRole !== 'ceo' }
  )

  const { data: clientsData } = useGetClientsQuery(
    { page: 1, limit: 100 },
    { skip: !canAddRent }
  )

  const { data: rentProductsData } = useGetAllRentProductsQuery({
    search: productSearch || undefined,
    page: 1,
    limit: 50,
  })

  const [addRent, { isLoading }] = useAddRentMutation()

  if (!canAddRent) {
    navigate('/dashboard')
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClientChange = (clientId: string) => {
    const client = clientsData?.data.find((c: Client) => c._id === clientId)
    setFormData((prev) => ({
      ...prev,
      client: clientId,
      client_name: client?.username || '',
    }))
  }

  const handleAddProduct = () => {
    if (!selectedProductForAdd || productQuantity <= 0) return

    if (productQuantity > selectedProductForAdd.product_active_count) {
      toast.error("Mavjud miqdordan ko'p mahsulot tanlab bo'lmaydi")
      return
    }

    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.rent_product === selectedProductForAdd._id
    )

    if (existingProductIndex >= 0) {
      // Update existing product
      const updatedProducts = [...selectedProducts]
      updatedProducts[existingProductIndex].rent_product_count = productQuantity
      setSelectedProducts(updatedProducts)
    } else {
      // Add new product
      setSelectedProducts((prev) => [
        ...prev,
        {
          rent_product: selectedProductForAdd._id,
          rent_product_count: productQuantity,
          name: selectedProductForAdd.product.name,
          rent_price: selectedProductForAdd.product_rent_price,
          available_quantity: selectedProductForAdd.product_active_count,
        },
      ])
    }

    setIsProductModalOpen(false)
    setSelectedProductForAdd(null)
    setProductQuantity(1)
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.rent_product !== productId)
    )
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      return total + product.rent_price * product.rent_product_count
    }, 0)
  }

  const handleSubmit = async () => {
    if (
      !formData.client ||
      !formData.client_name ||
      !formData.received_date ||
      !formData.delivery_date ||
      selectedProducts.length === 0
    ) {
      toast.error(
        "Barcha maydonlarni to'ldiring va kamida bitta mahsulot tanlang"
      )
      return
    }

    try {
      await addRent({
        branch: branch?._id || '',
        client: formData.client,
        client_name: formData.client_name,
        rent_products: selectedProducts.map((p) => ({
          rent_product: p.rent_product,
          rent_product_count: p.rent_product_count,
        })),
        received_date: formData.received_date,
        delivery_date: formData.delivery_date,
      }).unwrap()

      toast.success("Ijara muvaffaqiyatli qo'shildi")
      navigate('/rents')
    } catch (error) {
      console.error('Failed to add rent:', error)
      toast.error("Ijara qo'shishda xatolik yuz berdi")
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Yangi Ijara Qo'shish
        </h1>
        <Button variant="outline" onClick={() => navigate('/rents')}>
          Orqaga
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Asosiy Ma'lumotlar</h2>

            <div className="space-y-4">
              {userRole === 'ceo' && (
                <div>
                  <Label htmlFor="branch">Filial *</Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) =>
                      handleInputChange('branch', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filialni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchesData?.data.map((branch) => (
                        <SelectItem key={branch._id} value={branch._id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="client">Mijoz *</Label>
                <Select
                  value={formData.client}
                  onValueChange={handleClientChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mijozni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsData?.data.map((client: Client) => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.username} - {client.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="client_name">Mijoz Ismi *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) =>
                    handleInputChange('client_name', e.target.value)
                  }
                  placeholder="Mijoz ismini kiriting"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="received_date">Qabul Sanasi *</Label>
                <Input
                  id="received_date"
                  type="date"
                  value={formData.received_date}
                  onChange={(e) =>
                    handleInputChange('received_date', e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="delivery_date">Qaytarish Sanasi *</Label>
                <Input
                  id="delivery_date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) =>
                    handleInputChange('delivery_date', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tanlangan Mahsulotlar</h2>
              <Dialog
                open={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Mahsulot Qo'shish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Mahsulot Tanlash</DialogTitle>
                    <DialogDescription>
                      Ijaraga beriladigan mahsulotni tanlang
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Mahsulot qidirish..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="max-h-96 overflow-y-auto border rounded">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left">Mahsulot</th>
                            <th className="px-4 py-2 text-center">Narx</th>
                            <th className="px-4 py-2 text-center">Mavjud</th>
                            <th className="px-4 py-2 text-center">Tanlash</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {rentProductsData?.data.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                              <td className="px-4 py-2">
                                <div className="flex items-center">
                                  {product.product.images &&
                                    product.product.images.length > 0 && (
                                      <img
                                        src={product.product.images[0]}
                                        alt={product.product.name}
                                        className="h-8 w-8 rounded object-cover mr-2"
                                      />
                                    )}
                                  <div>
                                    <div className="font-medium">
                                      {product.product.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {product.product.barcode}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-center">
                                {formatPrice(product.product_rent_price)} so'm
                              </td>
                              <td className="px-4 py-2 text-center">
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
                              <td className="px-4 py-2 text-center">
                                <Button
                                  size="sm"
                                  disabled={product.product_active_count === 0}
                                  onClick={() =>
                                    setSelectedProductForAdd(product)
                                  }
                                >
                                  Tanlash
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {selectedProductForAdd && (
                      <div className="border-t pt-4">
                        <h3 className="font-medium mb-2">
                          {selectedProductForAdd.product.name} - Miqdorni
                          kiriting:
                        </h3>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="1"
                            max={selectedProductForAdd.product_active_count}
                            value={productQuantity}
                            onChange={(e) =>
                              setProductQuantity(parseInt(e.target.value) || 1)
                            }
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">
                            / {selectedProductForAdd.product_active_count}{' '}
                            mavjud
                          </span>
                          <Button
                            onClick={handleAddProduct}
                            className="ml-auto"
                          >
                            Qo'shish
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Hali mahsulot tanlanmagan
              </div>
            ) : (
              <div className="space-y-2">
                {selectedProducts.map((product) => (
                  <div
                    key={product.rent_product}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(product.rent_price)} so'm ×{' '}
                        {product.rent_product_count} ={' '}
                        {formatPrice(
                          product.rent_price * product.rent_product_count
                        )}{' '}
                        so'm
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveProduct(product.rent_product)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Xulosa</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mahsulotlar soni:</span>
                <span className="font-medium">{selectedProducts.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Jami miqdor:</span>
                <span className="font-medium">
                  {selectedProducts.reduce(
                    (sum, p) => sum + p.rent_product_count,
                    0
                  )}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Jami summa:</span>
                  <span>{formatPrice(calculateTotal())} so'm</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handleSubmit}
              disabled={isLoading || selectedProducts.length === 0}
            >
              {isLoading ? 'Saqlanmoqda...' : 'Ijara Yaratish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
