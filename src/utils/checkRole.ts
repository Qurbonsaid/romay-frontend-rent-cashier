export const CheckRole = (
  role: 'ceo' | 'manager' | 'cashier' | 'storekeeper' | string,
  allowed: string[]
) => {
  return allowed.includes(role)
}
