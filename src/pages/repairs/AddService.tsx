import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

// UI Components
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Custom Components
import ProductSelectionTable from '@/components/repairs/ProductSelectionTable'
import SelectedProductsList from '@/components/repairs/SelectedProductsList'
import ServiceFormFields from '@/components/repairs/ServiceFormFields'
import ServiceSummary from '@/components/repairs/ServiceSummary'

// API and Types
import { useAddServiceMutation } from '@/store/service/service.api'
import { useGetAllMechanicsQuery } from '@/store/mechanic/mechanic.api'
import { useGetAllSaleProductsQuery } from '@/store/product/product.api'
import { useGetClientsQuery } from '@/store/clients/clients.api'
import type { AddServiceRequest } from '@/store/service/types'
import type { ProductWarehouseItem } from '@/store/product/types.d'
import type { Client } from '@/types/clients.d'

// Hooks and Utils
import { useGetRole } from '@/hooks/use-get-role'
import { useGetBranch } from '@/hooks/use-get-branch'
import { useDebounce } from '@/hooks/use-debounce'
import { useServiceBonus } from '@/hooks/use-service-bonus'
import { CheckRole } from '@/utils/checkRole'

// Service form schema with conditional validation for mechanic and salary
const serviceSchema = z
  .object({
    client_id: z.string().min(1, 'Mijoz tanlash majburiy'),
    mechanic: z.string().optional(),
    mechanic_salary: z.number().min(0, "Usta maoshi manfiy bo'lmasligi kerak"),
    received_date: z.date({ message: 'Qabul qilish sanasi majburiy' }),
    delivery_date: z.date({ message: 'Topshirish sanasi majburiy' }),
    comment: z.string().optional(),
    discount: z.number().min(0, "Chegirma manfiy bo'lmasligi kerak").optional(),
  })
  .refine(
    (data) => {
      // Agar usta tanlangan bo'lsa, maosh majburiy
      if (
        data.mechanic &&
        data.mechanic.trim() !== '' &&
        data.mechanic !== 'none'
      ) {
        return data.mechanic_salary > 0
      }
      return true
    },
    {
      message: "Usta tanlangan bo'lsa, maosh belgilash majburiy",
      path: ['mechanic_salary'],
    }
  )
  .refine(
    (data) => {
      // Agar maosh belgilangan bo'lsa, usta majburiy
      if (data.mechanic_salary > 0) {
        return (
          data.mechanic &&
          data.mechanic.trim() !== '' &&
          data.mechanic !== 'none'
        )
      }
      return true
    },
    {
      message: "Maosh belgilangan bo'lsa, usta tanlash majburiy",
      path: ['mechanic'],
    }
  )

type ServiceFormData = z.infer<typeof serviceSchema>

interface SelectedProduct {
  product: ProductWarehouseItem
  product_count: number
  product_change_price: number
}

