'use client'

import * as React from 'react'
import { CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function Calendar22({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              'flex items-center gap-3 justify-between font-normal',
              className
            )}
          >
            {date ? (
              date.toLocaleDateString()
            ) : (
              <span className="text-[14px] text-[#71717A]">KK/MM/YYYY</span>
            )}
            <CalendarDays size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            // Instead of arrow indicator, need calendar Icon

            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
