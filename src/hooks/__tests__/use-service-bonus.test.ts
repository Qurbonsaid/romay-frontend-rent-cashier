import { renderHook, act } from '@testing-library/react'
import { useServiceBonus } from '../use-service-bonus'
import type { Client } from '@/types/clients.d'

describe('useServiceBonus', () => {
  const mockClient: Client = {
    _id: '123',
    username: 'Test User',
    phone: '+998901234567',
    total_service_amount: 1500000, // Client has enough service amount
    bonus: {
      type: 'SERVICE',
      bonus_type: {
        bonus_name: 'Test Bonus',
        target_amount: 1000000,
      },
      client_discount_amount: 50000,
      start_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      end_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    },
  } as Client

  const mockProducts = [
    {
      product_count: 2,
      product_change_price: 600000,
    },
    {
      product_count: 1,
      product_change_price: 500000,
    },
  ]

  it('should calculate maxDiscount when conditions are met', () => {
    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: mockClient,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
      })
    )

    expect(result.current.maxDiscount).toBe(50000)
    expect(result.current.bonusStatus).toBe('active')
  })

  it('should reset discount when client has no bonus', () => {
    const clientWithoutBonus = { ...mockClient, bonus: undefined }
    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: clientWithoutBonus as Client,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
      })
    )

    expect(result.current.maxDiscount).toBe(0)
    expect(result.current.bonusStatus).toBe('none')
  })

  it('should reset discount when bonus type is not SERVICE', () => {
    const clientWithWrongType = {
      ...mockClient,
      bonus: { ...mockClient.bonus, type: 'RENT' },
    } as Client

    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: clientWithWrongType,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
      })
    )

    expect(result.current.maxDiscount).toBe(0)
    expect(result.current.bonusStatus).toBe('type_mismatch')
  })

  it('should reset discount when client amount is below target', () => {
    const clientWithLowAmount = {
      ...mockClient,
      total_service_amount: 500000, // Below target of 1000000
    } as Client

    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: clientWithLowAmount,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
      })
    )

    expect(result.current.maxDiscount).toBe(0)
    expect(result.current.bonusStatus).toBe('insufficient_amount')
    expect(result.current.clientAmount).toBe(500000)
    expect(result.current.targetAmount).toBe(1000000)
  })

  it('should set depleted status when client_discount_amount is 0', () => {
    const clientWithDepletedBonus = {
      ...mockClient,
      bonus: {
        ...mockClient.bonus,
        client_discount_amount: 0, // Bonus tugagan
      },
    } as Client

    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: clientWithDepletedBonus,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
      })
    )

    expect(result.current.maxDiscount).toBe(0)
    expect(result.current.bonusStatus).toBe('depleted')
  })

  it('should validate discount correctly', () => {
    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: mockClient,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
      })
    )

    // Valid discount
    const validResult = result.current.validateDiscount(30000)
    expect(validResult.isValid).toBe(true)

    // Invalid discount (exceeds max)
    const invalidResult = result.current.validateDiscount(60000)
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.message).toBeDefined()
  })

  it('should handle discount change correctly', () => {
    const mockOnDiscountChange = jest.fn()
    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: mockClient,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
        onDiscountChange: mockOnDiscountChange,
      })
    )

    act(() => {
      result.current.handleDiscountChange('25000')
    })

    expect(mockOnDiscountChange).toHaveBeenCalledWith(25000)
  })

  it('should reset discount display to empty when input is empty', () => {
    const mockOnDiscountChange = jest.fn()
    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: mockClient,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
        onDiscountChange: mockOnDiscountChange,
      })
    )

    act(() => {
      result.current.handleDiscountChange('')
    })

    expect(mockOnDiscountChange).toHaveBeenCalledWith(0)
    expect(result.current.discountDisplay).toBe('')
  })

  it('should reset discount when bonus date range is invalid', () => {
    const expiredClient = {
      ...mockClient,
      bonus: {
        ...mockClient.bonus,
        start_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        end_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
    } as Client

    const { result } = renderHook(() =>
      useServiceBonus({
        selectedClient: expiredClient,
        selectedProducts: mockProducts,
        bonusType: 'SERVICE',
      })
    )

    expect(result.current.maxDiscount).toBe(0)
    expect(result.current.bonusStatus).toBe('expired')
  })
})
