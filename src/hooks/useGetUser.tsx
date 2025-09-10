import { useUserQuery } from '@/store/auth/auth.api'

export const useGetUser = () => {
  const { data: { data: user } = {} } = useUserQuery()
  return user
}
