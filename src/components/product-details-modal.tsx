import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { ProductWarehouseItem } from '@/store/product/types'

type ProductDetailsModalProps = {
  isOpen: boolean
  onClose: () => void
  product: ProductWarehouseItem | null
}

function Tag({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'ghost'
}) {
  const base =
    'inline-flex items-center text-xs font-medium rounded-md px-2 py-1'
  const cls =
    variant === 'ghost'
      ? base + ' bg-[#F4F4F5] text-[#F97316]'
      : base + ' bg-[#BBF7D0] text-[#166534]'
  return <span className={cls}>{children}</span>
}

const formatPrice = (price?: string | number) => {
  if (price == null) return '0.00'

  const numericPrice =
    typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : price

  return numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="p-4">
          <div className="space-y-4">
            <div className="w-[350px] h-40">
              <img
                src="/vite.svg"
                alt={product.product_name}
                className="w-full h-full rounded-md object-fit"
              />
            </div>
            <div className="flex flex-col gap-1 items-start mt-10">
              {/* <Tag variant="ghost">{product?.product?.category_id}</Tag> */}
              <p className="font-medium text-[#18181B]">
                {product?.product_name}
              </p>
              <div className="flex items-center gap-4">
                <p className="font-medium text-[#059669]">
                  ${formatPrice(product.product.price)}
                </p>
                <Tag>{product.product.status}</Tag>
              </div>
              <p className="text-sm text-zinc-400 mt-4">
                {product.product.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
