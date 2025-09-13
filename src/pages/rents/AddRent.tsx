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
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Plus, Trash2, Search, CalendarIcon, Minus } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  useAddRentMutation,
  useGetAllRentProductsQuery,
} from '@/store/rent/rent.api'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import type { Client } from '@/types/clients'
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
    received_date: new Date(),
    delivery_date: undefined as Date | undefined,
  })
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  )
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [productQuantities, setProductQuantities] = useState<{
    [productId: string]: number
  }>({})

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

  const handleInputChange = (
    field: string,
    value: string | Date | undefined
  ) => {
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

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setProductQuantities((prev) => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
    } else {
      setProductQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }))
    }
  }

  const handleAddSelectedProducts = () => {
    const newProducts: SelectedProduct[] = []

    Object.entries(productQuantities).forEach(([productId, quantity]) => {
      const product = rentProductsData?.data.find((p) => p._id === productId)
      if (product && quantity > 0) {
        const existingProductIndex = selectedProducts.findIndex(
          (p) => p.rent_product === productId
        )

        if (existingProductIndex >= 0) {
          // Update existing product
          const updatedProducts = [...selectedProducts]
          updatedProducts[existingProductIndex].rent_product_count = quantity
          setSelectedProducts(updatedProducts)
        } else {
          // Add new product
          newProducts.push({
            rent_product: product._id,
            rent_product_count: quantity,
            name: product.product.name,
            rent_price: product.product_rent_price,
            available_quantity: product.product_active_count,
          })
        }
      }
    })

    if (newProducts.length > 0) {
      setSelectedProducts((prev) => [...prev, ...newProducts])
    }

    setIsProductModalOpen(false)
    setProductQuantities({})
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
        received_date: formData.received_date.toISOString(),
        delivery_date: formData.delivery_date.toISOString(),
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
        <Button variant="outline" onClick={() => navigate('/')}>
          Orqaga
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Asosiy Ma'lumotlar</h2>

            <div className="space-y-4">
              {CheckRole(userRole, ['ceo']) && (
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-sm font-medium">
                    Filial *
                  </Label>
                  <Select
                    value={formData.branch}
                    onValueChange={(value) =>
                      handleInputChange('branch', value)
                    }
                  >
                    <SelectTrigger className="w-full">
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

              <div className="space-y-2">
                <Label htmlFor="client" className="text-sm font-medium">
                  Mijoz *
                </Label>
                <Select
                  value={formData.client}
                  onValueChange={handleClientChange}
                >
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2">
                <Label htmlFor="client_name" className="text-sm font-medium">
                  Mijoz Ismi *
                </Label>
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

              <div className="space-y-2">
                <Label htmlFor="received_date" className="text-sm font-medium">
                  Qabul Sanasi *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full h-10 justify-start text-left font-normal',
                        !formData.received_date && 'text-muted-foreground'
                      )}
                    >
                      {formData.received_date ? (
                        format(formData.received_date, 'dd.MM.yyyy')
                      ) : (
                        <span>Sanani tanlang</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.received_date}
                      onSelect={(date) => {
                        handleInputChange('received_date', date || new Date())
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_date" className="text-sm font-medium">
                  Qaytarish Sanasi *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full h-10 justify-start text-left font-normal',
                        !formData.delivery_date && 'text-muted-foreground'
                      )}
                    >
                      {formData.delivery_date ? (
                        format(formData.delivery_date, 'dd.MM.yyyy')
                      ) : (
                        <span>Sanani tanlang</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.delivery_date}
                      onSelect={(date) => {
                        handleInputChange('delivery_date', date)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                            <th className="px-4 py-2 text-center">Miqdor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {rentProductsData?.data.map((product) => {
                            const quantity = productQuantities[product._id] || 0
                            return (
                              <tr
                                key={product._id}
                                className="hover:bg-gray-50"
                              >
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
                                  <div className="flex items-center justify-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={
                                        quantity <= 0 ||
                                        product.product_active_count === 0
                                      }
                                      onClick={() =>
                                        handleQuantityChange(
                                          product._id,
                                          quantity - 1
                                        )
                                      }
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">
                                      {quantity}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={
                                        quantity >=
                                          product.product_active_count ||
                                        product.product_active_count === 0
                                      }
                                      onClick={() =>
                                        handleQuantityChange(
                                          product._id,
                                          quantity + 1
                                        )
                                      }
                                      className="h-8 w-8 p-0"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleAddSelectedProducts}
                        disabled={Object.keys(productQuantities).length === 0}
                      >
                        Tanlangan Mahsulotlarni Qo'shish
                      </Button>
                    </div>
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