export default function AddService() {
  const navigate = useNavigate()
  const userRole = useGetRole()
  const branch = useGetBranch()

  // State for selected products
  const [selectedProducts, setSelectedProducts] = useState<{
    [productId: string]: SelectedProduct
  }>({})

  // State for search and filtering
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [salaryDisplay, setSalaryDisplay] = useState('')

  // State for tracking price changes
  const [hasPriceChanges, setHasPriceChanges] = useState(false)

  // Debounce search term for API optimization
  const debouncedProductSearch = useDebounce(productSearch, 300)

  // API hooks
  const [addService, { isLoading: isSubmitting }] = useAddServiceMutation()

  const { data: mechanicsData, isLoading: mechanicsLoading } =
    useGetAllMechanicsQuery({
      page: 1,
      limit: 100,
      work_type: 'SERVICE',
    })

  const { data: productsData, isLoading: productsLoading } =
    useGetAllSaleProductsQuery({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedProductSearch || undefined,
      branch: branch?._id,
    })

  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery(
    {
      search: clientSearch,
      branch_id: branch?._id,
      page: 1,
      limit: 1000,
    },
    { skip: !branch }
  )

  // Form setup
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      client_id: '',
      mechanic: 'none',
      mechanic_salary: 0,
      received_date: new Date(),
      delivery_date: (() => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow
      })(),
      comment: '',
      discount: 0,
    },
  })

  // Computed values
  const selectedProductsList = Object.values(selectedProducts)
  const availableProducts = productsData?.data || []

  // Use bonus hook for discount management
  const {
    maxDiscount,
    discountDisplay,
    handleDiscountChange,
    handleDiscountBlur,
    validateDiscount,
  } = useServiceBonus({
    selectedClient,
    selectedProducts: selectedProductsList,
    onDiscountChange: (discount) => {
      form.setValue('discount', discount, { shouldValidate: false })
    },
  })

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedProductSearch])

  // Check permissions
  if (!CheckRole(userRole, ['manager', 'rent_cashier', 'ceo'])) {
    navigate('/dashboard')
    return null
  }

  if (!branch) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">Branch ma'lumotlari topilmadi</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Dashboard ga qaytish
          </Button>
        </div>
      </div>
    )
  }

  // Product management functions
  const updateProductCount = (productId: string, change: number) => {
    const currentCount = selectedProducts[productId]?.product_count || 0
    const newCount = currentCount + change

    if (newCount < 0) {
      return
    }

    if (newCount === 0) {
      setSelectedProducts((prev) => {
        const updated = { ...prev }
        delete updated[productId]
        return updated
      })
      return
    }

    const product = availableProducts.find((p) => p._id === productId)
    if (!product) return

    const existingProduct = selectedProducts[productId]

    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        product,
        product_count: newCount,
        product_change_price:
          existingProduct?.product_change_price || product.product?.price || 0,
      },
    }))
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev }
      delete updated[productId]
      return updated
    })
  }

  const updateProductPrice = (productId: string, newPrice: number) => {
    const currentProduct = selectedProducts[productId]
    if (currentProduct) {
      const originalPrice = currentProduct.product.product?.price || 0
      const isPriceChanged = newPrice !== originalPrice

      // Check if any product has changed price
      const anyPriceChanged = Object.values(selectedProducts).some((p) => {
        if (p.product._id === productId) {
          return isPriceChanged
        }
        return p.product_change_price !== (p.product.product?.price || 0)
      })

      setHasPriceChanges(anyPriceChanged)
    }

    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        product_change_price: newPrice,
      },
    }))
  }

  // Calculate total products sum
  const getTotalProductsSum = () => {
    return selectedProductsList.reduce((total, item) => {
      const price = item.product_change_price || 0
      return total + item.product_count * price
    }, 0)
  }

  // Form submission
  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (!selectedClient) {
        toast.error('Mijoz tanlanmagan')
        return
      }

      if (selectedProductsList.length === 0) {
        toast.error('Hech qanday mahsulot tanlanmagan')
        return
      }

      // Check if any product price has been changed and comment is required
      if (hasPriceChanges && (!data.comment || data.comment.trim() === '')) {
        toast.error("Mahsulot narxi o'zgartirilgan! Izoh qoldirish majburiy.")
        return
      }

      // Check if discount exceeds maxDiscount
      const discountValidation = validateDiscount(data.discount || 0)
      if (!discountValidation.isValid) {
        toast.error(discountValidation.message!)
        return
      }

      // Prepare products array for API
      const products = selectedProductsList.map((item) => ({
        product: item.product.product._id,
        product_count: item.product_count,
        product_change_price: item.product_change_price,
      }))

      // Prepare service request according to API spec
      const serviceRequest: Partial<AddServiceRequest> = {
        branch: branch._id,
        client_name: selectedClient.username,
        client_phone: selectedClient.phone,
        products,
        received_date: data.received_date.toISOString(),
        delivery_date: data.delivery_date.toISOString(),
        ...(data.comment &&
          data.comment.trim() !== '' && { comment: data.comment }),
      }

      // Faqat usta va maosh bo'lsa qo'shish (none emas)
      if (
        data.mechanic &&
        data.mechanic.trim() !== '' &&
        data.mechanic !== 'none'
      ) {
        serviceRequest.mechanic = data.mechanic
        serviceRequest.mechanic_salary = data.mechanic_salary
      }

      // Add discount if it's greater than 0
      if (data.discount && data.discount > 0) {
        serviceRequest.discount = data.discount
      }

      await addService(serviceRequest as AddServiceRequest).unwrap()

      toast.success("Xizmat muvaffaqiyatli qo'shildi!")
      navigate('/repairs')
    } catch (error: any) {
      // Handle specific error messages
      let errorMessage = "Xizmat qo'shishda xatolik yuz berdi"

      if (error?.data?.error?.msg) {
        errorMessage = error.data.error.msg
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.data?.error) {
        errorMessage =
          typeof error.data.error === 'string'
            ? error.data.error
            : JSON.stringify(error.data.error)
      } else if (error?.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/repairs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Orqaga
        </Button>
        <h1 className="text-3xl font-bold">Yangi xizmat qo'shish</h1>
      </div>

      {/* Product Selection Section */}
      <ProductSelectionTable
        products={availableProducts}
        loading={productsLoading}
        selectedProducts={selectedProducts}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        updateProductCount={updateProductCount}
        totalPages={productsData?.page_count}
        totalItems={productsData?.after_filtering_count}
      />

      {/* Two-column layout for form and summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Service Form */}
        <Card>
          <CardHeader>
            <CardTitle>Xizmat yaratish</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id="service-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <ServiceFormFields
                  form={form}
                  clientsData={clientsData}
                  clientsLoading={clientsLoading}
                  clientSearch={clientSearch}
                  setClientSearch={setClientSearch}
                  setSelectedClient={setSelectedClient}
                  mechanicsData={mechanicsData}
                  mechanicsLoading={mechanicsLoading}
                  salaryDisplay={salaryDisplay}
                  setSalaryDisplay={setSalaryDisplay}
                  hasPriceChanges={hasPriceChanges}
                  maxDiscount={maxDiscount}
                  discountDisplay={discountDisplay}
                  onDiscountChange={handleDiscountChange}
                  onDiscountBlur={handleDiscountBlur}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right Column: Service Summary */}
        <ServiceSummary
          formWatch={form.watch}
          selectedClient={selectedClient}
          mechanicsData={mechanicsData}
          totalProductsSum={getTotalProductsSum()}
          selectedProductsCount={selectedProductsList.length}
          maxDiscount={maxDiscount}
          currentDiscount={form.watch('discount') || 0}
          isSubmitting={isSubmitting}
          canSubmit={!!selectedClient && selectedProductsList.length > 0}
        />
      </div>

      {/* Selected Products Section */}
      <SelectedProductsList
        selectedProducts={selectedProductsList}
        onRemoveProduct={removeProduct}
        onUpdateQuantity={updateProductCount}
        onUpdatePrice={updateProductPrice}
        availableProducts={availableProducts}
      />
    </div>
  )
}
