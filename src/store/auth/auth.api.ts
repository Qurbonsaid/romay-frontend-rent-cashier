import baseApi from '../api'
import { setAuthTokens } from '@/utils/auth'
import type { LoginRequest, LoginResponse, UserResponse } from './auth'

type ApiError = {
  status: number
  data: unknown
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if ('access_token' in data && 'refresh_token' in data) {
            setAuthTokens({
              access_token: data.access_token as string,
              refresh_token: data.refresh_token as string,
            })
          }
        } catch (error: unknown) {
          console.error('Login failed:', (error as ApiError)?.data || error)
        }
      },
      invalidatesTags: ['user'],
    }),
    user: builder.query<UserResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['user'],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          console.error(
            'User fetch failed:',
            (error as ApiError)?.data || error
          )
        }
      },
    }),
  }),
})

export const { useLoginMutation, useUserQuery, useLazyUserQuery } = authApi
