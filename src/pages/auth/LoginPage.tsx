import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import { useLoginMutation } from '@/store/auth/auth.api'
import { useHandleRequest } from '@/hooks/use-handle-request'

type LoginFormData = {
  phone: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loginUser, { isLoading }] = useLoginMutation()

  const handleRequets = useHandleRequest()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    await handleRequets({
      request: async () => {
        const result = await loginUser(data)
        return result
      },
      onSuccess: () => {
        window.location.href = '/'
      },
      onError: (error) => {
        console.log(error)
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Tizimga kirish
          </CardTitle>
          <CardDescription className="text-center">
            Iltimos, hisobingizga kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefon raqam
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998 ** *** ** **"
                className="w-full"
                {...register('phone', {
                  required: 'Telefon raqamni kiriting',
                  pattern: {
                    value: /^\+998\d{9}$/,
                    message: "Iltimos, to'g'ri telefon raqam kiriting",
                  },
                })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Parol
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pr-10"
                  {...register('password', {
                    required: 'Parolni kiriting',
                    minLength: {
                      value: 6,
                      message:
                        "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#0F172A] hover:bg-[#1E293B]"
              disabled={isLoading}
            >
              {isLoading ? 'Kiritilmoqda...' : 'Kirish'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
