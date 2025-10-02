/**
 * Utility functions for number formatting
 */

/**
 * Formats a number with thousand separators
 * @param value - The number to format
 * @returns Formatted string with spaces as thousand separators
 */
export const formatNumber = (value: number | string): string => {
  if (value === '' || value === null || value === undefined) return '0'

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'

  return num.toLocaleString('uz-UZ').replace(/,/g, ' ')
}

/**
 * Formats currency with som suffix
 * @param value - The number to format
 * @returns Formatted string with thousand separators and "so'm" suffix
 */
export const formatCurrency = (value: number | string): string => {
  const formatted = formatNumber(value)
  return `${formatted} so'm`
}

/**
 * Parses a formatted number string back to number
 * @param value - The formatted string to parse
 * @returns Parsed number
 */
export const parseFormattedNumber = (value: string): number => {
  if (!value || value.trim() === '') return 0

  // Remove spaces and non-digit characters except decimal point
  const cleaned = value.replace(/\s/g, '').replace(/[^\d.]/g, '')
  const num = parseFloat(cleaned)

  return isNaN(num) ? 0 : num
}

/**
 * Formats number input with real-time formatting
 * @param value - Current input value
 * @returns Object with formatted display value and numeric value
 */
export const formatNumberInput = (
  value: string
): { display: string; numeric: number } => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '')

  // If empty, return empty display and 0 numeric
  if (digitsOnly === '') {
    return { display: '', numeric: 0 }
  }

  // Remove leading zeros and convert to number
  const numeric = parseInt(digitsOnly, 10)

  // Agar 0 bo'lsa, bo'sh string qaytarish
  if (numeric === 0) {
    return { display: '', numeric: 0 }
  }

  const display = formatNumber(numeric)

  return { display, numeric }
}

/**
 * Validates and cleans number input to prevent leading zeros
 * @param value - Input value to clean
 * @returns Cleaned value without leading zeros
 */
export const cleanNumberInput = (value: string): string => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '')

  // If empty, return empty string
  if (digitsOnly === '') return ''

  // Convert to number to remove leading zeros, then back to string
  const num = parseInt(digitsOnly, 10)
  return num.toString()
}
