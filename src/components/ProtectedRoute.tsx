import { Navigate, Outlet } from 'react-router-dom'
import { useUserQuery } from '@/store/auth/auth.api'

export const ProtectedRoute = () => {
  const { data: user, isLoading, isError } = useUserQuery()

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        Yuklanmoqda...
      </div>
    )
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
