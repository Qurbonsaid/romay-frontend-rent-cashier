import type { Role } from '@/constants/roles'
import { useUserQuery } from '@/store/auth/auth.api'

export const useGetRole = (): Role => {
  const { data: userData } = useUserQuery()

  return userData?.data?.role as Role
}
