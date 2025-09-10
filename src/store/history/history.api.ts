import baseApi from '../api'
import type { GetHistoryResponse, GetOneHistoryResponse } from './types'
import type { GetHistoryRequest } from './types'

export const historyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHistory: builder.query<GetHistoryResponse, GetHistoryRequest>({
      query: (params) => ({
        url: '/history/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['history'],
    }),
    getOneHistory: builder.query<GetOneHistoryResponse, string>({
      query: (id) => ({
        url: `/history/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['history'],
    }),
    deleteHistory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/history/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['history'],
    }),
  }),
})

export const {
  useGetHistoryQuery,
  useGetOneHistoryQuery,
  useDeleteHistoryMutation,
} = historyApi
