import { useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, ChevronDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Simple badge component for statuses
function StatusBadge({ status }: { status: 'Mavjud' | 'Ijarada' }) {
  const styles =
    status === 'Mavjud'
      ? 'bg-green-100 text-green-800'
      : 'bg-amber-100 text-amber-800'
  return (
    <span className={`px-2 py-1 text-xs rounded-sm ${styles}`}>{status}</span>
  )
}

export type RentRow = {
  id: string
  name: string
  price: string
  muddat: string
  status: 'Mavjud' | 'Ijarada'
  oluvchi: string
  olingan_muddat: string
  ijara_summasi: string
  date: string
}

const rows: RentRow[] = [
  {
    id: '1',
    name: 'Perfarator',
    price: '20,000',
    muddat: 'Kunlik',
    status: 'Mavjud',
    oluvchi: '-',
    olingan_muddat: '-',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '2',
    name: 'Perfarator',
    price: '123,456',
    muddat: 'Kunlik',
    status: 'Mavjud',
    oluvchi: '-',
    olingan_muddat: '-',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '3',
    name: 'Perfarator',
    price: '123,456',
    muddat: 'Kunlik',
    status: 'Ijarada',
    oluvchi: 'Bekmurod\n+998901234567',
    olingan_muddat: '10 kun',
    ijara_summasi: '200,000',
    date: '23.06.2025',
  },
  {
    id: '4',
    name: 'Perfarator',
    price: '123,456',
    muddat: 'Kunlik',
    status: 'Mavjud',
    oluvchi: '-',
    olingan_muddat: '-',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '5',
    name: 'Perfarator',
    price: '123,456',
    muddat: 'Kunlik',
    status: 'Ijarada',
    oluvchi: 'Bekmurod\n+998901234567',
    olingan_muddat: '10 kun',
    ijara_summasi: '200,000',
    date: '23.06.2025',
  },
  {
    id: '6',
    name: 'Perfarator',
    price: '123,456',
    muddat: 'Kunlik',
    status: 'Mavjud',
    oluvchi: '-',
    olingan_muddat: '-',
    ijara_summasi: '-',
    date: '-',
  },
  {
    id: '7',
    name: 'Perfarator',
    price: '123,456',
    muddat: 'Kunlik',
    status: 'Ijarada',
    oluvchi: 'Bekmurod\n+998901234567',
    olingan_muddat: '10 kun',
    ijara_summasi: '200,000',
    date: '23.06.2025',
  },
  {
    id: '8',
    name: 'Perfarator',
    price: '123,456',
    muddat: 'Kunlik',
    status: 'Mavjud',
    oluvchi: '-',
    olingan_muddat: '-',
    ijara_summasi: '-',
    date: '-',
  },
]

export default function ManagerRentsPage() {
  const [tab, setTab] = useState<'all' | 'rented' | 'available'>('all')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<RentRow | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const filtered = useMemo(() => {
    if (tab === 'rented') return rows.filter((r) => r.status === 'Ijarada')
    if (tab === 'available') return rows.filter((r) => r.status === 'Mavjud')
    return rows
  }, [tab])

  // Form schema and setup
  const schema = z
    .object({
      renterName: z.string().min(2, 'Ism eng kamida 2 harf'),
      phone: z
        .string()
        .regex(/^\+?998\d{9}$/, { message: 'Telefon formati: +998XXXXXXXXX' }),
      productId: z.string().min(1, 'Uskuna tanlang'),
      startDate: z.string().min(1, 'Berilgan sana majburiy'),
      endDate: z.string().min(1, 'Qaytariladigan sana majburiy'),
    })
    .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
      message: 'Qaytariladigan sana berilgan sanadan keyin boʼlishi kerak',
      path: ['endDate'],
    })

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      renterName: '',
      phone: '+998',
      productId: '',
      startDate: '',
      endDate: '',
    },
  })

  const availableProducts = useMemo(
    () => rows.filter((r) => r.status === 'Mavjud'),
    []
  )

  const onSubmit = (values: FormValues) => {
    // TODO: send to API
    console.log('Create rent', values)
    setAddOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="px-0 text-xl font-semibold text-[#09090B] hover:bg-transparent"
          >
            Termiz shox ko'cha <ChevronDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ijara qo'shish
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#09090B]">
          Ijaralar ({filtered.length})
        </h2>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as 'all' | 'rented' | 'available')}
        >
          <TabsList>
            <TabsTrigger value="all">Barcha mahsulotlar</TabsTrigger>
            <TabsTrigger value="rented">Ijaradagi mahsulotlar</TabsTrigger>
            <TabsTrigger value="available">Mavjud mahsulotlar</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Details dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Ijara mahsuloti</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="w-full h-40 bg-gray-100 rounded-lg" />
                <div className="divide-y divide-[#E4E4E7] rounded-lg overflow-hidden border">
                  <div className="grid grid-cols-2 gap-6 bg-[#F6F6F7] p-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Nomi</div>
                      <div className="mt-1 font-medium">{selected.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Narxi</div>
                      <div className="mt-1 font-medium">{selected.price}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 bg-[#F6F6F7] p-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Muddat
                      </div>
                      <div className="mt-1 font-medium">{selected.muddat}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Statusi
                      </div>
                      <div className="mt-1">
                        <StatusBadge status={selected.status} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 bg-white p-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Oluvchi
                      </div>
                      <div className="mt-1 whitespace-pre-line font-medium">
                        {selected.oluvchi}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Olingan muddat
                      </div>
                      <div className="mt-1 font-medium">
                        {selected.olingan_muddat}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 bg-white p-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Summa</div>
                      <div className="mt-1 font-medium">
                        {selected.ijara_summasi}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Olingan vaqt
                      </div>
                      <div className="mt-1 font-medium">{selected.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Rent dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mahsulot qo'shish</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="renterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ijarachi</FormLabel>
                      <FormControl>
                        <Input placeholder="Ijarachi ismi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon raqami</FormLabel>
                      <FormControl>
                        <Input placeholder="+998 _ _ ___ __ __" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uskuna</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Ijaraga berilgan uskuna" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableProducts.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — {p.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Berilgan sana</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qaytariladigan sana</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Ijaraga berish
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nomi</th>
                <th className="px-6 py-3 text-center font-medium">Narxi</th>
                <th className="px-6 py-3 text-left font-medium">Muddat</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
                <th className="px-6 py-3 text-center font-medium">Oluvchi</th>
                <th className="px-6 py-3 text-center font-medium">
                  Olingan muddat
                </th>
                <th className="px-6 py-3 text-center font-medium">
                  Ijara summasi
                </th>
                <th className="px-6 py-3 text-center font-medium">
                  Olingan sana
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-[#F9F9F9] cursor-pointer"
                  onClick={() => {
                    setSelected(r)
                    setOpen(true)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center" />
                      <div>
                        <div className="text-sm font-medium text-[#18181B]">
                          {r.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">{r.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="text-sm text-[#18181B]">{r.muddat}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-pre-line text-center">
                    <div className="text-sm text-[#18181B]">{r.oluvchi}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {r.olingan_muddat}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">
                      {r.ijara_summasi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-[#18181B]">{r.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
