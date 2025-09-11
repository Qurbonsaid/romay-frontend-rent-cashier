import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useUserQuery } from '@/store/auth/auth.api'
import { getAuthToken } from '@/utils/auth'

export const PrivateRoute = () => {
  const { data: userData, isLoading: userLoading, isError } = useUserQuery()
  const token = getAuthToken()

  if (userLoading)
    return (
      <div className="flex fixed z-50 top-0 left-0 bg-white/50 items-center justify-center  w-full h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )

  if (isError || !userData || !token) {
    console.log('User is not authenticated, redirecting to login...')
    return <Navigate to={'/auth/login'} />
  }

  return <Outlet />
}
