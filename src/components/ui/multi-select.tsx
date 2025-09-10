import * as React from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Input } from './input'

interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      handleUnselect(value)
    } else {
      onChange([...selected, value])
    }
  }

  const selectedLabels = selected.map(
    (value) => options.find((option) => option.value === value)?.label || value
  )

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between text-left font-normal h-auto min-h-[40px] py-2',
            !selected.length && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : selected.length === 1 ? (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                {selectedLabels[0]}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-blue-900"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    handleUnselect(selected[0])
                  }}
                />
              </span>
            ) : (
              selectedLabels.map((label, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-blue-900"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      handleUnselect(selected[index])
                    }}
                  />
                </span>
              ))
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="p-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-64 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No items found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      selected.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  <span>{option.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
