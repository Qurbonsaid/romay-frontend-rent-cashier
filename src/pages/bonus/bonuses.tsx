import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BonusTypesTab from './BonusTypesTab'
import ClientBonusesTab from './ClientBonusesTab'

function Bonuses() {
  const [activeTab, setActiveTab] = useState('types')

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Bonuslar</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="types">Bonus turlari</TabsTrigger>
          <TabsTrigger value="clients">Foydalanuvchilar</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="mt-6">
          <BonusTypesTab />
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <ClientBonusesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Bonuses
