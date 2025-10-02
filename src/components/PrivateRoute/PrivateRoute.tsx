import { Navigate, Outlet } from 'react-router-dom'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import { useUserQuery } from '@/store/auth/auth.api'
import { getAuthToken } from '@/utils/auth'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const PrivateRoute = () => {
  const {
    data: userData,
    isLoading: userLoading,
    isError,
    error,
  } = useUserQuery()
  const token = getAuthToken()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Internet holatini kuzatish
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (userLoading)
    return (
      <div className="flex fixed z-50 top-0 left-0 bg-white/50 items-center justify-center  w-full h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )

  // Internet yo'q bo'lsa
  if (!isOnline) {
    return (
      <div className="flex fixed z-50 top-0 left-0 bg-yellow-50 items-center justify-center w-full h-screen">
        <div className="text-center">
          <WifiOff className="mx-auto mb-4 h-12 w-12 text-yellow-600" />
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            Internet aloqasi yo'q
          </h2>
          <p className="text-yellow-600 mb-4">
            Internet aloqasini tekshiring va qayta urinib ko'ring
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-yellow-500">
            <div className="animate-pulse">Aloqani kuzatmoqda...</div>
          </div>
        </div>
      </div>
    )
  }

  // Token yo'q bo'lsa (haqiqiy auth muammosi)
  if (!token) {
    toast.error('Tizimda xatolik, Iltimos qaytadan kiring')
    return <Navigate to={'/auth/login'} replace />
  }

  // Network xatoligi bo'lsa lekin online bo'lsa - retry ko'rsatish
  if (isError && isOnline) {
    const errorStatus = (error as any)?.status

    // 401 - token yaroqsiz
    if (errorStatus === 401) {
      toast.error('Tizimda xatolik, Iltimos qaytadan kiring')
      return <Navigate to={'/auth/login'} replace />
    }

    // Boshqa server xatoliklari - retry
    if (errorStatus >= 500) {
      return (
        <div className="flex fixed z-50 top-0 left-0 bg-red-50 items-center justify-center w-full h-screen">
          <div className="text-center">
            <Wifi className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Server xatoligi
            </h2>
            <p className="text-red-600 mb-4">
              Serverga ulanishda muammo. Qayta urinib ko'ring
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Qayta yuklash
            </button>
          </div>
        </div>
      )
    }
  }

  // User data yo'q bo'lsa va xatolik yo'q bo'lsa - loading holati
  if (!userData && !isError) {
    return (
      <div className="flex fixed z-50 top-0 left-0 bg-white/50 items-center justify-center  w-full h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  // User data bor lekin role noto'g'ri
  if (userData && userData.data.role !== 'rent_cashier') {
    return (
      <div className="flex fixed z-50 top-0 left-0 bg-red-50 items-center justify-center w-full h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Tizimga kirishda xatolik
          </h2>
          <p className="text-red-500">
            Siz bu tizimga kirishga ruxsatingiz yo'q, bu ilova siz uchun emas.
          </p>
          <button
            onClick={() => (window.location.href = '/auth/login')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Qaytadan kirish
          </button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
