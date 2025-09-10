import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Rent = {
  id: string
  name: string
  oluvchi: string
  muddat: string
  status: string
  price: string
  olingan_muddat: string
  ijara_summasi: string
  date: string
}

type RentDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  product: Rent | null
}

export function RentDetailsModal({
  isOpen,
  onClose,
  product,
}: RentDetailsModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader className="mb-5">
          <DialogTitle>Ijara mahsuloti</DialogTitle>
        </DialogHeader>
        <div>
          <div className="space-y-4">
            <div className="w-[350px] h-40 border p-2 rounded-lg">
              <img
                src="/vite.svg"
                alt={product.name}
                className="w-full h-full rounded-md object-fit"
              />
            </div>
            <div className="grid grid-cols-2 gap-y-4 items-start mt-10 bg-slate-100 p-2 rounded-md">
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Nomi</span>
                <span className="text-[#111827]">{product.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Narxi</span>
                <span className="text-[#111827]">{product.price}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#6B7280]">Muddat</span>
                <span className="text-[#111827]">{product.muddat}</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm text-[#6B7280]">Status</span>
                <span
                  className={
                    product.status === 'Mavjud'
                      ? 'px-2 py-1 text-xs rounded-sm bg-green-100 text-green-800'
                      : 'px-2 py-1 text-xs rounded-sm bg-amber-100 text-[#B45309]'
                  }
                >
                  {product.status}
                </span>
              </div>
            </div>
            {product.status === 'Ijarada' && (
              <div className="grid grid-cols-2 gap-y-4 items-start mt-10 bg-slate-100 p-2 rounded-md">
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7280]">Oluvchi</span>
                  <span className="text-[#111827]">{product.oluvchi}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7280]">Olingan muddat</span>
                  <span className="text-[#111827]">
                    {product.olingan_muddat}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7280]">Ijara summasi</span>
                  <span className="text-[#111827]">
                    {product.ijara_summasi}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7280]">Olingan sana</span>
                  <span className="text-[#111827]">{product.date}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
