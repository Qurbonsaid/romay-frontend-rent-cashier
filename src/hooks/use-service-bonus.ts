import { useState, useEffect, useCallback } from 'react'
import type { Client } from '@/types/clients.d'
import { formatNumberInput } from '@/utils/numberFormat'

interface SelectedProduct {
  product_count: number
  product_change_price: number
}

interface UseServiceBonusProps {
  selectedClient: Client | null
  selectedProducts: SelectedProduct[]
  onDiscountChange?: (discount: number) => void
}

interface UseServiceBonusReturn {
  maxDiscount: number
  discountDisplay: string
  setDiscountDisplay: (value: string) => void
  resetBonusDiscount: () => void
  handleDiscountChange: (inputValue: string) => void
  handleDiscountBlur: (currentValue: number) => void
  validateDiscount: (discount: number) => { isValid: boolean; message?: string }
}

/**
 * Custom hook for managing service bonus/discount logic
 *
 * Features:
 * - Automatically calculates max discount based on client bonus
 * - Validates bonus eligibility (type, date range, target amount)
 * - Handles discount input formatting
 * - Provides validation methods
 */
export function useServiceBonus({
  selectedClient,
  selectedProducts,
  onDiscountChange,
}: UseServiceBonusProps): UseServiceBonusReturn {
  const [maxDiscount, setMaxDiscount] = useState(0)
  const [discountDisplay, setDiscountDisplay] = useState('')

  // Helper function to reset bonus discount
  const resetBonusDiscount = useCallback(() => {
    if (maxDiscount !== 0) {
      setMaxDiscount(0)
      setDiscountDisplay('')
      onDiscountChange?.(0)
    }
  }, [maxDiscount, onDiscountChange])

  // Effect to handle discount when products change or client changes
  useEffect(() => {
    // 1. Mijozda bonus yo'qligi yoki bonus ob'ekti noto'g'ri bo'lsa
    if (!selectedClient || !selectedClient.bonus) {
      resetBonusDiscount()
      return
    }

    const bonus = selectedClient.bonus

    // 2. Bonus_type mavjudligini tekshirish (API dan kelmagan bo'lishi mumkin)
    if (!bonus.bonus_type || typeof bonus.bonus_type !== 'object') {
      resetBonusDiscount()
      return
    }

    // 3. Bonus turi SERVICE emasligini tekshirish
    if (bonus.type !== 'SERVICE') {
      resetBonusDiscount()
      return
    }

    // 4. Bonus sanasi oralig'ini tekshirish
    const now = new Date()
    const startDate = new Date(bonus.start_date)
    const endDate = new Date(bonus.end_date)

    if (now < startDate || now > endDate) {
      resetBonusDiscount()
      return
    }

    // 5. Mahsulotlar jami summani hisoblash
    const totalProductsSum = selectedProducts.reduce((total, item) => {
      const price = item.product_change_price || 0
      return total + item.product_count * price
    }, 0)

    const targetAmount = bonus.bonus_type.target_amount || 0
    const maxDiscountAmount = bonus.client_discount_amount || 0

    // 6. Jami summa maqsad summaga yetganligi tekshiruvi
    if (totalProductsSum >= targetAmount && maxDiscountAmount > 0) {
      // Maksimal chegirmani o'rnatish (faqat o'zgargan bo'lsa)
      if (maxDiscount !== maxDiscountAmount) {
        setMaxDiscount(maxDiscountAmount)

        // Chegirmani avtomatik o'rnatish FAQAT birinchi marta
        // Foydalanuvchi input'ga tegmagan bo'lsa
        if (discountDisplay === '') {
          setDiscountDisplay(
            formatNumberInput(maxDiscountAmount.toString()).display
          )
          onDiscountChange?.(maxDiscountAmount)
        }
      }
    } else {
      // Maqsad summaga yetmagan yoki bonus yo'q
      resetBonusDiscount()
    }
  }, [
    selectedClient,
    selectedProducts,
    maxDiscount,
    onDiscountChange,
    resetBonusDiscount,
    discountDisplay,
  ])

  // Handle discount input change
  const handleDiscountChange = useCallback(
    (inputValue: string) => {
      if (inputValue === '') {
        // Foydalanuvchi inputni tozalagan - bo'sh qoldirish
        setDiscountDisplay('')
        onDiscountChange?.(0)
      } else {
        const formatted = formatNumberInput(inputValue)
        const numericValue = formatted.numeric

        // Foydalanuvchi istalgan qiymat kirita oladi
        // Validatsiya faqat vizual va submit paytida
        setDiscountDisplay(formatted.display)
        onDiscountChange?.(numericValue)
      }
    },
    [onDiscountChange]
  )

  // Handle discount input blur
  const handleDiscountBlur = useCallback((currentValue: number) => {
    // Update display to match the numeric value
    if (currentValue > 0) {
      setDiscountDisplay(formatNumberInput(currentValue.toString()).display)
    } else {
      setDiscountDisplay('')
    }
  }, [])

  // Validate discount amount
  const validateDiscount = useCallback(
    (discount: number): { isValid: boolean; message?: string } => {
      if (maxDiscount === 0) {
        return { isValid: true }
      }

      if (discount > maxDiscount) {
        return {
          isValid: false,
          message: `Chegirma maksimal miqdordan oshmasligi kerak! Maksimal: ${maxDiscount.toLocaleString('uz-UZ')} so'm`,
        }
      }

      return { isValid: true }
    },
    [maxDiscount]
  )

  return {
    maxDiscount,
    discountDisplay,
    setDiscountDisplay,
    resetBonusDiscount,
    handleDiscountChange,
    handleDiscountBlur,
    validateDiscount,
  }
}
