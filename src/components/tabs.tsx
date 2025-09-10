import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Button } from './ui/button'
// import { Plus } from 'lucide-react'
// import { Modal } from './modal'
// import { Label } from './ui/label'
// import { Input } from './ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select'

export default function TabsComponent() {
  return (
    <Tabs defaultValue="manager" className="w-full">
      <TabsList>
        <TabsTrigger value="manager" className="px-15">
          Menejerlar
        </TabsTrigger>
        <TabsTrigger value="sellers" className="px-15">
          Sotuvchilar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manager">
        <div className="flex h-[calc(100vh-300px)] flex-col items-center justify-center gap-4">
          <img src="/addManager.svg" alt="" />
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-[20px] font-semibold text-slate-800">
              Hozircha Menejerlar yo'q
            </h2>
            <p className="text-[14px] text-slate-600 mb-3">
              Menejer ma'lumotlarini kiritish uchun qo'shish tugmasini bosing
            </p>
            {/* <Modal
              button={
                <Button>
                  <Plus size={16} /> Menejer qo'shish
                </Button>
              }
              title="Menejer qo'shish"
              description="Bu yerda Menejer qo’sha olasiz"
              children={
                <>
                  <div className="flex flex-col gap-2">
                    <Label>Filiali</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filialni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="filial1">Termiz Filiali</SelectItem>
                        <SelectItem value="filial2">Filial 2</SelectItem>
                        <SelectItem value="filial3">Filial 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Ismi</Label>
                    <Input placeholder="Surxon" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Raqami</Label>
                    <Input placeholder="+998" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Paroli</Label>
                    <Input placeholder="123456" />
                  </div>
                </>
              }
            /> */}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="sellers">
        <div className="flex h-[calc(100vh-300px)] flex-col items-center justify-center gap-4">
          <img src="/seller.svg" alt="" />
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-[20px] font-semibold text-slate-800">
              Hozircha Sotuvchilar yo'q
            </h2>
            <p className="text-[14px] text-slate-600 mb-3">
              Sotuvchi ma'lumotlarini kiritish uchun qo'shish tugmasini bosing
            </p>
            {/* <Modal
              button={
                <Button>
                  <Plus size={16} /> Sotuvchi qo'shish
                </Button>
              }
              title="Sotuvchi qo'shish"
              description="Bu yerda Sotuvchi qo’sha olasiz"
              children={
                <>
                  <div className="flex flex-col gap-2">
                    <Label>Filiali</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filialni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="filial1">Termiz Filiali</SelectItem>
                        <SelectItem value="filial2">Filial 2</SelectItem>
                        <SelectItem value="filial3">Filial 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Ismi</Label>
                    <Input placeholder="Surxon" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Raqami</Label>
                    <Input placeholder="+998" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Paroli</Label>
                    <Input placeholder="123456" />
                  </div>
                </>
              }
            /> */}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
