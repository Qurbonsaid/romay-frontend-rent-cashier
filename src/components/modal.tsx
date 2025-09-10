import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface ModalProps {
  title: string
  description: string
  children: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Modal({
  title,
  description,
  children,
  isOpen: isOpenProp,
  onOpenChange: onOpenChangeProp,
}: ModalProps) {
  const [isOpenState, setIsOpenState] = useState(false)
  const isControlled = isOpenProp !== undefined
  const open = isControlled ? isOpenProp : isOpenState
  const setOpen = (value: boolean) => {
    if (isControlled && onOpenChangeProp) {
      onOpenChangeProp(value)
    } else if (!isControlled) {
      setIsOpenState(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
