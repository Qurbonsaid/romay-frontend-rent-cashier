import { useUserQuery } from '@/store/auth/auth.api'

export const useGetBranch = ():
  | {
      _id: string
      name: string
      address: string
    }
  | undefined => {
  const { data: userData } = useUserQuery()

  return userData?.data?.branch_id
}
