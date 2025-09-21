import React from 'react'
import { Input } from '@/components/ui/input'
import { formatNumberInput } from '@/utils/numberFormat'
import { cn } from '@/lib/utils'

interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  value?: number | string
  onChange?: (value: number) => void
  allowZero?: boolean
  allowDecimals?: boolean
  decimalPlaces?: number
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value = '',
      onChange,
      allowZero = true,
      allowDecimals = false,
      decimalPlaces = 2,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      if (allowDecimals) {
        // Allow digits, decimal point, and handle decimal places

        // Remove invalid characters but keep decimal point
        inputValue = inputValue.replace(/[^\d.]/g, '')

        // Ensure only one decimal point
        const parts = inputValue.split('.')
        if (parts.length > 2) {
          inputValue = parts[0] + '.' + parts.slice(1).join('')
        }

        // Limit decimal places
        if (parts[1] && parts[1].length > decimalPlaces) {
          inputValue = parts[0] + '.' + parts[1].substring(0, decimalPlaces)
        }

        const numericValue = parseFloat(inputValue) || 0

        // If allowZero is false and the value is 0, don't call onChange
        if (!allowZero && numericValue === 0 && inputValue !== '') {
          return
        }

        onChange?.(numericValue)
      } else {
        const formatted = formatNumberInput(inputValue)

        // If allowZero is false and the value is 0, don't call onChange
        if (!allowZero && formatted.numeric === 0 && inputValue !== '') {
          return
        }

        onChange?.(formatted.numeric)
      }
    }

    const displayValue = () => {
      if (value === undefined || value === '') return ''

      if (allowDecimals) {
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        return isNaN(numValue) ? '' : numValue.toString()
      } else {
        return formatNumberInput(value.toString()).display
      }
    }

    return (
      <Input
        type="text"
        className={cn(className)}
        value={displayValue()}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'

export { NumberInput }
