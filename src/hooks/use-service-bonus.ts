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
 * - Validates bonus eligibility (type, date range)
 * - Validates discount is not greater than total products sum
 * - Validates discount is not greater than max bonus discount
 * - Handles discount input formatting
 * - Provides validation methods
 *
 * New Logic (Updated):
 * - No target amount check required
 * - Bonus discount is available if client has active bonus
 * - Discount can be 0 to min(maxDiscount, totalProductsSum)
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

    // 5. Bonus miqdorini olish
    const maxDiscountAmount = bonus.client_discount_amount || 0

    // 6. Bonus miqdori 0 dan katta bo'lsa, maksimal chegirmani o'rnatish
    if (maxDiscountAmount > 0) {
      // Maksimal chegirmani o'rnatish (faqat o'zgargan bo'lsa)
      if (maxDiscount !== maxDiscountAmount) {
        setMaxDiscount(maxDiscountAmount)
      }
    } else {
      // Bonus miqdori 0 yoki noto'g'ri
      resetBonusDiscount()
    }
  }, [
    selectedClient,
    selectedProducts,
    maxDiscount,
    onDiscountChange,
    resetBonusDiscount,
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
      // Agar chegirma 0 bo'lsa, hech qanday xato yo'q
      if (discount === 0) {
        return { isValid: true }
      }

      // Mahsulotlar jami summani hisoblash
      const totalProductsSum = selectedProducts.reduce((total, item) => {
        const price = item.product_change_price || 0
        return total + item.product_count * price
      }, 0)

      // 1. Chegirma jami summadan katta bo'lmasligi kerak
      if (discount > totalProductsSum) {
        return {
          isValid: false,
          message: `Chegirma jami summadan katta bo'lmasligi kerak! Jami: ${totalProductsSum.toLocaleString('uz-UZ')} so'm`,
        }
      }

      // 2. Agar bonus bor bo'lsa, maksimal chegirmadan oshmasligi kerak
      if (maxDiscount > 0 && discount > maxDiscount) {
        return {
          isValid: false,
          message: `Chegirma maksimal miqdordan oshmasligi kerak! Maksimal: ${maxDiscount.toLocaleString('uz-UZ')} so'm`,
        }
      }

      return { isValid: true }
    },
    [maxDiscount, selectedProducts]
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
