import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageTitle } from '@/components/PageTitle'
import RentUsersTable from './RentUsersTable'
import RentProductsTable from './RentProductsTable'
import RentDetailsModal from './RentDetailsModal'
import RentProductDetailsModal from './RentProductDetailsModal'

export default function Rents() {
  const [selectedRentId, setSelectedRentId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] =
    useState(false)

  const handleRentClick = (rentId: string) => {
    setSelectedRentId(rentId)
    setIsDetailsModalOpen(true)
  }

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId)
    setIsProductDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedRentId(null)
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
          <RentUsersTable onRentClick={handleRentClick} />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <RentProductsTable onProductClick={handleProductClick} />
        </TabsContent>
      </Tabs>

      <RentDetailsModal
        rentId={selectedRentId}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />

      <RentProductDetailsModal
        productId={selectedProductId}
        isOpen={isProductDetailsModalOpen}
        onClose={handleCloseProductDetailsModal}
      />
    </div>
  )
}
