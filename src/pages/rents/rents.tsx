import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageTitle } from '@/components/PageTitle'
import RentUsersTable from './RentUsersTable'
import RentProductsTable from './RentProductsTable'
import RentProductDetailsModal from './RentProductDetailsModal'

export default function Rents() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] =
    useState(false)

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId)
    setIsProductDetailsModalOpen(true)
  }

  const handleCloseProductDetailsModal = () => {
    setIsProductDetailsModalOpen(false)
    setSelectedProductId(null)
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Ijaralar" />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Ijara foydalanuvchilari</TabsTrigger>
          <TabsTrigger value="products">Ijara mahsulotlari</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <RentUsersTable />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <RentProductsTable onProductClick={handleProductClick} />
        </TabsContent>
      </Tabs>

      <RentProductDetailsModal
        productId={selectedProductId}
        isOpen={isProductDetailsModalOpen}
        onClose={handleCloseProductDetailsModal}
      />
    </div>
  )
}
