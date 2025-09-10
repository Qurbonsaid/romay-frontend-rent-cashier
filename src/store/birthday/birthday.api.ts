import baseApi from '../api'
import type { GetBirthdaysResponse } from './types'
import type { GetBirthdaysRequest } from './types'
import type { AddBirthdayRequest } from './types'
import type { AddBirthdayResponse } from './types'
import type { UpdateBirthdayRequest } from './types'
import type { UpdateBirthdayResponse } from './types'

export const birthdayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all birthdays
    getBirthdays: builder.query<GetBirthdaysResponse, GetBirthdaysRequest>({
      query: ({ month, page = 1, limit = 10, search = '' }) => ({
        url: '/birthdays',
        method: 'GET',
        params: {
          month,
          page,
          limit,
          search,
        },
      }),
      providesTags: ['birthdays'],
    }),

    // Add a new birthday
    addBirthday: builder.mutation<AddBirthdayResponse, AddBirthdayRequest>({
      query: (body) => ({
        url: '/birthdays',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['birthdays'],
    }),

    // Update a birthday
    updateBirthday: builder.mutation<
      UpdateBirthdayResponse,
      UpdateBirthdayRequest
    >({
      query: ({ id, body }) => ({
        url: `/birthdays/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['birthdays'],
    }),

    // Delete a birthday
    deleteBirthday: builder.mutation<void, string>({
      query: (id) => ({
        url: `/birthdays/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['birthdays'],
    }),
  }),
})

export const {
  useGetBirthdaysQuery,
  useAddBirthdayMutation,
  useUpdateBirthdayMutation,
  useDeleteBirthdayMutation,
} = birthdayApi
